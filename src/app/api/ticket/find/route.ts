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

    const { data, error } = await supabaseAdmin
      .from('registrations')
      .select('id, email')
      .ilike('email', email)
      .maybeSingle();

    if (error) {
      console.error('Find ticket error:', error);

      return NextResponse.json(
        {
          error: 'Tiket tidak dapat ditemukan. Silakan coba lagi.',
        },
        {
          status: 500,
        }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error: 'Tidak ditemukan registrasi dengan email tersebut.',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      id: data.id,
    });
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