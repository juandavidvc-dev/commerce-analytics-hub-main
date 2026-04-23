import { Router } from 'express';
import { SalesController } from '../controllers/SalesController';

export function createSalesRoutes(salesController: SalesController): Router {
  const router = Router();

  // GET /api/kpis - Obtener métricas principales
  router.get('/kpis', salesController.getMetrics.bind(salesController));

  // GET /api/rankings/products - Obtener top productos
  router.get('/rankings/products', salesController.getTopProducts.bind(salesController));

  // GET /api/trend/revenue - Obtener tendencia de revenue
  router.get('/trend/revenue', salesController.getRevenueTrend.bind(salesController));

  return router;
}
