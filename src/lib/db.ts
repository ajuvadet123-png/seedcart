import pg from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:2wrNRW-8xX!Gf_T@db.wfwnycshxwingwqeljfg.supabase.co:5432/postgres';

// Maintain a single pool instance across hot reloads in development
declare global {
  var _pgPool: pg.Pool | undefined;
}

const pool = global._pgPool || new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
});

if (process.env.NODE_ENV !== 'production') {
  global._pgPool = pool;
}

export async function query<T extends pg.QueryResultRow = any>(text: string, params?: any[]): Promise<pg.QueryResult<T>> {
  const client = await pool.connect();
  try {
    return await client.query<T>(text, params);
  } finally {
    client.release();
  }
}

export async function getClient() {
  return await pool.connect();
}

export default pool;
