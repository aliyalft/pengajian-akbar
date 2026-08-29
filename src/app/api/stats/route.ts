import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    /*
     * =====================================================
     * TYPE STATISTICS
     *
     * ?type=umum  → registrations
     * ?type=vip   → registrations_vip
     *
     * Default = umum
     *
     * PENTING:
     * Route ini TIDAK menjumlahkan UMUM + VIP.
     * Supaya Dashboard Admin UMUM tetap membaca
     * data registrations saja.
     * =====================================================
     */

    const type = searchParams.get('type') || 'umum';

    // =====================================================
    // VALIDASI TYPE
    // =====================================================

    if (type !== 'umum' && type !== 'vip') {
      return NextResponse.json(
        {
          error: 'Tipe statistik tidak valid.',
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // TENTUKAN TABLE
    // =====================================================

    const tableName =
      type === 'vip'
        ? 'registrations_vip'
        : 'registrations';

    // =====================================================
    // AMBIL DATA
    // =====================================================

    const { data, error } = await supabaseAdmin
      .from(tableName)
      .select('checked_in');

    if (error) {
      console.error(
        `Get ${type} stats error:`,
        error
      );

      return NextResponse.json(
        {
          error:
            type === 'vip'
              ? 'Tidak dapat memuat statistik tiket VIP.'
              : 'Tidak dapat memuat statistik tiket umum.',
        },
        {
          status: 500,
        }
      );
    }

    // =====================================================
    // HITUNG
    // =====================================================

    const rows = data ?? [];

    const total = rows.length;

    const checkedIn = rows.filter(
      (row) => row.checked_in === true
    ).length;

    // =====================================================
    // RESPONSE
    //
    // HANYA DATA DARI TABLE YANG DIPILIH
    // =====================================================

    return NextResponse.json({
      type,
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