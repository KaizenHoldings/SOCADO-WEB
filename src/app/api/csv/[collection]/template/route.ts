import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import Papa from 'papaparse';

export async function GET(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  try {
    const { collection } = await params;
    const payload = await getPayload({ config });
    const collectionKey = collection as keyof typeof payload.collections;
    const collectionConfig = payload.collections[collectionKey]?.config;
    
    if (!collectionConfig) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    // Extraer nombres de los campos excluyendo UI y Uploads
    const headers = collectionConfig.fields
      .filter((f: any) => f.type !== 'ui' && f.type !== 'upload' && f.name)
      .map((f: any) => f.name);

    const csvData = Papa.unparse({
      fields: headers,
      data: []
    });

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${collection}-template.csv"`,
      },
    });
  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json({ error: 'Failed to generate template' }, { status: 500 });
  }
}
