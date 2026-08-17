import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import type { Gender } from '@/lib/types';

const REQUIRED_FIELDS = [
  'fullName',
  'phoneNumber',
  'email',
  'gender',
  'city',
] as const;

const VALID_GENDERS: Gender[] = ['Ikhwan', 'Akhwat'];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    for (const field of REQUIRED_FIELDS) {
      if (!body[field] || String(body[field]).trim() === '') {
        return NextResponse.json(
          { error: `Field "${field}" wajib diisi.` },
          { status: 400 }
        );
      }
    }

    if (!VALID_GENDERS.includes(body.gender)) {
      return NextResponse.json(
        { error: 'Jenis kelamin tidak valid.' },
        { status: 400 }
      );
    }

    const email = String(body.email).trim().toLowerCase();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid.' },
        { status: 400 }
      );
    }

    const phoneNumber = String(body.phoneNumber)
      .replace(/\D/g, '')
      .trim();

    if (phoneNumber.length < 9) {
      return NextResponse.json(
        { error: 'Nomor telepon tidak valid.' },
        { status: 400 }
      );
    }

    const { data: existingRegistration, error: existingError } =
      await supabaseAdmin
        .from('registrations')
        .select('id')
        .ilike('email', email)
        .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existingRegistration) {
      return NextResponse.json(
        {
          error: 'Email ini sudah terdaftar.',
          id: existingRegistration.id,
        },
        { status: 409 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('registrations')
      .insert({
        full_name: String(body.fullName).trim(),
        phone_number: phoneNumber,
        email,
        gender: body.gender,
        city: String(body.city).trim(),
        institution: body.institution
          ? String(body.institution).trim()
          : null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      id: data.id,
    });
  } catch (err: unknown) {
    console.error('POST /api/register error:', err);

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