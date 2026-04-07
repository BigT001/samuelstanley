import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  try {
    // We try to list models. If the library doesn't support listModels, 
    // we'll try a common one and see the error message which often lists available models.
    console.log('Checking available models for your API key...');
    const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await result.json();
    
    if (data.models) {
      console.log('\n✅ Available Models:');
      data.models.forEach((m: any) => {
        if (m.supportedGenerationMethods.includes('generateContent')) {
          console.log(`   - ${m.name.replace('models/', '')}`);
        }
      });
    } else {
      console.log('Could not list models. Error:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('List failed:', err);
  }
}

listModels();
