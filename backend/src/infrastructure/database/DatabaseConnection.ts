import { Pool } from 'pg';

export class DatabaseConnection {
  private static instance: Pool;
  
  public static getInstance(): Pool {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new Pool({
        user: process.env.POSTGRES_USER || 'admin',
        host: process.env.POSTGRES_HOST || 'localhost',
        database: process.env.POSTGRES_DB || 'commerce_db',
        password: process.env.POSTGRES_PASSWORD || 'admin',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    }
    
    return DatabaseConnection.instance;
  }
  
  public static async close(): Promise<void> {
    if (DatabaseConnection.instance) {
      await DatabaseConnection.instance.end();
    }
  }
}
