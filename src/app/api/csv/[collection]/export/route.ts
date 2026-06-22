import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import Papa from 'papaparse';

export async function GET(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  try {
    const { collection } = await params;
    const payload = await getPayload({ config });
    
    // Validar colección
    if (!payload.collections[collection]) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    // Traer todos los documentos de la colección (con un límite alto para exportación)
    const result = await payload.find({
      collection: collection as any,
      limit: 10000,
      depth: 0, // Evitar anidaciones profundas para facilitar la conversión a CSV
    });

    const csvData = Papa.unparse(result.docs);

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${collection}-export.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return NextResponse.json({ error: 'Failed to export CSV' }, { status: 500 });
  }
}
