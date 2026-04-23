import { SalesMetrics, FilterOptions } from '../SalesMetrics';

describe('SalesMetrics', () => {
  describe('FilterOptions validation', () => {
    it('should create valid filter options with required fields', () => {
      const filters: FilterOptions = {
        dateRange: {
          from: new Date('2023-01-01'),
          to: new Date('2023-01-31')
        }
      };

      expect(filters.dateRange.from).toBeInstanceOf(Date);
      expect(filters.dateRange.to).toBeInstanceOf(Date);
      expect(filters.dateRange.from < filters.dateRange.to).toBe(true);
    });

    it('should handle optional filter fields', () => {
      const filters: FilterOptions = {
        dateRange: {
          from: new Date('2023-01-01'),
          to: new Date('2023-01-31')
        },
        orderStatus: ['delivered', 'shipped'],
        productCategory: ['electronics'],
        customerState: ['SP', 'RJ']
      };

      expect(filters.orderStatus).toEqual(['delivered', 'shipped']);
      expect(filters.productCategory).toEqual(['electronics']);
      expect(filters.customerState).toEqual(['SP', 'RJ']);
    });
  });

  describe('SalesMetrics structure', () => {
    it('should have all required metric fields', () => {
      const metrics: SalesMetrics = {
        gmv: 10000,
        revenue: 9500,
        orders: 50,
        aov: 190,
        itemsPerOrder: 1.2,
        cancellationRate: 5.5,
        onTimeDeliveryRate: 92.3
      };

      expect(typeof metrics.gmv).toBe('number');
      expect(typeof metrics.revenue).toBe('number');
      expect(typeof metrics.orders).toBe('number');
      expect(typeof metrics.aov).toBe('number');
      expect(typeof metrics.itemsPerOrder).toBe('number');
      expect(typeof metrics.cancellationRate).toBe('number');
      expect(typeof metrics.onTimeDeliveryRate).toBe('number');
    });
  });
});
