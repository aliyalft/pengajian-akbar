import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const method = String(body.method || '')
      .trim()
      .toLowerCase();

      if (method !== 'email' && method !== 'phone') {
    return NextResponse.json(
    { error: 'Metode pencarian tidak valid.' },
    { status: 400 }
  );
}

    const value = String(body.value || '').trim();

    if (!method || !value) {
      return NextResponse.json(
        {
          error: 'Email atau nomor telepon wajib diisi.',
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // NORMALISASI PENCARIAN
    // =========================

    const searchValue =
  method === 'email'
    ? value.toLowerCase()
    : (() => {
        let phone = value.replace(/\D/g, '');

        if (phone.startsWith('62')) {
          phone = '0' + phone.slice(2);
        } else if (phone.startsWith('8')) {
          phone = '0' + phone;
        }

        return phone;
      })();

if (!searchValue) {
  return NextResponse.json(
    {
      error:
        method === 'phone'
          ? 'Nomor telepon tidak valid.'
          : 'Email tidak valid.',
    },
    {
      status: 400,
    }
  );
}

    // =========================
    // CEK TIKET UMUM
    // =========================

    let generalQuery = supabaseAdmin
      .from('registrations')
      .select('id, email, phone_number');

    if (method === 'email') {
      generalQuery = generalQuery.ilike(
        'email',
        searchValue
      );
    } else {
      generalQuery = generalQuery.eq(
        'phone_number',
        searchValue
      );
    }

    const {
      data: generalTicket,
      error: generalError,
    } = await generalQuery.maybeSingle();

    if (generalError) {
      console.error(
        'Find general ticket error:',
        generalError
      );

      return NextResponse.json(
        {
          error:
            'Tiket tidak dapat ditemukan. Silakan coba lagi.',
        },
        {
          status: 500,
        }
      );
    }

    if (generalTicket) {
      return NextResponse.json({
        id: generalTicket.id,
        type: 'umum',
      });
    }

    // =========================
    // CEK TIKET VIP
    // =========================

    let vipQuery = supabaseAdmin
      .from('registrations_vip')
      .select('id, email, phone_number');

    if (method === 'email') {
      vipQuery = vipQuery.ilike(
        'email',
        searchValue
      );
    } else {
      vipQuery = vipQuery.eq(
        'phone_number',
        searchValue
      );
    }

    const {
      data: vipTicket,
      error: vipError,
    } = await vipQuery.maybeSingle();

    if (vipError) {
      console.error(
        'Find VIP ticket error:',
        vipError
      );

      return NextResponse.json(
        {
          error:
            'Tiket tidak dapat ditemukan. Silakan coba lagi.',
        },
        {
          status: 500,
        }
      );
    }

    if (vipTicket) {
      return NextResponse.json({
        id: vipTicket.id,
        type: 'vip',
      });
    }

    // =========================
    // TIDAK DITEMUKAN
    // =========================

    return NextResponse.json(
      {
        error:
          method === 'phone'
            ? 'Tidak ditemukan registrasi dengan nomor telepon tersebut.'
            : 'Tidak ditemukan registrasi dengan email tersebut.',
      },
      {
        status: 404,
      }
    );
  } catch (error) {
    console.error(
      'Find ticket route error:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Tiket tidak dapat ditemukan. Silakan coba lagi.',
      },
      {
        status: 500,
      }
    );
  }
}