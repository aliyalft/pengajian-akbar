import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // =====================================================
    // DATA UMUM
    // =====================================================

    const {
      data: umumData,
      error: umumError,
    } = await supabaseAdmin
      .from('registrations')
      .select('id, checked_in');

    if (umumError) {
      console.error(
        'Scanner umum stats error:',
        umumError
      );

      return NextResponse.json(
        {
          error:
            'Tidak dapat memuat statistik tiket umum.',
        },
        { status: 500 }
      );
    }

    // =====================================================
    // DATA VIP
    // =====================================================

    const {
      data: vipData,
      error: vipError,
    } = await supabaseAdmin
      .from('registrations_vip')
      .select('id, checked_in');

    if (vipError) {
      console.error(
        'Scanner VIP stats error:',
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

    const umumRows = umumData ?? [];
    const vipRows = vipData ?? [];

    // =====================================================
    // STATISTIK UMUM
    // =====================================================

    const umumTotal = umumRows.length;

    const umumCheckedIn =
      umumRows.filter(
        (row) => row.checked_in === true
      ).length;

    // =====================================================
    // STATISTIK VIP
    // =====================================================

    const vipTotal = vipRows.length;

    const vipCheckedIn =
      vipRows.filter(
        (row) => row.checked_in === true
      ).length;

    // =====================================================
    // STATISTIK KESELURUHAN
    //
    // PENTING:
    // Jangan jumlahkan dua tabel di sini.
    //
    // Scanner utama mengikuti data registrations
    // sebagai jumlah tiket utama/event.
    // Breakdown UMUM dan VIP tetap ditampilkan
    // secara terpisah di bawahnya.
    // =====================================================

    const total = umumTotal;

    const checkedIn = umumCheckedIn;

    const progress =
      total > 0
        ? Math.round(
            (checkedIn / total) * 100
          )
        : 0;

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      checkedIn,
      total,
      progress,

      umum: {
        checkedIn: umumCheckedIn,
        total: umumTotal,
      },

      vip: {
        checkedIn: vipCheckedIn,
        total: vipTotal,
      },
    });
  } catch (error) {
    console.error(
      'GET /api/scanner-stats error:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Tidak dapat memuat statistik scanner.',
      },
      { status: 500 }
    );
  }
}