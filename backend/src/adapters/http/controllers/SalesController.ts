import { Request, Response } from 'express';
import { GetSalesMetrics } from '../../../application/usecases/GetSalesMetrics';
import { GetTopProducts } from '../../../application/usecases/GetTopProducts';
import { GetRevenueTrend } from '../../../application/usecases/GetRevenueTrend';
import { FilterOptions, TopProductsRequest, RevenueTrendRequest } from '../../../domain/entities/SalesMetrics';

export class SalesController {
  constructor(
    private getSalesMetricsUseCase: GetSalesMetrics,
    private getTopProductsUseCase: GetTopProducts,
    private getRevenueTrendUseCase: GetRevenueTrend
  ) {}

  async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const filters = this.parseFilters(req.query);
      const metrics = await this.getSalesMetricsUseCase.execute(filters);
      
      res.json({
        success: true,
        data: metrics
      });
    } catch (error: any) {
      console.error('Error getting sales metrics:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getTopProducts(req: Request, res: Response): Promise<void> {
    try {
      const request = this.parseTopProductsRequest(req.query);
      const topProducts = await this.getTopProductsUseCase.execute(request);
      
      res.json({
        success: true,
        data: topProducts
      });
    } catch (error: any) {
      console.error('Error getting top products:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getRevenueTrend(req: Request, res: Response): Promise<void> {
    try {
      const request = this.parseRevenueTrendRequest(req.query);
      const trend = await this.getRevenueTrendUseCase.execute(request);
      
      res.json({
        success: true,
        data: trend
      });
    } catch (error: any) {
      console.error('Error getting revenue trend:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  private parseFilters(query: any): FilterOptions {
    const { from, to, order_status, product_category, customer_state } = query;

    if (!from || !to) {
      throw new Error('Los parámetros "from" y "to" son obligatorios');
    }

    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new Error('Las fechas deben tener un formato válido (YYYY-MM-DD)');
    }

    return {
      dateRange: {
        from: fromDate,
        to: toDate
      },
      orderStatus: order_status ? (Array.isArray(order_status) ? order_status : [order_status]) : undefined,
      productCategory: product_category ? (Array.isArray(product_category) ? product_category : [product_category]) : undefined,
      customerState: customer_state ? (Array.isArray(customer_state) ? customer_state : [customer_state]) : undefined
    };
  }

  private parseTopProductsRequest(query: any): TopProductsRequest {
    const { from, to, metric, limit, order_status, product_category, customer_state } = query;

    if (!from || !to) {
      throw new Error('Los parámetros "from" y "to" son obligatorios');
    }

    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new Error('Las fechas deben tener un formato válido (YYYY-MM-DD)');
    }

    const parsedLimit = limit ? parseInt(limit as string) : 10;
    if (isNaN(parsedLimit)) {
      throw new Error('El parámetro "limit" debe ser un número válido');
    }

    const parsedMetric = metric === 'revenue' ? 'revenue' : 'gmv';

    return {
      dateRange: {
        from: fromDate,
        to: toDate
      },
      metric: parsedMetric,
      limit: parsedLimit,
      filters: {
        orderStatus: order_status ? (Array.isArray(order_status) ? order_status : [order_status]) : undefined,
        productCategory: product_category ? (Array.isArray(product_category) ? product_category : [product_category]) : undefined,
        customerState: customer_state ? (Array.isArray(customer_state) ? customer_state : [customer_state]) : undefined
      }
    };
  }

  private parseRevenueTrendRequest(query: any): RevenueTrendRequest {
    const { from, to, grain, order_status, product_category, customer_state } = query;

    if (!from || !to) {
      throw new Error('Los parámetros "from" y "to" son obligatorios');
    }

    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new Error('Las fechas deben tener un formato válido (YYYY-MM-DD)');
    }

    const parsedGrain = grain === 'week' ? 'week' : 'day';

    return {
      dateRange: {
        from: fromDate,
        to: toDate
      },
      grain: parsedGrain,
      filters: {
        orderStatus: order_status ? (Array.isArray(order_status) ? order_status : [order_status]) : undefined,
        productCategory: product_category ? (Array.isArray(product_category) ? product_category : [product_category]) : undefined,
        customerState: customer_state ? (Array.isArray(customer_state) ? customer_state : [customer_state]) : undefined
      }
    };
  }
}
