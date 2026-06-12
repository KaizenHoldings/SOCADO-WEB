/**
 * Servicio de envío de correos electrónicos.
 * NOTA: En la Etapa 1, los correos NO se enviarán realmente según las instrucciones del usuario.
 * Solo dejamos la estructura preparada.
 */
export class EmailService {
  static async sendQuoteConfirmation(quoteData: any) {
    console.log("[EmailService] Simulando envío de confirmación de cotización al cliente:", quoteData.email);
    console.log("[EmailService] Datos de la cotización:", JSON.stringify(quoteData, null, 2));
    
    // Aquí iría la integración con Resend, Sendgrid, etc.
    return { success: true, message: "Email simulado enviado correctamente" };
  }

  static async sendQuoteNotificationToAdmin(quoteData: any) {
    console.log("[EmailService] Simulando notificación de nueva cotización a ventas@socadocafe.com");
    console.log("[EmailService] Datos de la cotización:", JSON.stringify(quoteData, null, 2));
    
    // Aquí iría la integración para notificar al administrador.
    return { success: true, message: "Notificación simulada enviada correctamente al admin" };
  }
}
