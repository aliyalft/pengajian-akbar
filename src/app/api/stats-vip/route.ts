import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // =========================================
    // TOTAL & CHECK-IN
    // =========================================

    const { data: registrations, error } =
      await supabaseAdmin
        .from('registrations_vip')
        .select(
          `
            id,
            gender,
            checked_in
          `
        );

    if (error) {
      console.error(
        'VIP stats error:',
        error
      );

      return NextResponse.json(
        {
          error: 'Gagal memuat statistik VIP.',
        },
        {
          status: 500,
        }
      );
    }

    const data = registrations ?? [];

    const total = data.length;

    const checkedIn = data.filter(
      (registration) =>
        registration.checked_in === true
    ).length;

    const ikhwan = data.filter(
      (registration) =>
        registration.gender === 'Ikhwan'
    ).length;

    const akhwat = data.filter(
      (registration) =>
        registration.gender === 'Akhwat'
    ).length;

    const remaining = Math.max(
      total - checkedIn,
      0
    );

    const checkInRate =
      total > 0
        ? Math.round(
            (checkedIn / total) * 100
          )
        : 0;

    return NextResponse.json({
      total,
      checkedIn,
      remaining,
      ikhwan,
      akhwat,
      checkInRate,
    });
  } catch (error) {
    console.error(
      'VIP stats route error:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Terjadi kesalahan pada server.',
      },
      {
        status: 500,
      }
    );
  }
}