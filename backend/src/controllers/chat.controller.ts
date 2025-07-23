import { Request, Response } from 'express';
import { pool } from '../config/db';

export const saveChat = async (req: Request, res: Response) => {
  const { id, user_id, title, messages, createdAt, updatedAt } = req.body;
  try {
    await pool.query(
      `INSERT INTO chats (id, user_id, title, messages, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         messages = EXCLUDED.messages,
         updated_at = EXCLUDED.updated_at`,
      [id, user_id, title, JSON.stringify(messages), createdAt, updatedAt]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to save chat' });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  const { user_id } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM chats WHERE user_id = $1 ORDER BY updated_at DESC',
      [user_id]
    );
    res.json({ success: true, threads: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch chat history' });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  const { threadId } = req.params;
  try {
    await pool.query('DELETE FROM chats WHERE id = $1', [threadId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to delete chat' });
  }
};