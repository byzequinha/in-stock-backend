import { Pool } from 'pg';

export const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'in_stock_db',
  password: 'admin',
  port: 5432,
});