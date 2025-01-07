import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Configuração do Pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // Deve ser uma string
  database: process.env.DB_NAME,
});

// Log de eventos do pool
pool.on("connect", () => {
  console.log("Database connected successfully");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
