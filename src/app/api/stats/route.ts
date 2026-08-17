import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('registrations')
      .select('checked_in');

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const rows = data ?? [];

    const total = rows.length;

    const checkedIn = rows.filter(
      (row) => row.checked_in === true
    ).length;

    return NextResponse.json({
      checkedIn,
      total,
    });
  } catch (error) {
    console.error('GET /api/stats error:', error);

    return NextResponse.json(
      {
        error: 'Tidak dapat memuat statistik check-in.',
      },
      {
        status: 500,
      }
    );
  }
}