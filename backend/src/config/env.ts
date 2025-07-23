import dotenv from 'dotenv';
dotenv.config();


export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000; 
