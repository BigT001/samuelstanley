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
