import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // =========================
    // DATA TIKET UMUM
    // =========================

    const {
      data: generalData,
      error: generalError,
    } = await supabaseAdmin
      .from('registrations')
      .select('checked_in');

    if (generalError) {
      console.error(
        'Get general stats error:',
        generalError
      );

      return NextResponse.json(
        {
          error:
            'Tidak dapat memuat statistik tiket umum.',
        },
        { status: 500 }
      );
    }

    // =========================
    // DATA TIKET VIP
    // =========================

    const {
      data: vipData,
      error: vipError,
    } = await supabaseAdmin
      .from('registrations_vip')
      .select('checked_in');

    if (vipError) {
      console.error(
        'Get VIP stats error:',
        vipError
      );

      return NextResponse.json(
        {
          error:
            'Tidak dapat memuat statistik tiket VIP.',
        },
        { status: 500 }
      );
    }

    const generalRows =
      generalData ?? [];

    const vipRows =
      vipData ?? [];

    // =========================
    // GABUNGKAN STATISTIK
    // =========================

    const total =
      generalRows.length +
      vipRows.length;

    const checkedIn =
      generalRows.filter(
        (row) => row.checked_in === true
      ).length +
      vipRows.filter(
        (row) => row.checked_in === true
      ).length;

    return NextResponse.json({
      checkedIn,
      total,
    });
  } catch (error) {
    console.error(
      'GET /api/stats error:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Tidak dapat memuat statistik check-in.',
      },
      {
        status: 500,
      }
    );
  }
}