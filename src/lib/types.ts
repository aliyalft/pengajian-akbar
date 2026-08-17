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