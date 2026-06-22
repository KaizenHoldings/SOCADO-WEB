import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function GET() {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'taxes',
      where: {
        isActive: {
          equals: true,
        },
      },
      limit: 100,
    });

    return NextResponse.json(result.docs);
  } catch (error) {
    console.error('Error fetching taxes:', error);
    return NextResponse.json({ error: 'Failed to fetch taxes' }, { status: 500 });
  }
}
