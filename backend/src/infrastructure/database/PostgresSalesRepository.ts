import { Pool } from 'pg';
import { ISalesRepository } from '../../domain/repositories/SalesRepository';
import { SalesMetrics, ProductRanking, RevenueTrend, TopProductsRequest, RevenueTrendRequest, FilterOptions } from '../../domain/entities/SalesMetrics';

export class PostgresSalesRepository implements ISalesRepository {
  constructor(private pool: Pool) {}

  async getSalesMetrics(filters: FilterOptions): Promise<SalesMetrics> {
    const whereClause = this.buildWhereClause(filters);
    
    const query = `
      WITH metrics AS (
        SELECT 
          SUM(item_price) as gmv,
          SUM(payment_value_allocated) as revenue,
          COUNT(DISTINCT order_id) as orders,
          COUNT(*) as total_items,
          COUNT(CASE WHEN is_canceled = true THEN 1 END) as canceled_orders,
          COUNT(CASE WHEN is_delivered = true THEN 1 END) as delivered_orders,
          COUNT(CASE WHEN is_delivered = true AND is_on_time = true THEN 1 END) as on_time_orders
        FROM gold.fact_sales fs
        WHERE ${whereClause}
      )
      SELECT 
        COALESCE(gmv, 0) as gmv,
        COALESCE(revenue, 0) as revenue,
        COALESCE(orders, 0) as orders,
        CASE 
          WHEN orders > 0 THEN ROUND(revenue / orders, 2)
          ELSE 0 
        END as aov,
        CASE 
          WHEN orders > 0 THEN ROUND(total_items::numeric / orders, 2)
          ELSE 0 
        END as "itemsPerOrder",
        CASE 
          WHEN orders > 0 THEN ROUND(canceled_orders::numeric / orders * 100, 2)
          ELSE 0 
        END as "cancellationRate",
        CASE 
          WHEN delivered_orders > 0 THEN ROUND(on_time_orders::numeric / delivered_orders * 100, 2)
          ELSE 0 
        END as "onTimeDeliveryRate"
      FROM metrics
    `;

    const params = this.buildQueryParams(filters.dateRange, filters);
    const result = await this.pool.query(query, params);
    return result.rows[0];
  }

  async getTopProducts(request: TopProductsRequest): Promise<ProductRanking[]> {
    const whereClause = this.buildWhereClause({
      dateRange: request.dateRange,
      ...request.filters
    });

    const orderBy = request.metric === 'gmv' ? 'fs.item_price' : 'fs.payment_value_allocated';
    
    const query = `
      SELECT 
        'PROD_' || fs.order_id as "productId",
        'Category_' || fs.order_status as "productCategory",
        fs.item_price as gmv,
        fs.payment_value_allocated as revenue,
        1 as rank
      FROM gold.fact_sales fs
      WHERE ${whereClause}
      ORDER BY ${orderBy} DESC
      LIMIT $${this.getParamIndex(whereClause) + 1}
    `;

    const params = this.buildQueryParams(request.dateRange, request.filters);
    params.push(request.limit);

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getRevenueTrend(request: RevenueTrendRequest): Promise<RevenueTrend[]> {
    const whereClause = this.buildWhereClause({
      dateRange: request.dateRange,
      ...request.filters
    });

    const dateFormat = request.grain === 'week' 
      ? "DATE_TRUNC('week', fs.order_date)" 
      : "DATE_TRUNC('day', fs.order_date)";

    const query = `
      SELECT 
        ${dateFormat}::date as date,
        SUM(fs.payment_value_allocated) as revenue,
        COUNT(DISTINCT fs.order_id) as orders
      FROM gold.fact_sales fs
      WHERE ${whereClause}
      GROUP BY ${dateFormat}
      ORDER BY date ASC
    `;

    const params = this.buildQueryParams(request.dateRange, request.filters);
    const result = await this.pool.query(query, params);
    
    return result.rows.map(row => ({
      ...row,
      revenue: parseFloat(row.revenue),
      orders: parseInt(row.orders)
    }));
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.pool.query('SELECT 1 as health');
      return result.rows[0].health === 1;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  private buildWhereClause(filters: FilterOptions): string {
    const conditions: string[] = [];
    
    // Siempre filtrar por rango de fechas
    conditions.push('fs.order_date >= $1 AND fs.order_date <= $2');
    
    let paramIndex = 3;
    
    if (filters.orderStatus && filters.orderStatus.length > 0) {
      const placeholders = filters.orderStatus.map((_, index) => `$${paramIndex++}`).join(', ');
      conditions.push(`fs.order_status IN (${placeholders})`);
    }
    
    if (filters.productCategory && filters.productCategory.length > 0) {
      const placeholders = filters.productCategory.map((_, index) => `$${paramIndex++}`).join(', ');
      conditions.push(`fs.product_category IN (${placeholders})`);
    }
    
    if (filters.customerState && filters.customerState.length > 0) {
      const placeholders = filters.customerState.map((_, index) => `$${paramIndex++}`).join(', ');
      conditions.push(`fs.customer_state IN (${placeholders})`);
    }

    return conditions.join(' AND ');
  }

  private buildQueryParams(dateRange: { from: Date; to: Date }, filters?: Omit<FilterOptions, 'dateRange'>): any[] {
    const params: any[] = [dateRange.from, dateRange.to];
    
    if (filters?.orderStatus) {
      params.push(...filters.orderStatus);
    }
    
    if (filters?.productCategory) {
      params.push(...filters.productCategory);
    }
    
    if (filters?.customerState) {
      params.push(...filters.customerState);
    }
    
    return params;
  }

  private getParamIndex(whereClause: string): number {
    const matches = whereClause.match(/\$\d+/g);
    return matches ? matches.length : 2;
  }
}
