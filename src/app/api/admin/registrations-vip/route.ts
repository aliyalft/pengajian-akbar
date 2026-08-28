import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('registrations_vip')
      .select(
        `
          id,
          full_name,
          phone_number,
          email,
          gender,
          jamaah_type,
          jamaah_name,
          city,
          confirmation,
          gate,
          checked_in,
          checked_in_at,
          created_at
        `
      )
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error(
        'Admin VIP registrations error:',
        error
      );

      return NextResponse.json(
        {
          error: 'Gagal memuat data jamaah VIP.',
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      registrations: data ?? [],
    });
  } catch (error) {
    console.error(
      'Admin VIP registrations route error:',
      error
    );

    return NextResponse.json(
      {
        error: 'Terjadi kesalahan pada server.',
      },
      {
        status: 500,
      }
    );
  }
}


/* =========================================
   DELETE VIP REGISTRATION
========================================= */

export async function DELETE(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const id =
      typeof body.id === 'string'
        ? body.id.trim()
        : '';

    if (!id) {
      return NextResponse.json(
        {
          error: 'ID peserta tidak ditemukan.',
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } =
      await supabaseAdmin
        .from('registrations_vip')
        .delete()
        .eq('id', id)
        .select('id, full_name')
        .single();

    if (error) {
      console.error(
        'Delete VIP registration error:',
        error
      );

      return NextResponse.json(
        {
          error: 'Gagal menghapus data peserta VIP.',
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      registration: data,
    });

  } catch (error) {
    console.error(
      'Delete VIP registration route error:',
      error
    );

    return NextResponse.json(
      {
        error: 'Terjadi kesalahan pada server.',
      },
      {
        status: 500,
      }
    );
  }
}