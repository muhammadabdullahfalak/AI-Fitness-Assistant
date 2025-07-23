import express from 'express';
import cors from 'cors';
import geminiRouter from './routes/gemini.routes';
import authRouter from './routes/auth.routes';
import { Request, Response, NextFunction } from 'express';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/gemini', geminiRouter);
app.use('/api/auth', authRouter);

// Error handler (must be after all routes)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ text: 'Internal server error' });
});

export default app;
