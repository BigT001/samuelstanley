/**
 * Sends a webhook notification (Discord/Slack format detection)
 */
export async function sendWebhookAlert(
  webhookUrl: string,
  clientName: string,
  clientUrl: string,
  level: string,
  message: string,
  stack?: string
) {
  try {
    const isDiscord = webhookUrl.includes('discord.com');
    const isSlack = webhookUrl.includes('slack.com');

    let payload: any = {};

    if (isDiscord) {
      payload = {
        embeds: [{
          title: `🚨 Client Alert: ${clientName} — [${level.toUpperCase()}]`,
          description: `**Log Message:** ${message}`,
          url: clientUrl,
          color: level === 'fatal' ? 16711680 : 16750080, // Red for fatal, Orange/yellow for error/warn
          fields: [
            { name: 'Website URL', value: clientUrl, inline: true },
            { name: 'Time', value: new Date().toLocaleTimeString(), inline: true },
            ...(stack ? [{ name: 'Stack Trace', value: `\`\`\`js\n${stack.slice(0, 800)}\n\`\`\`` }] : []),
          ],
          footer: { text: 'Stanley PROmonitor Client Monitor' }
        }]
      };
    } else if (isSlack) {
      payload = {
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `🚨 *Client Alert: ${clientName}* — [${level.toUpperCase()}]\n*Message:* ${message}`
            }
          },
          {
            type: "context",
            elements: [
              { type: "mrkdwn", text: `*Site:* ${clientUrl} | *Time:* ${new Date().toLocaleTimeString()}` }
            ]
          },
          ...(stack ? [{
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Stack Trace:*\n\`\`\`js\n${stack.slice(0, 500)}\n\`\`\``
            }
          }] : [])
        ]
      };
    } else {
      // Generic JSON format
      payload = {
        event: 'PROmonitorAlert',
        clientName,
        clientUrl,
        level,
        message,
        stack,
        timestamp: new Date().toISOString(),
      };
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (err) {
    console.error('Failed to send webhook alert:', err);
    return false;
  }
}

export async function sendEmailAlert(
  toEmail: string,
  clientName: string,
  clientUrl: string,
  level: string,
  message: string,
  stack?: string
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Resend API key missing from environment variables');
    return false;
  }

  // Format level color and styling
  const badgeColor = level === 'fatal' ? '#ef4444' : level === 'error' ? '#f97316' : level === 'warn' ? '#f59e0b' : '#3b82f6';
  
  // Format HTML body
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>PROmonitor Alert</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #030712;
            color: #f3f4f6;
            margin: 0;
            padding: 24px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #0b0f19;
            border: 1px solid #1f2937;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
          }
          .header {
            padding: 24px;
            border-bottom: 1px solid #1f2937;
            background: linear-gradient(135deg, #0f172a, #0b0f19);
          }
          .badge {
            display: inline-block;
            padding: 4px 10px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            border-radius: 20px;
            background-color: ${badgeColor}20;
            color: ${badgeColor};
            border: 1px solid ${badgeColor}30;
            letter-spacing: 0.05em;
          }
          .title {
            margin: 12px 0 4px 0;
            font-size: 20px;
            font-weight: 800;
            color: #ffffff;
          }
          .subtitle {
            font-size: 12px;
            color: #9ca3af;
          }
          .content {
            padding: 24px;
          }
          .section-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #6b7280;
            margin-bottom: 8px;
          }
          .message-box {
            padding: 16px;
            background-color: #111827;
            border-left: 4px solid ${badgeColor};
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.5;
            color: #e5e7eb;
            margin-bottom: 20px;
          }
          .code-box {
            padding: 16px;
            background-color: #030712;
            border: 1px solid #1f2937;
            border-radius: 8px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 12px;
            line-height: 1.6;
            color: #ef4444;
            overflow-x: auto;
            white-space: pre-wrap;
            margin-bottom: 24px;
          }
          .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
            font-size: 13px;
          }
          .meta-table td {
            padding: 8px 0;
            border-bottom: 1px solid #1f2937;
          }
          .meta-label {
            color: #9ca3af;
            font-weight: 500;
            width: 120px;
          }
          .meta-value {
            color: #ffffff;
            font-family: ui-monospace, monospace;
          }
          .footer {
            padding: 20px 24px;
            background-color: #030712;
            border-top: 1px solid #1f2937;
            text-align: center;
            font-size: 11px;
            color: #4b5563;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #06b6d4, #0891b2);
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 24px;
            font-size: 13px;
            font-weight: 700;
            border-radius: 8px;
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="badge">${level}</div>
            <div class="title">New Client Telemetry Alert</div>
            <div class="subtitle">System has logged an event requiring immediate review.</div>
          </div>
          <div class="content">
            <div class="section-title">Log Message</div>
            <div class="message-box">
              ${message}
            </div>
            
            ${stack ? `
              <div class="section-title">Stack Trace</div>
              <div class="code-box">${stack.slice(0, 1000)}</div>
            ` : ''}
            
            <div class="section-title">Details</div>
            <table class="meta-table">
              <tr>
                <td class="meta-label">Client Site</td>
                <td class="meta-value" style="font-family: inherit; font-weight: bold; color: #22d3ee;">${clientName}</td>
              </tr>
              <tr>
                <td class="meta-label">Origin Url</td>
                <td class="meta-value">${clientUrl}</td>
              </tr>
              <tr>
                <td class="meta-label">Reported Time</td>
                <td class="meta-value">${new Date().toISOString()}</td>
              </tr>
            </table>

            <div style="text-align: center;">
              <a href="https://samuelstanley.com/os" class="btn" target="_blank">Open PROmonitor Dashboard</a>
            </div>
          </div>
          <div class="footer">
            This is an automated notification from Stanley PROmonitor.<br>
            Please do not reply directly to this email.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'PROmonitor Alerts <alerts@samuelstanley.com>',
        to: [toEmail],
        subject: `🚨 [${clientName}] PROmonitor Alert: ${level.toUpperCase()}`,
        html: html
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn('Resend API returned status:', res.status, errText);
      // Fallback sandbox send
      if (res.status === 403 || errText.includes('validation')) {
        const sandboxRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            from: 'PROmonitor Alerts <onboarding@resend.dev>',
            to: [toEmail],
            subject: `🚨 [${clientName}] PROmonitor Alert: ${level.toUpperCase()} (Sandbox)`,
            html: html
          })
        });
        return sandboxRes.ok;
      }
    }

    return res.ok;
  } catch (err) {
    console.error('Failed to send Resend email alert:', err);
    return false;
  }
}
