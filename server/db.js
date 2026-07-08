import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config({ quiet: true });

export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '123456',
  database: process.env.DB_NAME ?? 'zenithscope',
  charset: 'utf8mb4',
  timezone: '+08:00',
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}
