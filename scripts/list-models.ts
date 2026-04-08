import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    // Using the base client to list models
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await resp.json();
    
    console.log('Available Models:');
    data.models?.forEach((m: any) => {
      if (m.supportedGenerationMethods.includes('generateContent')) {
        console.log(` - ${m.name} (supports generateContent)`);
      }
    });
  } catch (err) {
    console.error('Failed to list models:', err);
  }
}

listModels();
