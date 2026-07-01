import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

function checkAuth(request: Request): boolean {
  const secret = process.env.PASSWORD;
  if (!secret) return false;
  
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '').trim();
  return token === secret;
}

/**
 * POST /api/monitor/diagnose
 * Body: { logId: string }
 * Returns AI-generated diagnostics and fix suggestions
 */
export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { logId } = await request.json().catch(() => ({}));
    if (!logId) {
      return NextResponse.json({ success: false, error: 'Log ID is required' }, { status: 400 });
    }

    const log = await db.clientLog.findUnique({
      where: { id: logId },
      include: { client: true }
    });

    if (!log) {
      return NextResponse.json({ success: false, error: 'Log not found' }, { status: 404 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Gemini API Key is not configured on the server. Please add GEMINI_API_KEY to your .env file.' 
      }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const prompt = `
You are PROmonitor SRE AI, an expert Software Reliability Engineer.
Analyze the following error log reported by the client website "${log.client.name}" (URL: ${log.client.url}) and provide a clear diagnosis and fix.

Error Details:
- Log Level: ${log.level}
- Message: ${log.message}
- Timestamp: ${log.timestamp}
${log.stack ? `- Stack Trace:\n${log.stack}` : ''}
${log.metadata ? `- Browser/Device Metadata:\n${log.metadata}` : ''}

Provide your analysis in JSON format with exactly the following keys. Return ONLY valid JSON. Do not wrap the JSON output in markdown tags (like \`\`\`json ... \`\`\`), do not output any other text:
{
  "summary": "A 1-2 sentence plain-English explanation of what this error is.",
  "cause": "A brief explanation of why this error happened and where in the code it originates from.",
  "fix": "A step-by-step instruction on how to resolve the error, including a code block snippet if appropriate.",
  "autofix": {
    "filePath": "Relative path of the file to modify, e.g., 'src/components/Header.tsx' or 'app/page.tsx'. Use null if unknown or if the fix requires multi-file/complex restructuring.",
    "targetCode": "The exact contiguous block of code from the file that needs to be replaced. Must match exactly, including leading spaces/indentation. Use null if not applicable.",
    "replacementCode": "The corrected code to substitute in place of targetCode. Use null if not applicable."
  }
}
`;

    const fallbackModels = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-pro',
      'gemini-2.5-pro',
      'gemini-1.5-flash',
      'gemini-pro'
    ];

    let text = "";
    let lastError: any = null;

    const errors: string[] = [];

    for (const modelName of fallbackModels) {
      try {
        console.log(`[PROmonitor SRE AI] Requesting diagnosis with model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const resText = response.text().trim();
        if (resText) {
          text = resText;
          break; // Success!
        }
      } catch (err: any) {
        console.warn(`[PROmonitor SRE AI] Model ${modelName} failed:`, err.message || err);
        errors.push(`${modelName} (${err.status || err.code || 'error'}): ${err.message || err}`);
        lastError = err;
      }
    }

    if (!text) {
      return NextResponse.json({
        success: false,
        error: `All Gemini models failed. Details: ${errors.join(' | ')}`
      }, { status: 500 });
    }
    
    // Strip markdown wrappers if the AI returned them despite the prompt instructions
    let jsonText = text;
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    }

    try {
      const diagnosis = JSON.parse(jsonText);
      return NextResponse.json({ success: true, diagnosis });
    } catch (parseError) {
      console.warn("AI failed to return valid JSON, raw text:", text);
      return NextResponse.json({ 
        success: true, 
        diagnosis: {
          summary: "Could not parse AI response structured data.",
          cause: "The AI did not output standard JSON format.",
          fix: text
        }
      });
    }

  } catch (error: any) {
    console.error('AI Diagnostics Exception:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
