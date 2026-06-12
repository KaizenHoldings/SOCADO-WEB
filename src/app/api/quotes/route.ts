import { NextResponse } from 'next/server';
import { QuoteService } from '@/lib/services/quote.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validaciones básicas de los datos de entrada
    if (!body.fullName || !body.email || !body.phone || !body.eventDate || !body.items) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // Delegamos la lógica al servicio
    const result = await QuoteService.createQuote(body);

    return NextResponse.json({ success: true, quote: result.quote }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/quotes:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar la cotización' },
      { status: 500 }
    );
  }
}
