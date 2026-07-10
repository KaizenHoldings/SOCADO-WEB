import { getPayload } from "payload";
import config from "@payload-config";
import { EmailService } from "./email.service";
import { SlackService } from "./slack.service";

/**
 * Servicio para gestionar la lógica de negocio de las cotizaciones.
 */
export class QuoteService {
  /**
   * Crea una nueva cotización en la base de datos y simula el envío de correos.
   */
  static async createQuote(quoteData: any) {
    try {
      // 1. Obtener la instancia de Payload
      const payload = await getPayload({ config });

      // 2. Insertar en base de datos
      const newQuote = await payload.create({
        collection: "quotes",
        data: {
          fullName: quoteData.fullName,
          email: quoteData.email,
          phone: quoteData.phone,
          eventDate: new Date(quoteData.eventDate).toISOString(),
          guests: Number(quoteData.guests),
          description: quoteData.description,
          items: quoteData.items, // JSON array of items
          eventLocation: quoteData.eventLocation, // Guardar dirección y coordenadas
          totalOriginal: quoteData.totalOriginal,
          totalDiscount: quoteData.totalDiscount,
          totalTax: quoteData.totalTax,
          total: quoteData.total,
          status: "pending",
        },
      });

      // 3. Orquestar el envío de correos (solo simulación en Etapa 1)
      await EmailService.sendQuoteConfirmation(newQuote);
      await EmailService.sendQuoteNotificationToAdmin(newQuote);

      // 4. Enviar notificación a Slack (inyectamos eventLocation en caso de que Payload no haya actualizado el esquema en memoria aún)
      await SlackService.sendQuoteNotification({ 
        ...newQuote, 
        eventLocation: newQuote.eventLocation || quoteData.eventLocation 
      });

      return { success: true, quote: newQuote };
    } catch (error) {
      console.error("[QuoteService] Error al crear la cotización:", error);
      throw new Error("No se pudo crear la cotización.");
    }
  }
}
