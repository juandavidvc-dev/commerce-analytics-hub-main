import { Request, Response } from 'express';
import { SalesController } from '../SalesController';
import { GetSalesMetrics } from '../../../../application/usecases/GetSalesMetrics';
import { GetTopProducts } from '../../../../application/usecases/GetTopProducts';
import { GetRevenueTrend } from '../../../../application/usecases/GetRevenueTrend';
import { SalesMetrics, FilterOptions } from '../../../../domain/entities/SalesMetrics';

// Mock de los use cases
class MockGetSalesMetrics {
  async execute(filters: FilterOptions): Promise<SalesMetrics> {
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
}

class MockGetTopProducts {
  async execute(request: any): Promise<any[]> {
    return [
      {
        productId: 'PROD_001',
        productCategory: 'Category_A',
        gmv: 1000,
        revenue: 950,
        rank: 1
      }
    ];
  }
}

class MockGetRevenueTrend {
  async execute(request: any): Promise<any[]> {
    return [
      {
        date: new Date('2023-01-01'),
        revenue: 1000,
        orders: 10
      }
    ];
  }
}

describe('SalesController', () => {
  let salesController: SalesController;
  let mockGetSalesMetrics: MockGetSalesMetrics;
  let mockGetTopProducts: MockGetTopProducts;
  let mockGetRevenueTrend: MockGetRevenueTrend;

  beforeEach(() => {
    mockGetSalesMetrics = new MockGetSalesMetrics();
    mockGetTopProducts = new MockGetTopProducts();
    mockGetRevenueTrend = new MockGetRevenueTrend();
    
    salesController = new SalesController(
      mockGetSalesMetrics as any,
      mockGetTopProducts as any,
      mockGetRevenueTrend as any
    );
  });

  describe('getMetrics', () => {
    it('should return sales metrics for valid filters', async () => {
      const req = {
        query: {
          from: '2023-01-01',
          to: '2023-01-31'
        }
      } as unknown as Request;

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      } as unknown as Response;

      await salesController.getMetrics(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          gmv: 10000,
          revenue: 9500,
          orders: 50,
          aov: 190,
          itemsPerOrder: 1.2,
          cancellationRate: 5.5,
          onTimeDeliveryRate: 92.3
        }
      });
    });

    it('should return 400 error for missing date parameters', async () => {
      const req = {
        query: {}
      } as unknown as Request;

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      } as unknown as Response;

      await salesController.getMetrics(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Los parámetros "from" y "to" son obligatorios'
      });
    });

    it('should return 400 error for invalid date format', async () => {
      const req = {
        query: {
          from: 'invalid-date',
          to: '2023-01-31'
        }
      } as unknown as Request;

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      } as unknown as Response;

      await salesController.getMetrics(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Las fechas deben tener un formato válido (YYYY-MM-DD)'
      });
    });
  });

  describe('getTopProducts', () => {
    it('should return top products for valid request', async () => {
      const req = {
        query: {
          from: '2023-01-01',
          to: '2023-01-31',
          metric: 'gmv',
          limit: '10'
        }
      } as unknown as Request;

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      } as unknown as Response;

      await salesController.getTopProducts(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [
          {
            productId: 'PROD_001',
            productCategory: 'Category_A',
            gmv: 1000,
            revenue: 950,
            rank: 1
          }
        ]
      });
    });
  });

  describe('getRevenueTrend', () => {
    it('should return revenue trend for valid request', async () => {
      const req = {
        query: {
          from: '2023-01-01',
          to: '2023-01-31',
          grain: 'day'
        }
      } as unknown as Request;

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      } as unknown as Response;

      await salesController.getRevenueTrend(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [
          {
            date: new Date('2023-01-01'),
            revenue: 1000,
            orders: 10
          }
        ]
      });
    });
  });
});
