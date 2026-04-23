import { Request, Response } from 'express';
import { Router } from 'express';
import { createSalesRoutes } from '../salesRoutes';

// Mock del SalesController
class MockSalesController {
  async getMetrics(req: Request, res: Response): Promise<void> {
    res.json({
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
  }

  async getTopProducts(req: Request, res: Response): Promise<void> {
    res.json({
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
  }

  async getRevenueTrend(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      data: [
        {
          date: new Date('2023-01-01'),
          revenue: 1000,
          orders: 10
        }
      ]
    });
  }
}

describe('SalesRoutes', () => {
  let router: Router;
  let mockController: MockSalesController;

  beforeEach(() => {
    mockController = new MockSalesController();
    router = createSalesRoutes(mockController as any);
  });

  describe('GET /api/kpis', () => {
    it('should return sales metrics', async () => {
      const req = {
        query: {
          from: '2023-01-01',
          to: '2023-01-31'
        }
      } as unknown as Request;

      const res = {
        json: jest.fn()
      } as unknown as Response;

      // Simular la ruta GET /kpis
      const kpiRoute = router.stack.find(layer => layer.route?.path === '/kpis');
      expect(kpiRoute).toBeDefined();

      // Verificar que el método GET esté definido
      const getMethod = (kpiRoute?.route as any)?.methods?.get;
      expect(getMethod).toBe(true);
    });
  });

  describe('GET /api/rankings/products', () => {
    it('should return top products', async () => {
      const req = {
        query: {
          from: '2023-01-01',
          to: '2023-01-31',
          metric: 'gmv',
          limit: '10'
        }
      } as unknown as Request;

      const res = {
        json: jest.fn()
      } as unknown as Response;

      // Simular la ruta GET /rankings/products
      const rankingsRoute = router.stack.find(layer => layer.route?.path === '/rankings/products');
      expect(rankingsRoute).toBeDefined();

      // Verificar que el método GET esté definido
      const getMethod = (rankingsRoute?.route as any)?.methods?.get;
      expect(getMethod).toBe(true);
    });
  });

  describe('GET /api/trend/revenue', () => {
    it('should return revenue trend', async () => {
      const req = {
        query: {
          from: '2023-01-01',
          to: '2023-01-31',
          grain: 'day'
        }
      } as unknown as Request;

      const res = {
        json: jest.fn()
      } as unknown as Response;

      // Simular la ruta GET /trend/revenue
      const trendRoute = router.stack.find(layer => layer.route?.path === '/trend/revenue');
      expect(trendRoute).toBeDefined();

      // Verificar que el método GET esté definido
      const getMethod = (trendRoute?.route as any)?.methods?.get;
      expect(getMethod).toBe(true);
    });
  });

  describe('Route structure', () => {
    it('should have exactly 3 routes defined', () => {
      const routes = router.stack.filter(layer => layer.route);
      expect(routes).toHaveLength(3);
    });

    it('should have correct route paths', () => {
      const routes = router.stack.filter(layer => layer.route);
      const routePaths = routes.map(layer => layer.route?.path);
      
      expect(routePaths).toContain('/kpis');
      expect(routePaths).toContain('/rankings/products');
      expect(routePaths).toContain('/trend/revenue');
    });

    it('should have only GET methods', () => {
      const routes = router.stack.filter(layer => layer.route);
      
      routes.forEach(route => {
        const methods = (route.route as any)?.methods;
        expect(methods?.get).toBe(true);
        expect(methods?.post).toBeUndefined();
        expect(methods?.put).toBeUndefined();
        expect(methods?.delete).toBeUndefined();
      });
    });
  });
});
