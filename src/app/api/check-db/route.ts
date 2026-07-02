import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function GET() {
  const payload = await getPayload({ config });
  const cats = await payload.find({ collection: 'categories', limit: 100 });
  const macros = await payload.find({ collection: 'macrocategories', limit: 100 });
  return NextResponse.json({
    categories: cats.docs.map((d: any) => ({id: d.id, name: d.name, macroCategory: d.macroCategory})),
    macros: macros.docs.map((d: any) => ({id: d.id, name: d.name}))
  });
}
