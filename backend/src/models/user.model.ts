import { pool } from '../config/db';

export const findUserByEmail = async (email: string) => {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};

export const createUser = async (email: string, password_hash: string | null, provider:string | 'local') => {
  const res = await pool.query(
    'INSERT INTO users (email, password_hash, provider) VALUES ($1, $2, $3) RETURNING *',
    [email, password_hash, provider]
  );
  return res.rows[0];
};
