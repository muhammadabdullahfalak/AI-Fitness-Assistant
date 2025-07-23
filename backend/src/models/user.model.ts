import { pool } from '../config/db';

export const findUserByEmail = async (email: string) => {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};

export const createUser = async (email: string, password_hash: string) => {
  const res = await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
    [email, password_hash]
  );
  return res.rows[0];
};
