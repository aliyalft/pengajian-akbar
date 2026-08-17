'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function StaffLogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    router.replace('/staff/login');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="staff-logout-button"
    >
      Keluar
    </button>
  );
}