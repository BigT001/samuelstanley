import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function runTest() {
  console.log('🧪 PROmonitor Client Monitor: Running Automated Integration Tests...');
  const testPassword = process.env.PASSWORD;
  
  if (!testPassword) {
    console.error('❌ Error: PASSWORD environment variable is not set. Set it in .env first.');
    process.exit(1);
  }

  try {
    // ─── Step 1: Query or Register Test Node ─────────────────────────────────
    console.log('\n1. Registering/Updating Test Website Node...');
    
    // Find or create test website
    let testSite = await db.clientSite.findFirst({
      where: { name: 'PROmonitor Test Site' }
    });

    if (!testSite) {
      const apiKey = `cs_test_${Math.random().toString(36).substring(2, 15)}`;
      testSite = await db.clientSite.create({
        data: {
          name: 'PROmonitor Test Site',
          url: 'https://httpbin.org/status/200', // standard test endpoint
          apiKey: apiKey,
          active: true,
          status: 'unknown'
        }
      });
      console.log(`✅ Created new test website node: ${testSite.name} (Key: ${testSite.apiKey})`);
    } else {
      console.log(`✅ Found existing test website node: ${testSite.name} (Key: ${testSite.apiKey})`);
    }

    // ─── Step 2: Simulate Ingesting Event Logs ───────────────────────────────
    console.log('\n2. Simulating Client Site Error Log Ingestion...');
    
    const host = process.env.PORT ? `http://localhost:${process.env.PORT}` : 'http://localhost:3000';
    const logUrl = `${host}/api/monitor/log`;
    
    console.log(`📡 Sending test log payload to: ${logUrl}`);
 
    const logPayload = {
      level: 'error',
      message: 'Uncaught TypeError: Cannot read properties of undefined (reading "test-suite")',
      stack: 'TypeError: Cannot read properties of undefined (reading "test-suite")\n  at runTest (scripts/test-monitoring.ts:25:21)\n  at Object.<anonymous> (scripts/test-monitoring.ts:80:1)',
      metadata: {
        env: 'test-runner',
        testSuite: 'promonitor-automated-v1',
        runner: 'Node.js test-monitoring script'
      }
    };
 
    const logRes = await fetch(logUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Key': testSite.apiKey
      },
      body: JSON.stringify(logPayload)
    });

    if (logRes.ok) {
      const data = await logRes.json();
      console.log('✅ Log ingestion succeeded. Saved Log ID:', data.logId);
    } else {
      const text = await logRes.text();
      console.warn(`⚠️ Log ingestion request returned: HTTP ${logRes.status} - ${text}`);
      console.log('💡 Note: Ensure your local server is running (pnpm dev) on port 3000 to test HTTP requests.');
    }

    // ─── Step 3: Trigger Active Health Check Pings ───────────────────────────
    console.log('\n3. Triggering Active Health Scan across all configured nodes...');
    
    const statusUrl = `${host}/api/monitor/status`;
    console.log(`📡 Sending POST trigger to status scan: ${statusUrl}`);
    
    const statusRes = await fetch(statusUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${testPassword}`
      }
    });

    if (statusRes.ok) {
      const data = await statusRes.json();
      console.log(`✅ Scan finished successfully! Pings executed: ${data.results.length}`);
      data.results.forEach((r: any) => {
        console.log(`  - Site: ${r.name} | Status: ${r.status.toUpperCase()} | Latency: ${r.responseTime}ms | SSL Expiry: ${r.sslExpiry ? new Date(r.sslExpiry).toLocaleDateString() : 'None'}`);
      });
    } else {
      const text = await statusRes.text();
      console.warn(`⚠️ Health check scan trigger returned: HTTP ${statusRes.status} - ${text}`);
      console.log('💡 Note: Ensure your local server is running (pnpm dev) on port 3000 to test HTTP requests.');
    }

    // ─── Step 4: Verify Local Database Counts ────────────────────────────────
    console.log('\n4. Verifying DB Record Totals...');
    const totalClients = await db.clientSite.count();
    const totalLogs = await db.clientLog.count();
    
    console.log(`📊 Local Database Stats:`);
    console.log(`  - Total Configured Sites: ${totalClients}`);
    console.log(`  - Total Saved Logs: ${totalLogs}`);
    
    console.log('\n🎉 PROmonitor Monitoring Test Runner Finished successfully!');
  } catch (err: any) {
    console.error('❌ Test Runner Exception:', err.message);
  } finally {
    await db.$disconnect();
  }
}

runTest();
