import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn("DATABASE_URL is not defined in environment variables. DB functionality will fail.");
    }
    pool = new Pool({
      connectionString,
      ssl: connectionString?.includes('localhost') || connectionString?.includes('127.0.0.1')
        ? false 
        : { rejectUnauthorized: false }
    });
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const p = getPool();
  return p.query(text, params);
}
