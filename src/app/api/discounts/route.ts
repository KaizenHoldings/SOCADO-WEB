import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function GET() {
  try {
    const payload = await getPayload({ config });

    const rules = await payload.find({
      collection: 'discount-rules',
      where: {
        isActive: {
          equals: true,
        },
      },
      depth: 1, // To get the related subcategories ID/name
      limit: 100,
    });

    return NextResponse.json({ success: true, rules: rules.docs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching discount rules:', error);
    return NextResponse.json(
      { error: 'Error al obtener reglas de descuento' },
      { status: 500 }
    );
  }
}
