import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { GEMINI_API_KEY } from '../config/env';

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>,
  error?: { message?: string }
};

export const handleGemini = async (req: Request, res: Response) => {


  try {
    const { prompt } = req.body;
    if (!GEMINI_API_KEY) return res.status(500).json({ text: 'API key missing' });

    if (!prompt) return res.status(400).json({ text: "Prompt missing" });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json() as GeminiResponse;


    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      text = `Sorry, I can only answer fitness, health, nutrition, or workout-related questions. Please ask something related to fitness!`;
    }
    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ text: 'Internal server error' });
  }
};