import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabaseClient';

import type { Gender } from '@/lib/types';

const REQUIRED_FIELDS = [
  'fullName',
  'phoneNumber',
  'gender',
  'jamaahType',
  'city',
  'confirmation',
  'gate',
] as const;

const VALID_GENDERS: Gender[] = ['Ikhwan', 'Akhwat'];

const VALID_JAMAAH_TYPES = [
  'majelis_taklim',
  'organisasi',
  'komunitas',
  'perorangan',
] as const;

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

    if (!VALID_JAMAAH_TYPES.includes(body.jamaahType)) {
      return NextResponse.json(
        { error: 'Kategori jamaah tidak valid.' },
        { status: 400 }
      );
    }

    // Wajib isi nama Majelis Taklim/Organisasi/Komunitas,
    // kecuali kategori Perorangan
    if (
      body.jamaahType !== 'perorangan' &&
      (!body.jamaahName ||
        String(body.jamaahName).trim() === '')
    ) {
      return NextResponse.json(
        {
          error:
            'Nama Majelis Taklim/Organisasi/Komunitas wajib diisi.',
        },
        { status: 400 }
      );
    }

    if (!VALID_CONFIRMATIONS.includes(body.confirmation)) {
      return NextResponse.json(
        { error: 'Konfirmasi kehadiran tidak valid.' },
        { status: 400 }
      );
    }

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
        .from('registrations_vip')
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
    // INSERT REGISTRASI VIP
    // =========================

    const { data, error } = await supabaseAdmin
      .from('registrations_vip')
      .insert({
        full_name: String(body.fullName).trim(),
        phone_number: phoneNumber,
        email: email || null,
        gender: body.gender,
        jamaah_type: body.jamaahType,
        jamaah_name:
          body.jamaahType === 'perorangan'
            ? null
            : String(body.jamaahName).trim(),
        city: String(body.city).trim(),
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
    console.error('POST /api/register/vip error:', err);

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