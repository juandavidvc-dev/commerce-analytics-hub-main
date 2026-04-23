import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'admin',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'commerce_db',
  password: process.env.POSTGRES_PASSWORD || 'admin',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

// Root endpoint
app.get('/', (_req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

// Test endpoint
app.get('/test', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as time');
    res.json({ success: true, time: result.rows[0].time });
  } catch (error: any) {
    console.error('Error en test:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// KPIs endpoint
app.get('/kpis', async (_req, res) => {
  try {
    const query = `
      SELECT 
        SUM(total_amount) as gmv,
        SUM(payment_value_allocated) as revenue,
        COUNT(DISTINCT order_id) as orders,
        AVG(total_amount) as aov
      FROM gold.fact_sales
      WHERE is_canceled = false
    `;
    
    const result = await pool.query(query);
    const kpis = result.rows[0];
    
    res.json(kpis);
  } catch (error: any) {
    console.error('Error fetching KPIs:', error);
    res.status(500).json({ error: 'Error en la consulta', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
