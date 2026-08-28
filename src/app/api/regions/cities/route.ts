import { NextResponse } from 'next/server';

import { getAllCities } from '@/lib/indonesia-regions';

export async function GET() {
  try {
    const cities = await getAllCities();

    return NextResponse.json({
      cities,
    });
  } catch (error) {
    console.error(
      'Failed to load cities:',
      error
    );

    return NextResponse.json(
      {
        error: 'Gagal memuat data kota.',
      },
      {
        status: 500,
      }
    );
  }
}