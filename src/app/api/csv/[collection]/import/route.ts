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
