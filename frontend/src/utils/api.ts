import { ApiResponse, SalesMetrics, ProductRanking, RevenueTrend, FilterOptions } from '@/types/api';

const API_BASE_URL = 'http://localhost:3001/api';

class ApiClient {
  private async request<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = `${API_BASE_URL}${endpoint}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else {
            searchParams.append(key, value);
          }
        }
      });
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse<T> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'API request failed');
    }

    return result.data;
  }

  async getSalesMetrics(filters: FilterOptions): Promise<SalesMetrics> {
    return this.request<SalesMetrics>('/kpis', {
      from: filters.dateRange.from,
      to: filters.dateRange.to,
      order_status: filters.orderStatus,
      product_category: filters.productCategory,
      customer_state: filters.customerState,
    });
  }

  async getTopProducts(
    dateRange: { from: string; to: string },
    metric: 'gmv' | 'revenue' = 'gmv',
    limit: number = 10,
    filters?: Omit<FilterOptions, 'dateRange'>
  ): Promise<ProductRanking[]> {
    return this.request<ProductRanking[]>('/rankings/products', {
      from: dateRange.from,
      to: dateRange.to,
      metric,
      limit,
      order_status: filters?.orderStatus,
      product_category: filters?.productCategory,
      customer_state: filters?.customerState,
    });
  }

  async getRevenueTrend(
    dateRange: { from: string; to: string },
    grain: 'day' | 'week' = 'day',
    filters?: Omit<FilterOptions, 'dateRange'>
  ): Promise<RevenueTrend[]> {
    return this.request<RevenueTrend[]>('/trend/revenue', {
      from: dateRange.from,
      to: dateRange.to,
      grain,
      order_status: filters?.orderStatus,
      product_category: filters?.productCategory,
      customer_state: filters?.customerState,
    });
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiClient = new ApiClient();
