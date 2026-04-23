import { DatabaseConnection } from '../DatabaseConnection';

// Mock process.env
const originalEnv = process.env;

describe('DatabaseConnection', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should create singleton instance', () => {
    const instance1 = DatabaseConnection.getInstance();
    const instance2 = DatabaseConnection.getInstance();

    expect(instance1).toBe(instance2);
  });

  it('should create pool with default configuration', () => {
    delete process.env.POSTGRES_USER;
    delete process.env.POSTGRES_PASSWORD;
    delete process.env.POSTGRES_DB;
    delete process.env.POSTGRES_HOST;
    delete process.env.POSTGRES_PORT;

    const instance = DatabaseConnection.getInstance();
    
    expect(instance).toBeDefined();
    // The pool should be created with default values
    expect(instance.options.user).toBe('admin');
    expect(instance.options.host).toBe('localhost');
    expect(instance.options.database).toBe('commerce_db');
    expect(instance.options.password).toBe('admin');
    expect(instance.options.port).toBe(5432);
  });

  it('should create pool with environment variables', () => {
    // Reset singleton instance by clearing the static property
    (DatabaseConnection as any).instance = undefined;
    
    process.env.POSTGRES_USER = 'testuser';
    process.env.POSTGRES_PASSWORD = 'testpass';
    process.env.POSTGRES_DB = 'testdb';
    process.env.POSTGRES_HOST = 'testhost';
    process.env.POSTGRES_PORT = '5433';

    const instance = DatabaseConnection.getInstance();
    
    expect(instance.options.user).toBe('testuser');
    expect(instance.options.host).toBe('testhost');
    expect(instance.options.database).toBe('testdb');
    expect(instance.options.password).toBe('testpass');
    expect(instance.options.port).toBe(5433);
  });

  it('should have correct pool configuration', () => {
    const instance = DatabaseConnection.getInstance();
    
    expect(instance.options.max).toBe(20);
    expect(instance.options.idleTimeoutMillis).toBe(30000);
    expect(instance.options.connectionTimeoutMillis).toBe(2000);
  });
});
