const fs = require('fs');
const https = require('https');

// Extract key manually
const env = fs.readFileSync('.env', 'utf8');
const key = env.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim()?.replace(/["']/g, '');

if (!key) {
  console.log('Error: GEMINI_API_KEY not found in .env');
  process.exit(1);
}

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const data = JSON.parse(body);
    if (data.models) {
      console.log('\n--- AVAILABLE MODELS ---');
      data.models.forEach(m => {
        if (m.supportedGenerationMethods.includes('generateContent')) {
          console.log(`   - ${m.name.split('/')[1]}`);
        }
      });
    } else {
      console.log('API Error:', body);
    }
  });
});
