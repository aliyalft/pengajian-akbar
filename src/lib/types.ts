export type Gender = 'Ikhwan' | 'Akhwat';

export interface Registration {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  gender: Gender;
  city: string;
  institution: string | null;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
}

export interface RegistrationFormValues {
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: Gender | '';
  city: string;
  institution: string;
}


/* ======================================================
   VIP — mengikuti pola yang sama seperti tipe umum di atas
   ====================================================== */

export type JamaahType =
  | 'majelis_taklim'
  | 'organisasi'
  | 'komunitas'
  | 'perorangan';

export type Confirmation = 'YA' | 'TIDAK';

export type Gate = 'Surapati' | 'Diponegoro';

export interface RegistrationVip {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  gender: Gender;
  jamaah_type: JamaahType;
  jamaah_name: string | null;
  city: string;
  confirmation: Confirmation;
  gate: Gate;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
}

export interface RegistrationVipFormValues {
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: Gender | '';
  jamaahType: JamaahType | '';
  jamaahName: string;
  city: string;
  confirmation: Confirmation | '';
  gate: Gate | '';
}