import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import Papa from 'papaparse';

export async function POST(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  try {
    const { collection } = await params;
    const url = new URL(req.url);
    const dryRun = url.searchParams.get('dryRun') === 'true';

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileContent = await file.text();
    
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Converts numbers and booleans automatically
    });

    if (parsed.errors.length > 0) {
      return NextResponse.json({ error: 'Error parsing CSV', details: parsed.errors }, { status: 400 });
    }

    const payload = await getPayload({ config });
    const collectionKey = collection as keyof typeof payload.collections;
    if (!payload.collections[collectionKey]) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    const existingRecords = await payload.find({
      collection: collection as any,
      limit: 10000,
      depth: 0,
    });

    const newRecords: any[] = [];
    const updatedRecords: any[] = [];
    const errors: any[] = [];

    // Identify duplicates using 'id' or 'sku' or 'name' (for categories without sku)
    const matchRecord = (row: any) => {
      return existingRecords.docs.find(doc => 
        (row.id && String(doc.id) === String(row.id)) || 
        (row.sku && doc.sku === String(row.sku)) ||
        (!row.id && !row.sku && row.name && doc.name === String(row.name))
      );
    };

    // Process rows
    for (const row of parsed.data as any[]) {
      try {
        // Resolve relationship fields by name, and ignore upload fields completely
        const fields = payload.collections[collectionKey].config.fields;
        for (const field of fields) {
          // Ignore upload fields (like 'image') to prevent ghost ID errors from external exports
          if (field.type === 'upload') {
            delete row[field.name];
            continue;
          }

          if (
            field.type === 'relationship' && 
            row[field.name] && 
            typeof row[field.name] === 'string'
          ) {
            const relationTo = Array.isArray(field.relationTo) ? field.relationTo[0] : field.relationTo;
            
            // Try to find the related record by name
            const relationDocs = await payload.find({
              collection: relationTo,
              where: {
                name: { equals: row[field.name] }
              },
              depth: 0,
              limit: 1
            });
            
            if (relationDocs.docs.length > 0) {
              row[field.name] = relationDocs.docs[0].id;
            } else {
              throw new Error(`No se encontró el registro relacionado para el campo '${field.name}' con el valor '${row[field.name]}' en la colección '${relationTo}'. Asegúrate de que el nombre esté escrito exactamente igual.`);
            }
          } else if (
            field.type === 'relationship' && 
            row[field.name] && 
            typeof row[field.name] === 'number'
          ) {
            // Verify if the ID actually exists to prevent Postgres foreign key constraint errors
            const relationTo = Array.isArray(field.relationTo) ? field.relationTo[0] : field.relationTo;
            try {
              const checkDoc = await payload.findByID({
                collection: relationTo,
                id: row[field.name]
              });
              if (!checkDoc) {
                throw new Error(`El ID ${row[field.name]} no existe en la colección ${relationTo}`);
              }
            } catch (err) {
               throw new Error(`Error de validación: El ID ${row[field.name]} no existe en la colección '${relationTo}' para el campo '${field.name}'. (Si no deseas asignar una relación, deja la celda vacía o elimina la columna).`);
            }
          }
        }

        // Clean up the row before DB operations
        delete row.id;
        delete row.createdAt;
        delete row.updatedAt;
        
        // Remove keys with null or empty string to prevent overriding with invalid empty values
        Object.keys(row).forEach(key => {
          if (row[key] === null || row[key] === '') {
            delete row[key];
          }
        });

        const existing = matchRecord(row);

        if (existing) {
          // Update
          if (!dryRun) {
            await payload.update({
              collection: collection as any,
              id: existing.id,
              data: row,
            });
          }
          updatedRecords.push({ id: existing.id, data: row });
        } else {
          // Create
          if (!dryRun) {
            await payload.create({
              collection: collection as any,
              data: row,
            });
          }
          newRecords.push({ data: row });
        }
      } catch (err: any) {
        errors.push({ row, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      dryRun,
      summary: {
        total: parsed.data.length,
        new: newRecords.length,
        updated: updatedRecords.length,
        errors: errors.length,
      },
      newRecords,
      updatedRecords,
      errors
    });

  } catch (error: any) {
    console.error('Import Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
