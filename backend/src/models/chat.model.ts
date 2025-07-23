import { pool } from '../config/db';

export const saveChat = async (chat: any) => {
  const { id, user_id, title, messages, createdAt, updatedAt } = chat;
  await pool.query(
    `INSERT INTO chats (id, user_id, title, messages, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title,
       messages = EXCLUDED.messages,
       updated_at = EXCLUDED.updated_at`,
    [id, user_id, title, JSON.stringify(messages), createdAt, updatedAt]
  );
};

export const getChatsByUser = async (user_id: string) => {
  const res = await pool.query(
    `SELECT * FROM chats WHERE user_id = $1 ORDER BY updated_at DESC`,
    [user_id]
  );
  return res.rows;
};