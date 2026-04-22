import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configuración de seguridad
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por ventana
  message: { error: 'Demasiadas peticiones, intente más tarde' }
});

// Middleware de seguridad
app.use(limiter);
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging seguro
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Conexión a la base de datos
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'admin',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'commerce_db',
  password: process.env.POSTGRES_PASSWORD || 'admin',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

// Endpoint de prueba para conexión
app.get('/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as tiempo, version() as version');
    res.json({ exito: true, datos: result.rows[0] });
  } catch (error: any) {
    console.error('Error en prueba:', error);
    res.status(500).json({ exito: false, error: error.message });
  }
});

// Endpoint de KPIs
app.get('/kpis', async (req, res) => {
  try {
    // Primero verificar si la tabla existe
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'gold' 
        AND table_name = 'fact_sales'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      return res.status(404).json({ error: 'Tabla gold.fact_sales no existe' });
    }
    
    const query = `
      SELECT 
        SUM(total_amount) as gmv,
        SUM(payment_value_allocated) as ingresos,
        COUNT(DISTINCT order_id) as pedidos,
        AVG(total_amount) as valor_promedio_pedido
      FROM gold.fact_sales
      WHERE is_canceled = false
    `;
    
    const result = await pool.query(query);
    const kpis = result.rows[0];
    
    res.json(kpis);
  } catch (error: any) {
    console.error('Error al obtener KPIs:', error);
    res.status(500).json({ error: 'Error en la consulta', detalles: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
