'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FindTicketPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (searching) return;

    setSearching(true);
    setError(null);

    try {
      const response = await fetch('/api/ticket/find', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Tiket tidak dapat ditemukan.'
        );
      }

      if (data.type === 'vip') {
        router.push(`/ticket/ticket-vip/${data.id}`);
      } else {
        router.push(`/ticket/${data.id}`);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan. Silakan coba lagi.'
      );
    } finally {
      setSearching(false);
    }
  };

  return (
    <main className="find-ticket-page">

      {/* BACKGROUND DECORATION */}
      <div
        className="find-ticket-orb find-ticket-orb-left"
        aria-hidden="true"
      />

      <div
        className="find-ticket-orb find-ticket-orb-right"
        aria-hidden="true"
      />

      <div
        className="find-ticket-pattern"
        aria-hidden="true"
      />

        <div
  className="ticket-find-decoration"
  aria-hidden="true"
>
  <div className="ticket-find-orbit ticket-find-orbit-left" />
  <div className="ticket-find-orbit ticket-find-orbit-right" />

  <svg
    className="ticket-find-lantern ticket-find-lantern-left"
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
    className="ticket-find-lantern ticket-find-lantern-right"
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
    className="ticket-find-crescent"
    viewBox="0 0 100 100"
  >
    <path
      d="M65 15c-23 5-39 26-35 49 4 24 27 40 51 34-18-5-31-22-31-42 0-17 8-32 22-41-2 0-5 0-7 0Z"
      fill="currentColor"
    />
  </svg>

  <div className="ticket-find-mosque ticket-find-mosque-left">
    <span className="ticket-find-mosque-dome" />
    <span className="ticket-find-mosque-body" />
    <span className="ticket-find-mosque-minaret" />
  </div>

  <div className="ticket-find-mosque ticket-find-mosque-right">
    <span className="ticket-find-mosque-dome" />
    <span className="ticket-find-mosque-body" />
    <span className="ticket-find-mosque-minaret" />
  </div>
</div>

      <div className="find-ticket-shell">

        {/* TOP */}
        <section className="find-ticket-intro">

          <span className="find-ticket-kicker">
            E-Ticket Jamaah
          </span>

          <h1>
            Cari Tiket Saya
          </h1>

          <p>
            Masukkan alamat email yang Anda gunakan
            saat registrasi. Kami akan membuka kembali
            e-ticket Anda secara otomatis.
          </p>

        </section>


        {/* SEARCH CARD */}
        <section className="find-ticket-card">

          <div className="find-ticket-card-content">

            <div className="find-ticket-icon">
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
                  strokeWidth="1.8"
                />

                <path
                  d="M4 7L10.7 12.1C11.47 12.69 12.53 12.69 13.3 12.1L20 7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>


            <h2>
              Temukan E-Ticket Anda
            </h2>

            <p className="find-ticket-card-copy">
              Gunakan email yang sama dengan email
              yang Anda isi saat melakukan pendaftaran.
            </p>


            <form
              onSubmit={handleSubmit}
              className="find-ticket-form"
            >

              <div className="find-ticket-form-group">

                <label htmlFor="email">
                  Email
                  <span>*</span>
                </label>

                <div className="find-ticket-input-wrap">

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
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                  />

                </div>

              </div>


              {error && (
                <div className="find-ticket-error">
                  {error}
                </div>
              )}


              <button
                type="submit"
                disabled={searching}
                className="find-ticket-submit"
              >
                {searching
                  ? 'Mencari Tiket...'
                  : 'Cari Tiket'}
              </button>

            </form>


            <div className="find-ticket-divider">
              <span />
              <p>atau</p>
              <span />
            </div>


            <button
              type="button"
              className="find-ticket-back"
              onClick={() =>
                router.push('/register')
              }
            >
              Kembali ke Registrasi
            </button>

          </div>

        </section>


        <p className="find-ticket-note">
          Satu alamat email hanya terhubung dengan
          satu tiket pendaftaran.
        </p>

      </div>

    </main>
  );
}