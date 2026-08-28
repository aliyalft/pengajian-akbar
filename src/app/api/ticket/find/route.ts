import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email || '')
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          error: 'Email wajib diisi.',
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // CEK TIKET UMUM
    // =========================
    const { data: generalTicket, error: generalError } =
      await supabaseAdmin
        .from('registrations')
        .select('id, email')
        .ilike('email', email)
        .maybeSingle();

    if (generalError) {
      console.error('Find general ticket error:', generalError);

      return NextResponse.json(
        {
          error: 'Tiket tidak dapat ditemukan. Silakan coba lagi.',
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
    const { data: vipTicket, error: vipError } =
      await supabaseAdmin
        .from('registrations_vip')
        .select('id, email')
        .ilike('email', email)
        .maybeSingle();

    if (vipError) {
      console.error('Find VIP ticket error:', vipError);

      return NextResponse.json(
        {
          error: 'Tiket tidak dapat ditemukan. Silakan coba lagi.',
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
        error: 'Tidak ditemukan registrasi dengan email tersebut.',
      },
      {
        status: 404,
      }
    );
  } catch (error) {
    console.error('Find ticket route error:', error);

    return NextResponse.json(
      {
        error: 'Tiket tidak dapat ditemukan. Silakan coba lagi.',
      },
      {
        status: 500,
      }
    );
  }
}