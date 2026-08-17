'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function StaffLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email: email
            .trim()
            .toLowerCase(),
          password,
        });

      if (error) {
        throw error;
      }

      router.replace('/staff/scanner');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Login gagal. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="staff-login-page">

      <div
        className="staff-login-pattern"
        aria-hidden="true"
      />

      <div
        className="staff-login-orb staff-login-orb-left"
        aria-hidden="true"
      />

      <div
        className="staff-login-orb staff-login-orb-right"
        aria-hidden="true"
      />


      {/* DECORATIVE ISLAMIC ELEMENTS */}
      <div
        className="staff-login-decoration"
        aria-hidden="true"
      >

        <div className="staff-login-orbit staff-login-orbit-left" />

        <div className="staff-login-orbit staff-login-orbit-right" />


        <svg
          className="staff-login-lantern staff-login-lantern-left"
          viewBox="0 0 64 112"
        >
          <path
            d="M32 0v12M23 12h18M20 18h24M24 18l-8 16v42l16 21 16-21V34l-8-16M16 39h32M16 72h32M24 39v33M40 39v33M23 82h18M28 97v10h8V97"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>


        <svg
          className="staff-login-lantern staff-login-lantern-right"
          viewBox="0 0 64 112"
        >
          <path
            d="M32 0v12M23 12h18M20 18h24M24 18l-8 16v42l16 21 16-21V34l-8-16M16 39h32M16 72h32M24 39v33M40 39v33M23 82h18M28 97v10h8V97"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>


        <svg
          className="staff-login-crescent"
          viewBox="0 0 100 100"
        >
          <path
            d="M65 15c-23 5-39 26-35 49 4 24 27 40 51 34-18-5-31-22-31-42 0-17 8-32 22-41-2 0-5 0-7 0Z"
            fill="currentColor"
          />
        </svg>


        <div className="staff-login-mosque staff-login-mosque-left">
          <span className="staff-login-mosque-dome" />
          <span className="staff-login-mosque-body" />
          <span className="staff-login-mosque-minaret" />
        </div>


        <div className="staff-login-mosque staff-login-mosque-right">
          <span className="staff-login-mosque-dome" />
          <span className="staff-login-mosque-body" />
          <span className="staff-login-mosque-minaret" />
        </div>

      </div>


      <div className="staff-login-shell">

        <div className="staff-login-content">

          {/* TOP INTRO */}
          <div className="staff-login-top-intro">

            <h2 className="staff-login-top-kicker">
              Pengajian Akbar MT MHABD
            </h2>

            <p>
              Akses khusus panitia dan petugas
              check-in acara.
            </p>

          </div>


          <section className="staff-login-card">

            <div className="staff-login-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="10"
                  rx="2.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M8 10V7.5C8 5.3 9.8 3.5 12 3.5C14.2 3.5 16 5.3 16 7.5V10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>


            <div className="staff-login-heading">

              <h1>
                Login Staff
              </h1>

              <p>
                Masuk untuk mengakses scanner
                check-in jamaah Pengajian Akbar.
              </p>
            </div>


            <form
              onSubmit={handleSubmit}
              className="staff-login-form"
            >

              <div className="staff-login-group">

                <label htmlFor="email">
                  Email Staff
                </label>

                <div className="staff-login-input-wrap">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />

                    <path
                      d="M4 7L10.7 12.1C11.47 12.69 12.53 12.69 13.3 12.1L20 7"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <input
                    id="email"
                    type="email"
                    placeholder="staff@email.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    required
                  />
                </div>

              </div>


              <div className="staff-login-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="staff-login-input-wrap">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2.5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />

                    <path
                      d="M8 10V7.5C8 5.3 9.8 3.5 12 3.5C14.2 3.5 16 5.3 16 7.5V10"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />

                    <circle
                      cx="12"
                      cy="15"
                      r="1.2"
                      fill="currentColor"
                    />
                  </svg>

                  <input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    required
                  />
                </div>

              </div>


              {error && (
                <div className="staff-login-error">
                  {error}
                </div>
              )}


              <button
                type="submit"
                disabled={loading}
                className="staff-login-submit"
              >
                {loading
                  ? 'Memproses...'
                  : 'Masuk sebagai Staff'}
              </button>

            </form>

          </section>

        </div>

      </div>

    </main>
  );
}