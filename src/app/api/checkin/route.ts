import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'QR code tidak terbaca dengan benar.' },
        { status: 400 }
      );
    }

    const ticketId = id.trim();

    /*
     * Tentukan jenis tiket dari prefix ID.
     *
     * UMUM-XXXXXXXX → registrations
     * VIP-XXXXXXXX   → registrations_vip
     *
     * Untuk ID lama yang masih UUID, kita tetap
     * coba cari ke registrations agar data lama
     * tidak langsung rusak.
     */

    const isVip = ticketId.startsWith('VIP-');

    const tableName = isVip
      ? 'registrations_vip'
      : 'registrations';

    const ticketType = isVip ? 'VIP' : 'UMUM';

    // =========================
    // CARI REGISTRASI
    // =========================

    const { data: reg, error: fetchError } =
      await supabaseAdmin
        .from(tableName)
        .select('*')
        .eq('id', ticketId)
        .maybeSingle();

    if (fetchError) {
      console.error(
        'Fetch registration error:',
        fetchError
      );

      return NextResponse.json(
        {
          error:
            'Registrasi tidak dapat diperiksa. Silakan coba lagi.',
        },
        { status: 500 }
      );
    }

    if (!reg) {
      return NextResponse.json(
        {
          error:
            'Registrasi tidak ditemukan. QR code tidak valid.',
        },
        { status: 404 }
      );
    }

    // =========================
    // SUDAH CHECK-IN
    // =========================

    if (reg.checked_in) {
      return NextResponse.json({
        status: 'already_checked_in',
        registration: {
          ...reg,
          ticket_type: ticketType,
        },
      });
    }

    // =========================
    // CHECK-IN
    // =========================

    const { data: updated, error: updateError } =
      await supabaseAdmin
        .from(tableName)
        .update({
          checked_in: true,
          checked_in_at:
            new Date().toISOString(),
        })
        .eq('id', ticketId)
        .select()
        .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      status: 'success',
      registration: {
        ...updated,
        ticket_type: ticketType,
      },
    });
  } catch (err: unknown) {
    console.error(
      'POST /api/checkin error:',
      err
    );

    const message =
      err instanceof Error
        ? err.message
        : 'Terjadi kesalahan pada server.';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}