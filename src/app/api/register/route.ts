import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabaseClient';

import type { Gender } from '@/lib/types';

const REQUIRED_FIELDS = [
  'fullName',
  'phoneNumber',
  'gender',
  'city',

  // REVISI: field wajib
  'confirmation',
  'gate',
] as const;

const VALID_GENDERS: Gender[] = ['Ikhwan', 'Akhwat'];

// REVISI: daftar nilai valid untuk field baru
const VALID_CONFIRMATIONS = ['YA', 'TIDAK'] as const;

const VALID_GATES = ['Surapati', 'Diponegoro'] as const;

const normalizePhone = (phone: string) => {
  let value = phone.replace(/\D/g, '');

  if (value.startsWith('62')) {
    value = '0' + value.slice(2);
  } else if (value.startsWith('8')) {
    value = '0' + value;
  }

  return value;
};

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

    // REVISI: validasi Konfirmasi Kehadiran
    if (!VALID_CONFIRMATIONS.includes(body.confirmation)) {
      return NextResponse.json(
        { error: 'Konfirmasi kehadiran tidak valid.' },
        { status: 400 }
      );
    }

    // REVISI: validasi Pintu Masuk
    if (!VALID_GATES.includes(body.gate)) {
      return NextResponse.json(
        { error: 'Pintu masuk tidak valid.' },
        { status: 400 }
      );
    }

    // =========================
    // EMAIL OPSIONAL
    // =========================

    const email = String(body.email || '')
      .trim()
      .toLowerCase();

    if (email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        return NextResponse.json(
          { error: 'Format email tidak valid.' },
          { status: 400 }
        );
      }
    }

    // =========================
    // NOMOR TELEPON
    // =========================

    const phoneNumber = normalizePhone(
      String(body.phoneNumber || '')
    );

    if (phoneNumber.length < 9) {
      return NextResponse.json(
        { error: 'Nomor telepon tidak valid.' },
        { status: 400 }
      );
    }

    // =========================
    // CEK EMAIL DUPLIKAT
    // =========================

    if (email) {
      const {
        data: existingRegistration,
        error: existingError,
      } = await supabaseAdmin
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
    }

    // =========================
    // INSERT REGISTRASI
    // =========================

    const { data, error } = await supabaseAdmin
      .from('registrations')
      .insert({
        full_name: String(body.fullName).trim(),
        phone_number: phoneNumber,
        email: email || null,
        gender: body.gender,
        city: String(body.city).trim(),

        institution: body.institution
          ? String(body.institution).trim()
          : null,

        // REVISI: kirim field baru ke database
        confirmation: body.confirmation,
        gate: body.gate,
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