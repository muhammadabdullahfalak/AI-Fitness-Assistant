import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/user.model';
import { OAuth2Client } from 'google-auth-library';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const existing = await findUserByEmail(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const password_hash = await bcrypt.hash(password, 10);
  const user = await createUser(email, password_hash, 'local');

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
  res.json({
    success: true,
    data: {
      token,
      user: { id: user.id, email: user.email }
    }
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
  res.json({
    success: true,
    data: {
      token,
      user: { id: user.id, email: user.email }
    }
  });
};

export const logout = async (_req: Request, res: Response) => {
  // For JWT, logout is handled on the client by deleting the token.
  res.json({ message: 'Logged out' });
};

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleAuth = async (req: Request, res: Response) => {
  const { id_token } = req.body;
  if (!id_token) return res.status(400).json({ error: 'No Google ID token provided' });

  try {
    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }
    const email = payload.email;

    // Find or create user
    let user = await findUserByEmail(email);
    if (!user) {
      // Google users don't have a password hash
      user = await createUser(email, null, 'google');
    }

    // Issue JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email }
      }
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(401).json({ error: 'Google authentication failed' });
  }
};
