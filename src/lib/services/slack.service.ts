export class SlackService {
  static async sendQuoteNotification(quote: any) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn('[SlackService] SLACK_WEBHOOK_URL no está definido. Omitiendo notificación de Slack.');
      return;
    }

    try {
      const itemsList = quote.items && Array.isArray(quote.items) 
        ? quote.items.map((i: any) => `- ${i.quantity}x ${i.name || i.title} ${i.codigo ? `(SKU: ${i.codigo})` : ''} ($${(i.price * i.quantity) || i.total || 0})`).join('\n')
        : 'Sin items detallados';

      const eventDateStr = quote.eventDate ? new Date(quote.eventDate).toLocaleDateString() : 'No especificada';

      const payload = {
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'Nueva Solicitud de Cotización',
              emoji: true
            }
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Cliente:*\n${quote.fullName || 'N/A'}\n*CI:* ${quote.documentId || 'N/A'}`
              },
              {
                type: 'mrkdwn',
                text: `*Email:*\n${quote.email || 'N/A'}`
              },
              {
                type: 'mrkdwn',
                text: `*Teléfono:*\n${quote.phone || 'N/A'}`
              },
              {
                type: 'mrkdwn',
                text: `*Fecha del Evento:*\n${eventDateStr}`
              },
              {
                type: 'mrkdwn',
                text: `*Invitados:*\n${quote.guests || 'N/A'}`
              }
            ]
          },
          ...(quote.eventLocation ? [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Dirección del Evento:*\n${quote.eventLocation.address || 'No especificada'}\n<https://www.google.com/maps?q=${quote.eventLocation.lat},${quote.eventLocation.lng}|📍 Ver en Google Maps>`
              }
            }
          ] : []),
          ...(quote.totalDiscount && quote.totalDiscount > 0 ? [
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*Subtotal (Sin desc.):*\n$${quote.totalOriginal || 0}`
                },
                {
                  type: 'mrkdwn',
                  text: `*Descuento por Volumen:*\n-$${quote.totalDiscount || 0}`
                }
              ]
            }
          ] : []),
          ...(quote.totalTax && quote.totalTax > 0 ? [
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*Impuestos Aplicados:*\n+$${quote.totalTax || 0}`
                }
              ]
            }
          ] : []),
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Total Estimado (Final):*\n$${quote.total || 0}`
              }
            ]
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Items Solicitados:*\n${itemsList}`
            }
          }
        ]
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error en respuesta de Slack: ${response.statusText}`);
      }

      console.log('[SlackService] Notificación enviada exitosamente a Slack.');
    } catch (error) {
      console.error('[SlackService] Error al enviar notificación:', error);
    }
  }
}
