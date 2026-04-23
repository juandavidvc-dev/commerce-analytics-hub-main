import { GetSalesMetrics } from '../GetSalesMetrics';
import { ISalesRepository } from '../../../domain/repositories/SalesRepository';
import { SalesMetrics, FilterOptions } from '../../../domain/entities/SalesMetrics';

// Mock repository
class MockSalesRepository implements ISalesRepository {
  async getSalesMetrics(filters: FilterOptions): Promise<SalesMetrics> {
    return {
      gmv: 10000,
      revenue: 9500,
      orders: 50,
      aov: 190,
      itemsPerOrder: 1.2,
      cancellationRate: 5.5,
      onTimeDeliveryRate: 92.3
    };
  }

  async getTopProducts(): Promise<any[]> {
    return [];
  }

  async getRevenueTrend(): Promise<any[]> {
    return [];
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}

describe('GetSalesMetrics', () => {
  let getSalesMetrics: GetSalesMetrics;
  let mockRepository: ISalesRepository;

  beforeEach(() => {
    mockRepository = new MockSalesRepository();
    getSalesMetrics = new GetSalesMetrics(mockRepository);
  });

  it('should return sales metrics for valid date range', async () => {
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);
    
    const filters: FilterOptions = {
      dateRange: {
        from: lastMonth,
        to: now
      }
    };

    const result = await getSalesMetrics.execute(filters);

    expect(result).toEqual({
      gmv: 10000,
      revenue: 9500,
      orders: 50,
      aov: 190,
      itemsPerOrder: 1.2,
      cancellationRate: 5.5,
      onTimeDeliveryRate: 92.3
    });
  });

  it('should throw error for invalid date range (from > to)', async () => {
    const filters: FilterOptions = {
      dateRange: {
        from: new Date('2023-01-31'),
        to: new Date('2023-01-01')
      }
    };

    await expect(getSalesMetrics.execute(filters)).rejects.toThrow(
      'La fecha de inicio no puede ser mayor a la fecha de fin'
    );
  });

  it('should throw error for date range greater than 1 year', async () => {
    const filters: FilterOptions = {
      dateRange: {
        from: new Date('2022-01-01'),
        to: new Date('2023-01-31')
      }
    };

    await expect(getSalesMetrics.execute(filters)).rejects.toThrow(
      'El rango de fechas no puede ser mayor a 1 año'
    );
  });
});
