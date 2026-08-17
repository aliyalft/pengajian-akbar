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

    const { data: reg, error: fetchError } = await supabaseAdmin
      .from('registrations')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !reg) {
      return NextResponse.json(
        {
          error: 'Registrasi tidak ditemukan. QR code tidak valid.',
        },
        { status: 404 }
      );
    }

    if (reg.checked_in) {
      return NextResponse.json({
        status: 'already_checked_in',
        registration: reg,
      });
    }

    const { data: updated, error: updateError } =
      await supabaseAdmin
        .from('registrations')
        .update({
          checked_in: true,
          checked_in_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      status: 'success',
      registration: updated,
    });
  } catch (err: unknown) {
    console.error('POST /api/checkin error:', err);

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