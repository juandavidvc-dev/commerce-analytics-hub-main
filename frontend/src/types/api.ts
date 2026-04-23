export interface SalesMetrics {
  gmv: number;
  revenue: number;
  orders: number;
  aov: number;
  itemsPerOrder: number;
  cancellationRate: number;
  onTimeDeliveryRate: number;
}

export interface ProductRanking {
  productId: string;
  productCategory: string;
  gmv: number;
  revenue: number;
  rank: number;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
  orders: number;
}

export interface FilterOptions {
  dateRange: {
    from: string;
    to: string;
  };
  orderStatus?: string[];
  productCategory?: string[];
  customerState?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
