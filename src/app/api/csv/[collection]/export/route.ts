import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import Papa from 'papaparse';

export async function GET(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  try {
    const { collection } = await params;
    const payload = await getPayload({ config });
    
    // Validar colección
    const collectionKey = collection as keyof typeof payload.collections;
    const collectionConfig = payload.collections[collectionKey]?.config;
    if (!collectionConfig) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    // Traer todos los documentos de la colección con relaciones resueltas
    const result = await payload.find({
      collection: collection as any,
      limit: 10000,
      depth: 1, // Depth 1 para resolver los objetos relacionados y obtener sus nombres
    });

    // Identificar qué campos son de tipo 'upload' o 'relationship'
    const uploadFields = collectionConfig.fields
      .filter((f: any) => f.type === 'upload')
      .map((f: any) => f.name);

    const relationshipFields = collectionConfig.fields
      .filter((f: any) => f.type === 'relationship')
      .map((f: any) => f.name);

    // Filtrar uploads y transformar relaciones de objetos a nombres legibles
    const cleanedDocs = result.docs.map((doc: any) => {
      const newDoc = { ...doc };
      
      // Eliminar campos de subida de archivos (imágenes)
      for (const field of uploadFields) {
        delete newDoc[field];
      }
      
      // Aplanar los campos de relaciones para mostrar el nombre en lugar del objeto o ID
      for (const field of relationshipFields) {
        if (newDoc[field] && typeof newDoc[field] === 'object') {
          if (Array.isArray(newDoc[field])) {
            newDoc[field] = newDoc[field].map((r: any) => r.name || r.id).join(', ');
          } else {
            newDoc[field] = newDoc[field].name || newDoc[field].id;
          }
        }
      }
      
      return newDoc;
    });

    const csvData = Papa.unparse(cleanedDocs);

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
