'use client';

import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';
import IslamicAnimatedBg from '@/components/IslamicAnimatedBg';

type Gender =
  | 'Ikhwan'
  | 'Akhwat'
  | '';

type Confirmation =
  | 'YA'
  | 'TIDAK'
  | '';

type Gate =
  | 'Surapati'
  | 'Diponegoro'
  | '';

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type CityOption = {
  code: string;
  name: string;
};

// SESUAIKAN dengan tanggal acara kamu
const EVENT_DATE = new Date(
  '2026-09-23T08:00:00+07:00'
);

export default function RegisterPage() {
  const router = useRouter();

  // =========================
  // CITY
  // =========================

  const [cities, setCities] =
    useState<CityOption[]>([]);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await fetch(
          '/api/regions/cities'
        );

        const data = await response.json();

        if (response.ok) {
          setCities(data.cities ?? []);
        }
      } catch (error) {
        console.error(
          'Failed to load cities:',
          error
        );
      }
    };

    loadCities();
  }, []);

  // =========================
  // FORM
  // =========================

  const [fullName, setFullName] =
    useState('');

  const [phoneNumber, setPhoneNumber] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [gender, setGender] =
    useState<Gender>('');

  const [city, setCity] =
    useState('');

    const [showCitySuggestions, setShowCitySuggestions] =
  useState(false);

  const [institution, setInstitution] =
    useState('');

  const [confirmation, setConfirmation] =
    useState<Confirmation>('');

  const [gate, setGate] =
    useState<Gate>('');

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [countdown, setCountdown] =
    useState<Countdown>({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

  // =========================
  // COUNTDOWN
  // =========================

  useEffect(() => {
    const calculateCountdown = () => {
      const now =
        new Date().getTime();

      const target =
        EVENT_DATE.getTime();

      const distance =
        Math.max(
          target - now,
          0
        );

      setCountdown({
        days: Math.floor(
          distance /
            (1000 * 60 * 60 * 24)
        ),

        hours: Math.floor(
          (distance /
            (1000 * 60 * 60)) %
            24
        ),

        minutes: Math.floor(
          (distance /
            (1000 * 60)) %
            60
        ),

        seconds: Math.floor(
          (distance / 1000) % 60
        ),
      });
    };

    calculateCountdown();

    const interval = setInterval(
      calculateCountdown,
      1000
    );

    return () =>
      clearInterval(interval);
  }, []);

  // ⬇️ MULAIKAN KODE LAMA KAMU DI SINI

  /* ======================
      SUBMIT
  ====================== */

  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const response =
        await fetch(
          '/api/register',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify({
                fullName,
                phoneNumber,
                email,
                gender,
                city,
                institution,
                // REVISI: field baru dikirim ke API
                confirmation,
                gate,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        if (
          response.status === 409 &&
          data.id
        ) {
          router.push(
            `/ticket/${data.id}`
          );

          return;
        }

        throw new Error(
          data.error ||
            'Registrasi gagal. Silakan coba lagi.'
        );
      }

      router.push(
        `/ticket/${data.id}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan. Silakan coba lagi.'
      );
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <main className="register-v2-page islamic-pattern">
    

      <div className="register-v2-shell">
        

        {/* ======================
            PAGE TITLE
        ====================== */}

        <header className="register-v2-heading-wrap">

          <div className="register-v2-heading-panel">

            <div
              className="heading-mosque-bg"
              aria-hidden="true"
            >

              <div className="mosque-minaret mosque-minaret-left" />

              <div className="mosque-dome mosque-dome-left" />


              <div className="mosque-main">


                <div className="mosque-main-dome" />

                <div className="mosque-main-body" />

              </div>


              <div className="mosque-dome mosque-dome-right" />

              <div className="mosque-minaret mosque-minaret-right" />

            </div>


            <div className="register-v2-heading-inner">

              <h1
                className="register-v2-heading manual-spacing"
                aria-label="Pengajian Akbar"
              >

                {'Pengajian Akbar'
                  .split('')
                  .map(
                    (
                      char,
                      index
                    ) => (
                      <span
                        key={`${char}-${index}`}
                        aria-hidden="true"
                        className={
                          char === ' '
                            ? 'manual-space'
                            : undefined
                        }
                      >
                        {char === ' '
                          ? '\u00A0'
                          : char}
                      </span>
                    )
                  )}

              </h1>
              
              <h2 className="register-v2-event-title">
              MT MHABD
            </h2>

              <div className="register-v2-heading-line" />

            </div>

          </div>

        </header>

        {/* ======================
            PARTNERS / SUPPORTERS
        ====================== */}

<section className="register-partners-card">

  <div className="register-partners-heading">
    <span className="register-partners-kicker">
      Didukung Oleh
    </span>
  </div>

  <div className="register-partners-logos">

    <div className="register-partners-track">

      <div className="register-partner-logo">
        <img
          src="/image/logo_biofarma.png"
          alt="Bio Farma"
        />
      </div>

      <div className="register-partner-logo">
        <img
          src="/image/logo_jc.png"
          alt="JC"
        />
      </div>

      <div className="register-partner-logo">
        <img
          src="/image/logo-triman.png"
          alt="Triman"
        />
      </div>
      
      <div className="register-partner-logo">
        <img
          src="/image/logo-tactlink.png"
          alt="TactLink"
        />
      </div>

      <div className="register-partner-logo">
        <img
          src="/image/logo-cw.png"
          alt="Corak Warna"
        />
      </div>

      <div className="register-partner-logo">
        <img
          src="/image/logo-klinik.png"
          alt="Klinik"
        />
      </div>

      <div className="register-partner-logo">
        <img
          src="/image/logo-manson.png"
          alt="Manson"
        />
      </div>

      

      {/* DUPLICATE — untuk infinite loop */}

      <div className="register-partner-logo">
        <img
          src="/image/logo_biofarma.png"
          alt="Bio Farma"
        />
      </div>

      <div className="register-partner-logo">
        <img
          src="/image/logo_jc.png"
          alt="JC"
        />
      </div>

      <div className="register-partner-logo">
        <img
          src="/image/logo-triman.png"
          alt="Triman"
        />
      </div>

      <div className="register-partner-logo">
        <img
          src="/image/logo-tactlink.png"
          alt="TactLink"
        />
      </div>

      <div className="register-partner-logo">
        <img
          src="/image/logo-cw.png"
          alt="Corak Warna"
        />
      </div>

      <div className="register-partner-logo">
        <img
          src="/image/logo-klinik.png"
          alt="Klinik"
        />
      </div>

      <div className="register-partner-logo">
        <img
          src="/image/logo-manson.png"
          alt="Manson"
        />
      </div>

    </div>

  </div>

</section>

        {/* ======================
            CONTENT
        ====================== */}

        <div className="register-v2-grid">


          {/* ======================
              INFORMASI ACARA
          ====================== */}

          <section className="event-master-card event-master-card-decorated">

            {/* DECORATIVE ISLAMIC ELEMENTS */}
            <div
              className="event-islamic-decor"
              aria-hidden="true"
            >

              <div className="event-decor-orbit event-decor-orbit-one" />
              <div className="event-decor-orbit event-decor-orbit-two" />

              <svg
                className="event-decor-lantern event-decor-lantern-one"
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
                className="event-decor-lantern event-decor-lantern-two"
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
                className="event-decor-crescent"
                viewBox="0 0 100 100"
              >
                <path
                  d="M65 15c-23 5-39 26-35 49 4 24 27 40 51 34-18-5-31-22-31-42 0-17 8-32 22-41-2 0-5 0-7 0Z"
                  fill="currentColor"
                />
              </svg>

              <svg
                className="event-decor-star event-decor-star-one"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 1.8c.7 5.8 4.4 9.5 10.2 10.2-5.8.7-9.5 4.4-10.2 10.2C11.3 16.4 7.6 12.7 1.8 12 7.6 11.3 11.3 7.6 12 1.8Z"
                  fill="currentColor"
                />
              </svg>

              <svg
                className="event-decor-star event-decor-star-two"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 1.8c.7 5.8 4.4 9.5 10.2 10.2-5.8.7-9.5 4.4-10.2 10.2C11.3 16.4 7.6 12.7 1.8 12 7.6 11.3 11.3 7.6 12 1.8Z"
                  fill="currentColor"
                />
              </svg>

              <div className="event-decor-arch event-decor-arch-one" />
              <div className="event-decor-arch event-decor-arch-two" />

            </div>


            <div className="event-master-content">


              <div className="event-section-kicker">
                Informasi Acara
              </div>


              <h2 className="event-main-title">
                Meneladani
                <br />
                Rasulullah SAW
              </h2>


              <p className="event-main-copy">
                Hijrah Menuju Istiqomah,
                Menguatkan Keluarga dan
                Ukhuwah.
              </p>


              {/* COUNTDOWN */}

              <div className="countdown-wrap">

                <div className="countdown-label">
                  Acara dimulai dalam
                </div>


                <div className="countdown-single-card">

                  <div className="countdown-single-unit">

                    <span className="countdown-single-number">
                      {countdown.days}
                    </span>

                    <span className="countdown-single-text">
                      Hari
                    </span>

                  </div>


                  <span className="countdown-separator">
                    :
                  </span>


                  <div className="countdown-single-unit">

                    <span className="countdown-single-number">
                      {String(
                        countdown.hours
                      ).padStart(
                        2,
                        '0'
                      )}
                    </span>

                    <span className="countdown-single-text">
                      Jam
                    </span>

                  </div>


                  <span className="countdown-separator">
                    :
                  </span>


                  <div className="countdown-single-unit">

                    <span className="countdown-single-number">
                      {String(
                        countdown.minutes
                      ).padStart(
                        2,
                        '0'
                      )}
                    </span>

                    <span className="countdown-single-text">
                      Menit
                    </span>

                  </div>


                  <span className="countdown-separator">
                    :
                  </span>


                  <div className="countdown-single-unit">

                    <span className="countdown-single-number">
                      {String(
                        countdown.seconds
                      ).padStart(
                        2,
                        '0'
                      )}
                    </span>

                    <span className="countdown-single-text">
                      Detik
                    </span>

                  </div>

                </div>

              </div>


              {/* DATE + TIME */}

              <div className="event-detail-card event-detail-card-compact">

                <div className="event-detail-row event-detail-row-icon">

                  <div className="event-detail-islamic-icon">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <rect
                        x="4"
                        y="5.5"
                        width="16"
                        height="14"
                        rx="2.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M8 3.5v4M16 3.5v4M4 9.5h16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <div className="event-detail-content">
                    <div className="event-detail-label">
                      Tanggal
                    </div>

                    <strong>
                      Rabu, 23 September 2026
                    </strong>

                    <span>
                      Peringatan Maulid Nabi
                      Muhammad SAW
                    </span>
                  </div>

                </div>


                <div className="event-detail-divider" />


                <div className="event-detail-row event-detail-row-icon">

                  <div className="event-detail-islamic-icon">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="8.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M12 7.5v5l3 1.8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="event-detail-content">
                    <div className="event-detail-label">
                      Waktu
                    </div>

                    <strong>
                      13.00 – 17.45 WIB
                    </strong>

                    <span>
                      Jamaah disarankan hadir
                      lebih awal sebelum acara
                      dimulai.
                    </span>
                  </div>

                </div>

              </div>


              {/* FREE + QUOTA */}

              <div className="event-benefit-grid">

                <div className="event-benefit-card">

                  <div className="event-benefit-icon">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 8.5V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2.5a2.6 2.6 0 0 0 0 5V16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2.5a2.6 2.6 0 0 0 0-5Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 7v10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeDasharray="1.4 2.2"
                      />
                    </svg>
                  </div>

                  <div className="event-benefit-copy">
                    <span>Free Entry</span>
                    <strong>Gratis</strong>
                    <p>Tidak dipungut biaya pendaftaran</p>
                  </div>

                </div>


                <div className="event-benefit-card">

                  <div className="event-benefit-icon">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 4a3.7 3.7 0 1 1 0 7.4A3.7 3.7 0 0 1 12 4ZM5.5 20c.5-3.7 2.8-5.8 6.5-5.8s6 2.1 6.5 5.8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M18.5 5.4h2M19.5 4.4v2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <div className="event-benefit-copy">
                    <span>Limited Seats</span>
                    <strong>Kuota Terbatas</strong>
                    <p>Registrasi sesuai ketersediaan tempat</p>
                  </div>

                </div>

              </div>


              {/* ======================
                  VENUE CARD
              ====================== */}

              <section className="event-location-card">

                <div className="event-location-heading">

                  <div>

                    <span className="event-location-kicker">
                      Lokasi
                    </span>

                    <h3>
                      Masjid PUSDAI Jawa Barat
                    </h3>

                  </div>

                </div>


                <div className="event-location-media">

                  <img
                    src="/image/pusdai.png"
                    alt="Masjid PUSDAI Jawa Barat"
                    className="event-location-image"
                  />

                </div>


                <a
                  href="https://www.google.com/maps/search/?api=1&query=Masjid+PUSDAI+Jawa+Barat+Jl.+Diponegoro+No.+63+Bandung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="event-location-link"
                >

                  <div className="event-location-link-icon">

                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="9"
                        r="2.2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                      />
                    </svg>

                  </div>


                  <div className="event-location-link-copy">

                    <strong>
                      Masjid PUSDAI Jawa Barat
                    </strong>

                    <span>
                      Jl. Diponegoro No. 63,
                      Citarum, Kec. Bandung Wetan,
                      Kota Bandung.
                    </span>

                    <small>
                      Buka lokasi di Google Maps
                    </small>

                  </div>


                  <svg
                    className="event-location-arrow"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                </a>

              </section>

            </div>

          </section>


          {/* ======================
              RIGHT COLUMN
          ====================== */}

          <div className="register-v2-right-stack">


            {/* ======================
                FORM REGISTRASI
            ====================== */}

            <section className="registration-form-card">

              <div
                className="form-islamic-decoration"
                aria-hidden="true"
              >
                <svg
                  className="form-decor-crescent"
                  viewBox="0 0 100 100"
                >
                  <path
                    d="M66 16c-22 5-38 25-34 48 4 23 26 39 49 33-17-5-30-21-30-40 0-17 8-31 21-40-2-1-4-1-6-1Z"
                    fill="currentColor"
                  />
                </svg>

                <svg
                  className="form-decor-star"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2c.7 5.7 4.3 9.3 10 10-5.7.7-9.3 4.3-10 10-.7-5.7-4.3-9.3-10-10 5.7-.7 9.3-4.3 10-10Z"
                    fill="currentColor"
                  />
                </svg>

                <div className="form-decor-arch" />
              </div>

              <div className="form-card-kicker">
                Data Jamaah
              </div>


              <h2 className="form-card-title">
                Form Registrasi
              </h2>


              <p className="form-card-copy">
                Lengkapi data berikut untuk
                mendapatkan e-ticket dan
                QR code kehadiran.
              </p>


              <form
                onSubmit={
                  handleSubmit
                }
              >

                <div className="form-grid">


                  <div className="form-group">

                    <label
                      className="form-label"
                      htmlFor="fullName"
                    >
                      Nama Lengkap *
                    </label>

                    <input
                      id="fullName"
                      type="text"
                      className="form-input"
                      placeholder="Masukkan nama lengkap"
                      value={fullName}
                      onChange={(event) =>
                        setFullName(
                          event.target.value
                        )
                      }
                      required
                    />

                  </div>


                  <div className="form-group">

                    <label
                      className="form-label"
                      htmlFor="phoneNumber"
                    >
                      No. Telepon *
                    </label>

                    <input
                      id="phoneNumber"
                      type="tel"
                      className="form-input"
                      placeholder="08xxxxxxxxxx"
                      value={phoneNumber}
                      onChange={(event) =>
                        setPhoneNumber(
                          event.target.value
                        )
                      }
                      required
                    />

                  </div>


                  <div className="form-group">

                    <label
                      className="form-label"
                      htmlFor="email"
                    >
                      Email *
                    </label>

                    <input
                      id="email"
                      type="email"
                      className="form-input"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      required
                    />

                  </div>


                  <div className="form-group">

                    <label
                      className="form-label"
                      htmlFor="gender"
                    >
                      Kategori Jamaah *
                    </label>

                    <select
                      id="gender"
                      className="form-select"
                      value={gender}
                      onChange={(event) =>
                        setGender(
                          event.target
                            .value as Gender
                        )
                      }
                      required
                    >

                      <option value="">
                        Pilih kategori jamaah
                      </option>

                      <option value="Ikhwan">
                        Ikhwan
                      </option>

                      <option value="Akhwat">
                        Akhwat
                      </option>

                    </select>

                  </div>


                  <div className="form-group city-field">

  <label
    className="form-label"
    htmlFor="city"
  >
    Kota / Domisili *
  </label>

  <div className="city-input-container">

    <input
      id="city"
      type="text"
      className="form-input"
      placeholder="Contoh: Bandung"
      value={city}
      onFocus={() =>
        setShowCitySuggestions(true)
      }
      onChange={(event) => {
        setCity(event.target.value);
        setShowCitySuggestions(true);
      }}
      required
    />

    <span className="city-dropdown-icon">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M6 9l6 6 6-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>

    {showCitySuggestions &&
      city.trim() !== '' && (
        <div className="city-suggestions">

          {cities
            .filter((item) =>
              item.name
                .toLowerCase()
                .includes(
                  city.toLowerCase()
                )
            )
            .slice(0, 8)
            .map((item) => (
              <button
                key={item.code}
                type="button"
                className="city-suggestion-item"
                onClick={() => {
                  setCity(item.name);
                  setShowCitySuggestions(
                    false
                  );
                }}
              >
                {item.name}
              </button>
            ))}

        </div>
      )}

  </div>

</div>


                  <div className="form-group">

                    <label
                      className="form-label"
                      htmlFor="institution"
                    >
                      Jamaah
                    </label>

                    <input
                      id="institution"
                      type="text"
                      className="form-input"
                      placeholder="Majelis/Pesantren/Komunitas"
                      value={institution}
                      onChange={(event) =>
                        setInstitution(
                          event.target.value
                        )
                      }
                    />

                  </div>


                  {/* ======================
                      REVISI: Konfirmasi Kehadiran
                  ====================== */}

                  <div className="form-group">

                    <label
                      className="form-label"
                      htmlFor="confirmation"
                    >
                      Konfirmasi Kehadiran *
                    </label>

                    <select
                      id="confirmation"
                      className="form-select"
                      value={confirmation}
                      onChange={(event) =>
                        setConfirmation(
                          event.target
                            .value as Confirmation
                        )
                      }
                      required
                    >

                      <option value="">
                        Pilih konfirmasi
                      </option>

                      <option value="YA">
                        YA
                      </option>

                      <option value="TIDAK">
                        TIDAK
                      </option>

                    </select>

                  </div>


                  {/* ======================
                      REVISI: Pintu Masuk dari Arah
                  ====================== */}

                  <div className="form-group form-group-full">

                    <label className="form-label">
                      Pintu Masuk dari Arah *
                    </label>

                    <div className="radio-pill-group">

                      <label className="radio-pill">
                        <input
                          type="radio"
                          name="gate"
                          value="Surapati"
                          checked={gate === 'Surapati'}
                          onChange={() =>
                            setGate('Surapati')
                          }
                          required
                        />
                        <span>Surapati</span>
                      </label>

                      <label className="radio-pill">
                        <input
                          type="radio"
                          name="gate"
                          value="Diponegoro"
                          checked={gate === 'Diponegoro'}
                          onChange={() =>
                            setGate('Diponegoro')
                          }
                        />
                        <span>Diponegoro</span>
                      </label>

                    </div>

                  </div>

                </div>


                {error && (
                  <div className="alert alert-error mt-24">
                    {error}
                  </div>
                )}


                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary w-full mt-32"
                >
                  {submitting
                    ? 'Mendaftarkan...'
                    : 'Daftar Sekarang'}
                </button>

              </form>

            </section>


            {/* ======================
                CARI TIKET
            ====================== */}

            <section className="ticket-find-strip">

              <div className="ticket-find-content">

                <div>

                  <h3 className="ticket-find-title">
                    Sudah pernah mendaftar?
                  </h3>

                  <p className="ticket-find-copy">
                    Temukan kembali e-ticket
                    Anda menggunakan alamat
                    email yang sama saat
                    pendaftaran.
                  </p>

                </div>


                <button
                  type="button"
                  className="btn btn-primary ticket-find-button"
                  onClick={() =>
                    router.push(
                      '/ticket/find'
                    )
                  }
                >
                  Cari Tiket Saya
                </button>

              </div>

            </section>


            {/* ======================
                TACTLINK
            ====================== */}

            <section className="tactlink-promo-card">

              <div
                className="tactlink-accent"
                aria-hidden="true"
              />


              <div className="tactlink-promo-inner">


                <div className="tactlink-powered">
                  POWERED BY
                </div>


                <div className="tactlink-main">

                  <div className="tactlink-logo-box">

                    <img
                      src="/image/logo-tactlink.png"
                      alt="TactLink"
                      className="tactlink-logo"
                    />

                  </div>


                  <div className="tactlink-copy">

                    <h3>
                      Connect smarter with
                      <strong>
                        TactLink
                      </strong>
                    </h3>

                    <p>
                      Experience smarter networking
                      and modern digital business cards.
                    </p>

                  </div>

                </div>


                {/* VISIT */}

                <a
                  href="https://www.tactlink.com/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tactlink-visit-button"
                >

                  <span>
                    Visit TactLink
                  </span>

                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M14 5h5v5M19 5l-8 8M19 13v6H5V5h6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                </a>


                {/* STORE BUTTONS */}

                <div className="tactlink-store-links">


                  {/* APP STORE */}

                  <a
                    href="https://apps.apple.com/id/app/tactlink/id1469516661"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tactlink-store-card"
                  >

                    <div className="tactlink-store-icon">

                      <svg
                        className="tactlink-apple-logo"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M17.05 12.536c-.02-2.146 1.755-3.19 1.835-3.24-1.005-1.472-2.568-1.673-3.122-1.689-1.314-.139-2.59.787-3.26.787-.684 0-1.716-.773-2.828-.75-1.432.022-2.773.852-3.508 2.142-1.514 2.622-.385 6.476 1.065 8.595.725 1.04 1.572 2.2 2.683 2.159 1.087-.045 1.493-.694 2.806-.694 1.3 0 1.682.694 2.815.668 1.167-.019 1.902-1.043 2.601-2.092.839-1.194 1.176-2.369 1.189-2.429-.028-.009-2.244-.855-2.266-3.457ZM14.904 6.215c.583-.73.982-1.724.871-2.734-.845.037-1.9.585-2.507 1.299-.537.63-1.017 1.662-.893 2.633.95.071 1.905-.48 2.529-1.198Z"
                        />
                      </svg>

                    </div>


                    <div className="tactlink-store-copy">

                      <small>
                        DOWNLOAD ON THE
                      </small>

                      <strong>
                        App Store
                      </strong>

                    </div>

                  </a>


                  {/* GOOGLE PLAY */}

                  <a
                    href="https://play.google.com/store/apps/details?id=com.tactlink.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tactlink-store-card"
                  >

                    <div className="tactlink-store-icon">

                      <svg
                        className="tactlink-google-logo"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          fill="#00D6A0"
                          d="M7.2 5.1c-.8.9-1.2 2.1-1.2 3.6v30.6c0 1.5.4 2.7 1.2 3.6L7.4 43 24.6 25.8v-3.6L7.4 5Z"
                        />
                        <path
                          fill="#FFD24A"
                          d="M30.3 31.5 24.6 25.8v-3.6l5.7-5.7.1.1 6.8 3.9c1.9 1.1 1.9 2.9 0 4l-6.8 3.9-.1.1Z"
                        />
                        <path
                          fill="#FF5A5F"
                          d="M30.4 31.4 24.6 25.8 7.2 43c1.2 1.3 3.1 1.4 5.2.2l18-10.3Z"
                        />
                        <path
                          fill="#3F7CFF"
                          d="M30.4 16.6 12.4 6.3C10.3 5.1 8.4 5.2 7.2 6.5l17.4 17.3 5.8-7.2Z"
                        />
                      </svg>

                    </div>


                    <div className="tactlink-store-copy">

                      <small>
                        GET IT ON
                      </small>

                      <strong>
                        Google Play
                      </strong>

                    </div>

                  </a>

                </div>


                {/* TACTLINK FOOTER */}

                <div className="tactlink-footer">

                  <div className="tactlink-footer-item">

                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 7h11v12H8zM5 4h11v3M5 4v12h3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <strong>
                      10,000+ Cards Shared
                    </strong>

                  </div>


                  <div className="tactlink-footer-divider" />


                  <div className="tactlink-footer-item">

                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />

                      <path
                        d="M3 12h18M12 3c2.3 2.5 3.5 5.5 3.5 9S14.3 18.5 12 21M12 3C9.7 5.5 8.5 8.5 8.5 12S9.7 18.5 12 21"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>

                    <span>
                      Available in 8 Countries
                    </span>

                  </div>

                </div>

              </div>

            </section>

          </div>

        </div>

      </div>


      {/* ======================
          FOOTER
      ====================== */}

      <footer className="register-footer">

        <p className="register-footer-copyright">
          © 2026 Pengajian Akbar MT MHABD
        </p>

        <div className="register-footer-powered">
          <span>Powered by</span>

          <img
            src="/image/logo-tactlink.png"
            alt="TactLink"
            className="tactlink-footer-logo"
          />
        </div>

        <p className="register-footer-dev">
          Dev by{' '}
          <a
            href="https://www.linkedin.com/in/aliyahalfitarossa"
            aria-label="Website Aliyah"
          >
            Aliyah Alfita Rossa
          </a>
        </p>

      </footer>


      {/* ==================================================
          LOCAL OVERRIDES
          HANYA UNTUK RIGHT COLUMN + TACTLINK + MOBILE ORDER
      ================================================== */}

      <style jsx global>{`


        /* =============================================
           EVENT INFORMATION - DECORATIVE
           HANYA BAGIAN INFORMASI ACARA
        ============================================= */

        .event-master-card-decorated {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .event-master-card-decorated
        .event-master-content {
          position: relative;
          z-index: 2;
        }

        .event-islamic-decor {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          pointer-events: none;
          color: rgba(255, 242, 197, 0.22);
        }

        .event-decor-orbit {
          position: absolute;
          border:
            1px solid
            rgba(255, 244, 205, 0.2);
          border-radius: 50%;
        }

        .event-decor-orbit-one {
          width: 390px;
          height: 390px;
          top: -120px;
          right: -165px;
        }

        .event-decor-orbit-two {
          width: 520px;
          height: 520px;
          left: -355px;
          bottom: 150px;
          opacity: 0.55;
        }

        .event-decor-lantern {
          position: absolute;
          color: rgba(255, 237, 179, 0.18);
        }

        .event-decor-lantern-one {
          width: 58px;
          height: auto;
          top: 32px;
          right: 42px;
        }

        .event-decor-lantern-two {
          width: 42px;
          height: auto;
          top: 135px;
          right: 116px;
          opacity: 0.55;
        }

        .event-decor-crescent {
          position: absolute;
          width: 54px;
          height: 54px;
          top: 70px;
          right: 142px;
          color: rgba(255, 238, 179, 0.16);
          transform: rotate(-12deg);
        }

        .event-decor-star {
          position: absolute;
          color: rgba(255, 235, 168, 0.27);
        }

        .event-decor-star-one {
          width: 18px;
          height: 18px;
          top: 64px;
          right: 105px;
        }

        .event-decor-star-two {
          width: 12px;
          height: 12px;
          top: 120px;
          right: 76px;
          opacity: 0.75;
        }

        .event-decor-arch {
          position: absolute;
          width: 105px;
          height: 145px;
          border:
            1px solid
            rgba(255, 243, 200, 0.1);
          border-radius:
            52px 52px 18px 18px;
          transform: translateY(42%);
        }

        .event-decor-arch::before {
          content: "";
          position: absolute;
          width: 68px;
          height: 68px;
          left: 50%;
          top: -34px;
          transform:
            translateX(-50%)
            rotate(45deg);
          border-left:
            1px solid
            rgba(255, 243, 200, 0.1);
          border-top:
            1px solid
            rgba(255, 243, 200, 0.1);
          border-radius:
            20px 0 0 0;
        }

        .event-decor-arch-one {
          left: 28px;
          bottom: 46px;
        }

        .event-decor-arch-two {
          left: 150px;
          bottom: 18px;
          width: 82px;
          height: 116px;
          opacity: 0.55;
        }


        /* DATE / TIME CARD */

        .event-detail-card-compact {
          position: relative;
          overflow: hidden;
        }

        .event-detail-card-compact::after {
          content: "";
          position: absolute;
          width: 135px;
          height: 135px;
          right: -72px;
          bottom: -78px;
          border:
            1px solid
            rgba(23, 130, 91, 0.08);
          border-radius: 50%;
          pointer-events: none;
        }


        /* =============================================
           LOCATION CARD
        ============================================= */

        .event-location-card {
          width: 100%;
          margin-top: 22px;
          overflow: hidden;

          border:
            1px solid
            rgba(255, 243, 204, 0.18);

          border-radius: 28px;

          background:
            rgba(255, 252, 240, 0.96);

          box-shadow:
            0 18px 38px
            rgba(0, 78, 56, 0.15);
        }

        .event-location-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;

          padding:
            24px 26px 20px;
        }

        .event-location-kicker {
          display: block;
          margin-bottom: 7px;

          font-family:
            "Noto Sans",
            Arial,
            sans-serif;

          font-size: 0.66rem;
          font-weight: 800;
          letter-spacing: 0.17em;
          text-transform: uppercase;

          color: #2aa77c;
        }

        .event-location-heading h3 {
          margin: 0;

          font-size: 1.35rem;
          line-height: 1.25;
          font-weight: 500;

          color: #086b50;
        }

        .event-location-media {
          margin:
            0 18px;

          overflow: hidden;

          aspect-ratio: 16 / 8.7;

          border-radius:
            20px 20px 0 0;

          background: #e7efe8;
        }

        .event-location-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .event-location-link {
          position: relative;

          display: grid;
          grid-template-columns:
            38px minmax(0, 1fr) 20px;
          align-items: center;

          gap: 13px;

          margin:
            0 18px 18px;

          padding:
            17px 18px;

          border:
            1px solid
            rgba(17, 113, 80, 0.11);

          border-top: 0;

          border-radius:
            0 0 20px 20px;

          background:
            linear-gradient(
              135deg,
              #ffffff 0%,
              #f5faf3 100%
            );

          color: inherit;
          text-decoration: none;

          transition:
            background 0.18s ease,
            transform 0.18s ease,
            box-shadow 0.18s ease;
        }

        .event-location-link:hover {
          background: #f1f9f3;

          transform:
            translateY(-1px);

          box-shadow:
            0 10px 22px
            rgba(20, 91, 67, 0.08);
        }

        .event-location-link-icon {
          width: 38px;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 11px;

          background:
            rgba(22, 165, 116, 0.1);

          color: #0d8a63;
        }

        .event-location-link-icon svg {
          width: 20px;
          height: 20px;
        }

        .event-location-link-copy {
          min-width: 0;

          display: flex;
          flex-direction: column;
        }

        .event-location-link-copy strong {
          font-size: 0.86rem;
          line-height: 1.35;
          font-weight: 700;

          color: #105f49;
        }

        .event-location-link-copy span {
          margin-top: 4px;

          font-family:
            "Noto Sans",
            Arial,
            sans-serif;

          font-size: 0.68rem;
          line-height: 1.55;

          color: #71897f;
        }

        .event-location-link-copy small {
          margin-top: 7px;

          font-family:
            "Noto Sans",
            Arial,
            sans-serif;

          font-size: 0.6rem;
          line-height: 1.3;
          font-weight: 800;

          color: #15906a;
        }

        .event-location-arrow {
          width: 18px;
          height: 18px;

          color: #269678;
        }


        @media (
          max-width: 760px
        ) {

          .event-decor-lantern-one {
            width: 46px;
            top: 30px;
            right: 25px;
          }

          .event-decor-lantern-two {
            width: 34px;
            top: 112px;
            right: 82px;
          }

          .event-decor-crescent {
            width: 43px;
            height: 43px;
            top: 68px;
            right: 99px;
          }

          .event-decor-star-one {
            right: 69px;
          }

          .event-decor-star-two {
            right: 36px;
          }

          .event-decor-orbit-one {
            width: 330px;
            height: 330px;
            right: -185px;
            top: -80px;
          }

          .event-decor-arch-one {
            left: -18px;
            bottom: 35px;
          }

          .event-decor-arch-two {
            left: 90px;
          }

          .event-location-card {
            margin-top: 18px;
            border-radius: 24px;
          }

          .event-location-heading {
            padding:
              22px 22px 18px;
          }

          .event-location-heading h3 {
            font-size: 1.22rem;
          }

          .event-location-media {
            margin:
              0 14px;

            aspect-ratio:
              16 / 9;

            border-radius:
              18px 18px 0 0;
          }

          .event-location-link {
            grid-template-columns:
              36px minmax(0, 1fr) 18px;

            gap: 11px;

            margin:
              0 14px 14px;

            padding:
              15px;

            border-radius:
              0 0 18px 18px;
          }

          .event-location-link-icon {
            width: 36px;
            height: 36px;
          }

          .event-location-link-copy strong {
            font-size: 0.8rem;
          }

          .event-location-link-copy span {
            font-size: 0.64rem;
          }

        }



        /* =============================================
           EVENT DETAIL + BENEFITS
           TETAP CREAM, HANYA DITAMBAH IKON
        ============================================= */

        .event-detail-row-icon {
          display: grid;
          grid-template-columns:
            54px minmax(0, 1fr);
          gap: 16px;
          align-items: flex-start;
        }

        .event-detail-islamic-icon {
          width: 54px;
          height: 58px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #0b7d5b;

          background:
            linear-gradient(
              145deg,
              #e7f6ec,
              #f6f4df
            );

          border:
            1px solid
            rgba(12, 118, 84, 0.12);

          border-radius:
            28px 28px 15px 15px;
        }

        .event-detail-islamic-icon svg {
          width: 24px;
          height: 24px;
        }

        .event-benefit-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 12px;
        }

        .event-benefit-card {
          position: relative;
          overflow: hidden;

          display: grid;
          grid-template-columns:
            48px minmax(0, 1fr);
          gap: 13px;
          align-items: center;

          padding: 16px;

          border:
            1px solid
            rgba(12, 118, 84, 0.12);

          border-radius:
            24px 24px 18px 18px;

          background:
            linear-gradient(
              145deg,
              #fffdf2 0%,
              #f7f4df 100%
            );

          box-shadow:
            0 10px 24px
            rgba(0, 73, 52, 0.08);
        }

        .event-benefit-card::after {
          content: "";
          position: absolute;
          width: 78px;
          height: 78px;
          right: -34px;
          bottom: -36px;

          border:
            1px solid
            rgba(17, 128, 90, 0.08);

          border-radius:
            38px 38px 14px 14px;

          transform:
            rotate(18deg);
        }

        .event-benefit-icon {
          position: relative;
          z-index: 2;

          width: 48px;
          height: 52px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius:
            24px 24px 13px 13px;

          background:
            rgba(19, 145, 101, 0.09);

          color: #0b7d5b;
        }

        .event-benefit-icon svg {
          width: 23px;
          height: 23px;
        }

        .event-benefit-copy {
          position: relative;
          z-index: 2;
          min-width: 0;
        }

        .event-benefit-copy span {
          display: block;
          margin-bottom: 3px;

          font-family:
            "Noto Sans",
            Arial,
            sans-serif;

          font-size: 0.5rem;
          line-height: 1;
          font-weight: 800;
          letter-spacing: 0.13em;
          text-transform: uppercase;

          color: #47a184;
        }

        .event-benefit-copy strong {
          display: block;

          font-size: 0.9rem;
          line-height: 1.25;
          font-weight: 500;

          color: #086b50;
        }

        .event-benefit-copy p {
          margin: 5px 0 0;

          font-family:
            "Noto Sans",
            Arial,
            sans-serif;

          font-size: 0.62rem;
          line-height: 1.45;

          color: #789086;
        }


        /* FORM DECORATION - DIPERTAHANKAN */

        .registration-form-card {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .registration-form-card > * {
          position: relative;
          z-index: 2;
        }

        .registration-form-card::before {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          top: -150px;
          right: -130px;

          border:
            1px solid
            rgba(14, 135, 94, 0.08);

          border-radius: 50%;

          box-shadow:
            0 0 0 42px rgba(26, 165, 117, 0.025),
            0 0 0 85px rgba(26, 165, 117, 0.018);

          pointer-events: none;
          z-index: 0;
        }

        .registration-form-card::after {
          content: "";
          position: absolute;
          width: 160px;
          height: 160px;
          left: -70px;
          bottom: -75px;

          border:
            1px solid
            rgba(210, 170, 66, 0.10);

          border-radius:
            50% 50% 42% 58%;

          transform: rotate(25deg);
          pointer-events: none;
          z-index: 0;
        }

        .form-islamic-decoration {
          position: absolute !important;
          top: 0;
          right: 0;
          width: 220px;
          height: 190px;
          pointer-events: none;
          color: rgba(11, 119, 82, 0.08);
          z-index: 1 !important;
        }

        .form-decor-crescent {
          position: absolute;
          width: 50px;
          height: 50px;
          top: 34px;
          right: 42px;
          transform: rotate(-12deg);
        }

        .form-decor-star {
          position: absolute;
          width: 17px;
          height: 17px;
          top: 31px;
          right: 103px;
          color: rgba(216, 173, 62, 0.16);
        }

        .form-decor-arch {
          position: absolute;
          width: 105px;
          height: 125px;
          top: 62px;
          right: 18px;

          border:
            1px solid
            rgba(11, 119, 82, 0.06);

          border-radius:
            52px 52px 14px 14px;
        }


        /* FIND TICKET - PUTIH SEPERTI FORM */

        .register-v2-right-stack .ticket-find-strip {
          background: #fffefa !important;

          border:
            1px solid
            rgba(15, 117, 82, 0.1) !important;

          box-shadow:
            0 16px 38px
            rgba(26, 84, 63, 0.07) !important;
        }


        /* FOOTER */

        .register-footer {
          width:
            min(
              760px,
              calc(100% - 40px)
            );

          margin:
            52px auto 18px;

          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;

          text-align: center;

          font-family:
            "Noto Sans",
            Arial,
            sans-serif;

          color:
            rgba(10, 100, 73, 0.63);
        }

        .register-footer p {
          margin: 0;
        }

        .register-footer-copyright {
          font-size: 0.61rem;
        }

        .register-footer-powered {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.58rem;
        }

        .register-footer-powered img {
          width: 29px;
          height: 17px;
          object-fit: contain;
          opacity: 0.68;
        }

        .register-footer-dev {
          font-size: 0.6rem;
        }

        .register-footer-dev a {
          color: #087455;
          font-weight: 800;
          text-decoration: none;
        }

        .register-footer-dev a:hover {
          text-decoration: underline;
        }


        @media (max-width: 760px) {

          .event-benefit-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 9px;
          }

          .event-benefit-card {
            grid-template-columns:
              40px minmax(0, 1fr);
            gap: 10px;
            padding: 13px 12px;
            border-radius:
              20px 20px 15px 15px;
          }

          .event-benefit-icon {
            width: 40px;
            height: 44px;
            border-radius:
              20px 20px 11px 11px;
          }

          .event-benefit-copy strong {
            font-size: 0.78rem;
          }

          .event-benefit-copy p {
            font-size: 0.56rem;
          }

          .registration-form-card::before {
            width: 230px;
            height: 230px;
            top: -120px;
            right: -115px;
          }

          .form-islamic-decoration {
            width: 160px;
            height: 145px;
            opacity: 0.8;
          }

          .form-decor-crescent {
            width: 38px;
            height: 38px;
            top: 26px;
            right: 30px;
          }

          .form-decor-star {
            width: 13px;
            height: 13px;
            top: 25px;
            right: 75px;
          }

          .form-decor-arch {
            width: 76px;
            height: 96px;
            top: 48px;
            right: 14px;
          }

          .register-footer {
            width: calc(100% - 32px);
            margin-top: 38px;
            margin-bottom: 14px;
          }

        }


        /* =============================================
           RIGHT COLUMN
        ============================================= */

        .register-v2-right-stack {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }


        /* =============================================
           FIND TICKET
        ============================================= */

        .register-v2-right-stack .ticket-find-strip {
          width: 100%;
          margin: 0;
          padding: 28px;

          border-radius: 24px;

          border:
            1px solid
            rgba(15, 117, 82, 0.12);

          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 251, 0.98),
              rgba(239, 249, 240, 0.96)
            );

          box-shadow:
            0 15px 36px
            rgba(24, 76, 59, 0.06);
        }


        .ticket-find-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }


        .ticket-find-button {
          flex-shrink: 0;
          min-width: 150px;
          margin: 0 !important;
        }


        /* =============================================
           TACTLINK
        ============================================= */

        .tactlink-promo-card,
        .tactlink-promo-card * {
          box-sizing: border-box;
        }


        .tactlink-promo-card {
          position: relative;

          width: 100%;

          overflow: hidden;

          border:
            1px solid
            rgba(11, 116, 83, 0.12);

          border-radius: 26px;

          background:
            linear-gradient(
              145deg,
              #fffef9 0%,
              #fbfdf8 62%,
              #f3faef 100%
            );

          box-shadow:
            0 18px 40px
            rgba(25, 74, 58, 0.07);

          font-family:
            "Noto Sans",
            Arial,
            Helvetica,
            sans-serif;
        }


        .tactlink-accent {
          width: 100%;
          height: 5px;

          background:
            linear-gradient(
              90deg,
              #087455 0%,
              #19a576 48%,
              #e8b846 78%,
              #f1d273 100%
            );
        }


        .tactlink-promo-inner {
          padding: 30px;
        }


        /* POWERED BY */

        .tactlink-powered {
          width: fit-content;

          display: flex;
          align-items: center;
          justify-content: center;

          min-height: 34px;

          margin-bottom: 28px;
          padding: 0 14px;

          border-radius: 9px;

          background: #087b5a;

          color: #ffffff;

          font-family:
            "Noto Sans",
            Arial,
            sans-serif;

          font-size: 0.59rem;
          line-height: 1;
          font-weight: 800;

          letter-spacing: 0.18em;
        }


        /* MAIN */

        .tactlink-main {
          display: grid;

          grid-template-columns:
            78px minmax(0, 1fr);

          align-items: center;

          gap: 20px;
        }


        .tactlink-logo-box {
          width: 78px;
          height: 78px;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;

          border:
            1px solid
            rgba(20, 78, 62, 0.12);

          border-radius: 19px;

          background: #ffffff;

          box-shadow:
            0 8px 18px
            rgba(25, 71, 56, 0.06);
        }


        .tactlink-logo {
          display: block;

          width: 70%;
          height: 70%;

          object-fit: contain;
        }


        .tactlink-copy h3 {
          margin: 0 !important;

          font-family:
            "Noto Sans",
            Arial,
            Helvetica,
            sans-serif !important;

          font-size:
            clamp(
              1.35rem,
              2vw,
              1.75rem
            ) !important;

          line-height: 1.16 !important;

          font-weight: 600 !important;

          letter-spacing:
            -0.025em !important;

          color: #173f33 !important;
        }


        .tactlink-copy h3 strong {
          display: block;

          margin-top: 4px;

          font-family:
            "Noto Sans",
            Arial,
            Helvetica,
            sans-serif !important;

          font-weight: 800 !important;

          color: #087b5a !important;
        }


        .tactlink-copy p {
          margin: 11px 0 0;

          font-family:
            "Noto Sans",
            Arial,
            Helvetica,
            sans-serif;

          font-size: 0.8rem;
          line-height: 1.6;

          color: #74877f;
        }


        /* VISIT */

        .tactlink-visit-button {
          width: 100%;
          min-height: 52px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 9px;

          margin-top: 27px;

          border-radius: 13px;

          background:
            linear-gradient(
              90deg,
              #087455,
              #1bae7c
            );

          color: #ffffff;

          text-decoration: none;

          font-family:
            "Noto Sans",
            Arial,
            Helvetica,
            sans-serif;

          font-size: 0.82rem;
          font-weight: 800;

          box-shadow:
            0 10px 22px
            rgba(8, 116, 85, 0.16);

          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease;
        }


        .tactlink-visit-button:hover {
          transform:
            translateY(-1px);

          box-shadow:
            0 13px 26px
            rgba(8, 116, 85, 0.22);
        }


        .tactlink-visit-button svg {
          width: 17px;
          height: 17px;

          flex: 0 0 auto;
        }


        /* STORE */

        .tactlink-store-links {
          width: min(
            430px,
            100%
          );

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 12px;

          margin:
            18px auto 0;
        }


        .tactlink-store-card {
          min-width: 0;
          min-height: 64px;

          display: flex;
          align-items: center;

          gap: 12px;

          padding:
            10px 15px;

          border:
            1px solid
            rgba(24, 73, 58, 0.15);

          border-radius: 14px;

          background: #ffffff;

          color: #163d31;

          text-decoration: none;

          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }


        .tactlink-store-card:hover {
          transform:
            translateY(-1px);

          border-color:
            rgba(8, 116, 85, 0.28);

          box-shadow:
            0 7px 18px
            rgba(25, 72, 57, 0.06);
        }


        .tactlink-store-icon {
          width: 34px;
          height: 34px;

          flex: 0 0 34px;

          display: flex;
          align-items: center;
          justify-content: center;
        }


        .tactlink-apple-logo {
          width: 29px;
          height: 29px;

          color: #101b18;
        }


        .tactlink-google-logo {
          width: 30px;
          height: 30px;
        }


        .tactlink-store-copy {
          min-width: 0;

          display: flex;
          flex-direction: column;

          gap: 1px;
        }


        .tactlink-store-copy small {
          display: block;

          margin: 0;

          font-family:
            "Noto Sans",
            Arial,
            Helvetica,
            sans-serif;

          font-size: 0.48rem;
          line-height: 1.25;

          font-weight: 700;

          letter-spacing: 0.12em;

          color: #8b9c95;
        }


        .tactlink-store-copy strong {
          display: block;

          margin: 0;

          font-family:
            "Noto Sans",
            Arial,
            Helvetica,
            sans-serif;

          font-size: 0.8rem;
          line-height: 1.3;

          font-weight: 800;

          color: #173f33;
        }


        /* FOOTER */

        .tactlink-footer {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 16px;

          margin-top: 24px;
          padding-top: 19px;

          border-top:
            1px solid
            rgba(16, 87, 65, 0.09);

          font-family:
            "Noto Sans",
            Arial,
            Helvetica,
            sans-serif;

          color: #6e827a;

          font-size: 0.68rem;
          line-height: 1.4;
        }


        .tactlink-footer-item {
          display: flex;
          align-items: center;

          gap: 7px;

          white-space: nowrap;
        }


        .tactlink-footer-item svg {
          width: 17px;
          height: 17px;

          flex: 0 0 17px;

          color: #6b8279;
        }


        .tactlink-footer-item strong {
          font-family:
            "Noto Sans",
            Arial,
            Helvetica,
            sans-serif;

          font-weight: 800;

          color: #345e4d;
        }


        .tactlink-footer-divider {
          width: 1px;
          height: 17px;

          background:
            rgba(39, 91, 73, 0.16);
        }


        /* =============================================
           REVISI: Konfirmasi Kehadiran & Pintu Masuk
           Class baru: .form-group-full, .radio-pill-group,
           .radio-pill — tema hijau/emas mengikuti tema umum.
           Silakan sesuaikan lagi saat CSS final dikirim.
        ============================================= */

        .form-group-full {
          grid-column: 1 / -1;
        }

        .radio-pill-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 6px;
        }

        .radio-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          border-radius: 999px;
          border: 1px solid rgba(11, 119, 82, 0.25);
          background: #fff;
          font-family: 'Noto Sans', Arial, sans-serif;
          font-size: 0.76rem;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }

        .radio-pill:has(input:checked) {
          border-color: #0b7d5b;
          background: rgba(11, 119, 82, 0.08);
          color: #086b50;
          font-weight: 700;
        }

        .radio-pill input {
          accent-color: #0b7d5b;
        }


        /* =============================================
           MOBILE
           URUTAN WAJIB:
           1 INFO
           2 FORM
           3 CARI TIKET
           4 TACTLINK
        ============================================= */

        @media (
          max-width: 760px
        ) {

          .register-v2-grid {
            display: flex !important;

            flex-direction:
              column !important;

            align-items:
              stretch !important;

            gap: 20px !important;
          }


          .register-v2-grid >
          .event-master-card {
            order: 1 !important;

            width: 100% !important;
          }


          .register-v2-grid >
          .register-v2-right-stack {
            display:
              contents !important;
          }


          .register-v2-right-stack >
          .registration-form-card {
            order: 2 !important;

            width: 100% !important;
          }


          .register-v2-right-stack >
          .ticket-find-strip {
            order: 3 !important;

            width: 100% !important;
          }


          .register-v2-right-stack >
          .tactlink-promo-card {
            order: 4 !important;

            width: 100% !important;
          }


          /* FIND TICKET */

          .register-v2-right-stack
          .ticket-find-strip {
            margin: 0 !important;

            padding:
              25px 22px !important;

            border-radius:
              22px !important;
          }


          .ticket-find-content {
            display: flex;

            flex-direction: column;

            align-items: stretch;

            gap: 20px;
          }


          .ticket-find-button {
            width: 100%;

            min-width: 0;

            margin: 0 !important;
          }


          /* TACTLINK */

          .tactlink-promo-card {
            border-radius: 22px;
          }


          .tactlink-promo-inner {
            padding:
              24px 20px 22px;
          }


          .tactlink-powered {
            min-height: 31px;

            margin-bottom: 23px;

            padding:
              0 12px;

            font-size: 0.53rem;

            border-radius: 8px;
          }


          .tactlink-main {
            grid-template-columns:
              70px minmax(0, 1fr);

            gap: 15px;
          }


          .tactlink-logo-box {
            width: 70px;
            height: 70px;

            border-radius: 17px;
          }


          .tactlink-copy h3 {
            font-size:
              1.12rem !important;

            line-height:
              1.22 !important;
          }


          .tactlink-copy p {
            margin-top: 8px;

            font-size: 0.73rem;

            line-height: 1.55;
          }


          .tactlink-visit-button {
            min-height: 50px;

            margin-top: 23px;

            border-radius: 12px;
          }


          .tactlink-store-links {
            width: min(430px, 100%);

            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 10px;

            margin:
              14px auto 0;
          }


          .tactlink-store-card {
            min-height: 60px;

            justify-content: center;

            gap: 9px;

            padding:
              9px 10px;
          }


          .tactlink-store-icon {
            width: 30px;
            height: 30px;
            flex-basis: 30px;
          }


          .tactlink-apple-logo,
          .tactlink-google-logo {
            width: 26px;
            height: 26px;
          }


          .tactlink-store-copy small {
            font-size: 0.42rem;
          }


          .tactlink-store-copy strong {
            font-size: 0.7rem;
          }


          .tactlink-footer {
            flex-direction: column;

            gap: 9px;

            margin-top: 20px;

            text-align: center;
          }


          .tactlink-footer-divider {
            display: none;
          }


          .tactlink-footer-item {
            white-space: normal;

            justify-content: center;
          }

        }


        /* SMALL MOBILE */

        @media (
          max-width: 430px
        ) {

          .tactlink-main {
            grid-template-columns:
              62px minmax(0, 1fr);

            gap: 13px;
          }


          .tactlink-logo-box {
            width: 62px;
            height: 62px;

            border-radius: 15px;
          }


          .tactlink-copy h3 {
            font-size:
              1rem !important;
          }


          .tactlink-copy p {
            font-size: 0.68rem;
          }


          .tactlink-store-links {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 8px;
          }

          .tactlink-store-card {
            padding: 8px 7px;
          }

          .tactlink-store-copy small {
            font-size: 0.38rem;
          }

          .tactlink-store-copy strong {
            font-size: 0.64rem;
          }

        }

      `}</style>

    </main>
  );
}