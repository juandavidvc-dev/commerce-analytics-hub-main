import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { DatabaseConnection } from './infrastructure/database/DatabaseConnection';
import { PostgresSalesRepository } from './infrastructure/database/PostgresSalesRepository';
import { GetSalesMetrics } from './application/usecases/GetSalesMetrics';
import { GetTopProducts } from './application/usecases/GetTopProducts';
import { GetRevenueTrend } from './application/usecases/GetRevenueTrend';
import { SalesController } from './adapters/http/controllers/SalesController';
import { createSalesRoutes } from './adapters/http/routes/salesRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Rate limiting: 100 peticiones por 15 minutos por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones
  message: {
    success: false,
    error: 'Demasiadas peticiones, por favor intente más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS restrictivo - solo permite orígenes específicos
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Permitir orígenes sin origen (móvil, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Endpoint de verificación de salud
app.get('/health', async (req, res) => {
  try {
    const pool = DatabaseConnection.getInstance();
    const result = await pool.query('SELECT NOW() as timestamp, version() as version');
    
    res.json({
      status: 'OK',
      timestamp: result.rows[0].timestamp,
      version: result.rows[0].version,
      uptime: process.uptime()
    });
  } catch (error: any) {
    console.error('Error en verificación de salud:', error);
    res.status(503).json({
      status: 'ERROR',
      error: error.message
    });
  }
});

// Inicializar dependencias
async function initializeApp() {
  try {
    const pool = DatabaseConnection.getInstance();
    
    // Repositorios
    const salesRepository = new PostgresSalesRepository(pool);
    
    // Casos de uso
    const getSalesMetrics = new GetSalesMetrics(salesRepository);
    const getTopProducts = new GetTopProducts(salesRepository);
    const getRevenueTrend = new GetRevenueTrend(salesRepository);
    
    // Controladores
    const salesController = new SalesController(
      getSalesMetrics,
      getTopProducts,
      getRevenueTrend
    );
    
    // Rutas
    app.use('/api', createSalesRoutes(salesController));
    
    // Endpoint raíz
    app.get('/', (req, res) => {
      res.json({
        message: 'Commerce Analytics Hub API',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          kpis: '/api/kpis',
          topProducts: '/api/rankings/products',
          revenueTrend: '/api/trend/revenue'
        }
      });
    });
    
    // Middleware de manejo de errores
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Error no manejado:', err);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    });
    
    // Manejador 404
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint no encontrado'
      });
    });
    
    app.listen(PORT, () => {
      console.log(`? Commerce Analytics Hub API corriendo en puerto ${PORT}`);
      console.log(`? Verificación de salud: http://localhost:${PORT}/health`);
      console.log(`? Endpoints API: http://localhost:${PORT}/api`);
    });
    
  } catch (error) {
    console.error('Error al inicializar aplicación:', error);
    process.exit(1);
  }
}

// Apagado elegante
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido, apagando elegantemente');
  await DatabaseConnection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recibido, apagando elegantemente');
  await DatabaseConnection.close();
  process.exit(0);
});

// Iniciar aplicación
initializeApp();
