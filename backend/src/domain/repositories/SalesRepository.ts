import { SalesMetrics, ProductRanking, RevenueTrend, TopProductsRequest, RevenueTrendRequest, FilterOptions } from '../entities/SalesMetrics';

export interface ISalesRepository {
  // KPIs principales
  getSalesMetrics(filters: FilterOptions): Promise<SalesMetrics>;
  
  // Rankings
  getTopProducts(request: TopProductsRequest): Promise<ProductRanking[]>;
  
  // Tendencias
  getRevenueTrend(request: RevenueTrendRequest): Promise<RevenueTrend[]>;
  
  // Verificación de conexión
  healthCheck(): Promise<boolean>;
}
