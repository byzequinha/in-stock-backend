import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: 'admin',
  host: '172.19.0.3', // Substituído pelo IP do contêiner PostgreSQL
  database: 'in_stock',
  password: 'admin123',
  port: 5432,
});

export default pool;
