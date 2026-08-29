import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    // =====================================================
    // AMBIL ID DARI QR
    // =====================================================

    const body = await request.json();
    const { id } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        {
          error:
            'QR code tidak terbaca dengan benar.',
        },
        { status: 400 }
      );
    }

    const ticketId = id.trim();

    if (!ticketId) {
      return NextResponse.json(
        {
          error:
            'QR code tidak terbaca dengan benar.',
        },
        { status: 400 }
      );
    }

    // =====================================================
    // TENTUKAN JENIS TIKET
    // =====================================================
    //
    // VIP-XXXXXXXX → registrations_vip
    // UMUM-XXXXXXXX → registrations
    //
    // Kalau ID lama masih UUID, tetap diarahkan
    // ke registrations agar data lama tidak rusak.
    // =====================================================

    const isVip = ticketId.startsWith('VIP-');

    const tableName = isVip
      ? 'registrations_vip'
      : 'registrations';

    const ticketType = isVip
      ? 'VIP'
      : 'UMUM';

    // =====================================================
    // CARI DATA REGISTRASI
    // =====================================================

    const { data: registration, error: fetchError } =
      await supabaseAdmin
        .from(tableName)
        .select('*')
        .eq('id', ticketId)
        .maybeSingle();

    // =====================================================
    // ERROR DATABASE
    // =====================================================

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

    // =====================================================
    // DATA TIDAK DITEMUKAN
    // =====================================================

    if (!registration) {
      return NextResponse.json(
        {
          error:
            'Registrasi tidak ditemukan. QR code tidak valid.',
        },
        { status: 404 }
      );
    }

    // =====================================================
    // DATA REGISTRASI LENGKAP
    // =====================================================
    //
    // ticket_type dipastikan selalu dikirim ke frontend.
    // Ini penting supaya page scanner dan drawer
    // bisa mengetahui apakah tiket UMUM atau VIP.
    // =====================================================

    const registrationWithTicketType = {
      ...registration,
      ticket_type:
        registration.ticket_type ??
        ticketType,
    };

    // =====================================================
    // CEK APAKAH SUDAH CHECK-IN
    // =====================================================

    if (registration.checked_in === true) {
      console.log(
        `QR sudah pernah check-in: ${ticketId}`
      );

      return NextResponse.json({
        status: 'already_checked_in',

        registration:
          registrationWithTicketType,
      });
    }

    // =====================================================
    // CHECK-IN
    // =====================================================

    const { data: updatedRegistration, error: updateError } =
      await supabaseAdmin
        .from(tableName)
        .update({
          checked_in: true,
          checked_in_at:
            new Date().toISOString(),
        })
        .eq('id', ticketId)
        .eq('checked_in', false)
        .select('*')
        .maybeSingle();

    // =====================================================
    // ERROR UPDATE
    // =====================================================

    if (updateError) {
      console.error(
        'Update check-in error:',
        updateError
      );

      return NextResponse.json(
        {
          error:
            'Check-in gagal disimpan. Silakan coba lagi.',
        },
        { status: 500 }
      );
    }

    // =====================================================
    // KONDISI RACE / SUDAH CHECK-IN
    // =====================================================
    //
    // Misalnya QR terbaca dua kali hampir bersamaan.
    // Request pertama berhasil update.
    // Request kedua bisa tidak mendapatkan row
    // karena checked_in sudah berubah menjadi true.
    //
    // Dalam kondisi ini kita ambil ulang datanya
    // dan tetap mengembalikan already_checked_in.
    // =====================================================

    if (!updatedRegistration) {
      const { data: latestRegistration, error: latestError } =
        await supabaseAdmin
          .from(tableName)
          .select('*')
          .eq('id', ticketId)
          .maybeSingle();

      if (latestError) {
        console.error(
          'Fetch latest registration error:',
          latestError
        );

        return NextResponse.json(
          {
            error:
              'Status check-in tidak dapat diperiksa.',
          },
          { status: 500 }
        );
      }

      if (
        latestRegistration &&
        latestRegistration.checked_in === true
      ) {
        return NextResponse.json({
          status: 'already_checked_in',

          registration: {
            ...latestRegistration,

            ticket_type:
              latestRegistration.ticket_type ??
              ticketType,
          },
        });
      }

      return NextResponse.json(
        {
          error:
            'Check-in gagal diproses. Silakan coba lagi.',
        },
        { status: 500 }
      );
    }

    // =====================================================
    // CHECK-IN BERHASIL
    // =====================================================

    console.log(
      `Check-in berhasil: ${ticketId}`
    );

    return NextResponse.json({
      status: 'success',

      registration: {
        ...updatedRegistration,

        ticket_type:
          updatedRegistration.ticket_type ??
          ticketType,
      },
    });
  } catch (err: unknown) {
    // =====================================================
    // GENERAL ERROR
    // =====================================================

    console.error(
      'POST /api/checkin error:',
      err
    );

    const message =
      err instanceof Error
        ? err.message
        : 'Terjadi kesalahan pada server.';

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}