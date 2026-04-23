export interface SalesMetrics {
  gmv: number;
  revenue: number;
  orders: number;
  aov: number;
  itemsPerOrder: number;
  cancellationRate: number;
  onTimeDeliveryRate: number;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface FilterOptions {
  dateRange: DateRange;
  orderStatus?: string[];
  productCategory?: string[];
  customerState?: string[];
}

export interface ProductRanking {
  productId: string;
  productCategory: string;
  gmv: number;
  revenue: number;
  rank: number;
}

export interface RevenueTrend {
  date: Date;
  revenue: number;
  orders: number;
}

export interface TopProductsRequest {
  dateRange: DateRange;
  metric: 'gmv' | 'revenue';
  limit: number;
  filters?: Omit<FilterOptions, 'dateRange'>;
}

export interface RevenueTrendRequest {
  dateRange: DateRange;
  grain: 'day' | 'week';
  filters?: Omit<FilterOptions, 'dateRange'>;
}
