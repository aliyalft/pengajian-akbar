import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseClient';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import DownloadTicketButton from '@/components/DownloadTicketButton';

type TicketPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const JAMAAH_TYPE_LABEL: Record<string, string> = {
  majelis_taklim: 'Majelis Taklim',
  organisasi: 'Organisasi',
  komunitas: 'Komunitas',
  perorangan: 'Perorangan',
};

export default async function TicketVipPage({
  params,
}: TicketPageProps) {
  const { id } = await params;

  const { data: registration, error } =
    await supabaseAdmin
      .from('registrations_vip')
      .select(
        `
        id,
        full_name,
        phone_number,
        email,
        gender,
        jamaah_type,
        jamaah_name,
        city,
        confirmation,
        gate,
        checked_in,
        checked_in_at,
        created_at
      `
      )
      .eq('id', id)
      .maybeSingle();

  if (error) {
    console.error(
      'VIP ticket page error:',
      error
    );

    throw new Error(
      'Tiket VIP tidak dapat dimuat.'
    );
  }

  if (!registration) {
    notFound();
  }

  const isCheckedIn =
    Boolean(registration.checked_in);

  const jamaahDisplay =
    registration.jamaah_type === 'perorangan'
      ? 'Perorangan'
      : `${
          JAMAAH_TYPE_LABEL[registration.jamaah_type] ?? ''
        }${
          registration.jamaah_name
            ? ` — ${registration.jamaah_name}`
            : ''
        }`;

  return (
    <main className="ticket-page ticket-page-vip">
      <div
        className="ticket-page-orb ticket-page-orb-left"
        aria-hidden="true"
      />

      <div
        className="ticket-page-orb ticket-page-orb-right"
        aria-hidden="true"
      />

      <div
        className="ticket-page-pattern"
        aria-hidden="true"
      />

      <div className="ticket-page-shell">

        {/* SUCCESS */}
        <section className="ticket-success">

          <div className="ticket-success-icon">
            ✓
          </div>

          <h1 className="ticket-success-title">
            Pendaftaran VIP Berhasil!
          </h1>

          <p className="ticket-success-copy">
            Registrasi VIP Anda untuk Pengajian Akbar
            MT MHABD telah terkonfirmasi.
            Silakan simpan e-ticket berikut dan
            tunjukkan QR Code kepada petugas saat
            check-in.
          </p>

        </section>


        {/* DOWNLOADABLE TICKET */}
        <section
          id="downloadable-ticket"
          className="event-ticket"
        >

          <div className="event-ticket-notch event-ticket-notch-left" />

          <div className="event-ticket-notch event-ticket-notch-right" />


          {/* HEADER */}
          <div className="event-ticket-header">

            <div
              className="event-ticket-header-pattern"
              aria-hidden="true"
            />


            {/* ISLAMIC DECORATION */}
            <div
              className="event-ticket-header-focus"
              aria-hidden="true"
            >

              <div className="event-ticket-focus-orbit event-ticket-focus-orbit-left" />

              <div className="event-ticket-focus-orbit event-ticket-focus-orbit-right" />


              <svg
                className="event-ticket-focus-lantern event-ticket-focus-lantern-left"
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
                className="event-ticket-focus-lantern event-ticket-focus-lantern-right"
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
                className="event-ticket-focus-crescent"
                viewBox="0 0 100 100"
              >
                <path
                  d="M65 15c-23 5-39 26-35 49 4 24 27 40 51 34-18-5-31-22-31-42 0-17 8-32 22-41-2 0-5 0-7 0Z"
                  fill="currentColor"
                />
              </svg>


              <svg
                className="event-ticket-focus-star event-ticket-focus-star-one"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 1.8c.7 5.8 4.4 9.5 10.2 10.2-5.8.7-9.5 4.4-10.2 10.2C11.3 16.4 7.6 12.7 1.8 12 7.6 11.3 11.3 7.6 12 1.8Z"
                  fill="currentColor"
                />
              </svg>


              <svg
                className="event-ticket-focus-star event-ticket-focus-star-two"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 1.8c.7 5.8 4.4 9.5 10.2 10.2-5.8.7-9.5 4.4-10.2 10.2C11.3 16.4 7.6 12.7 1.8 12 7.6 11.3 11.3 7.6 12 1.8Z"
                  fill="currentColor"
                />
              </svg>


              <div className="event-ticket-focus-arch event-ticket-focus-arch-left" />

              <div className="event-ticket-focus-arch event-ticket-focus-arch-right" />

            </div>


            <div className="event-ticket-header-content">

              <span className="event-ticket-eyebrow">
                E-Ticket Kehadiran
              </span>

              <h2>
                Pengajian Akbar
                <br />
                MT MHABD
              </h2>

              <p>
                Meneladani Rasulullah SAW
              </p>

            </div>

          </div>


          {/* BODY */}
          <div className="event-ticket-body">

            <div className="event-ticket-layout">


              {/* LEFT */}
              <div className="event-ticket-main">

                <div className="ticket-participant">

                  <span className="ticket-small-label">
                    Nama Jamaah
                  </span>

                  <h3>
                    {registration.full_name}
                  </h3>

                </div>


                <div className="ticket-meta-grid">

                  <div className="ticket-meta-item">

                    <span className="ticket-small-label">
                      Kategori Jamaah
                    </span>

                    <strong>
                      {registration.gender}
                    </strong>

                  </div>


                  <div className="ticket-meta-item">

                    <span className="ticket-small-label">
                      Kota / Domisili
                    </span>

                    <strong>
                      {registration.city}
                    </strong>

                  </div>


                  <div className="ticket-meta-item ticket-meta-wide">

                    <span className="ticket-small-label">
                      Jamaah
                    </span>

                    <strong>
                      {jamaahDisplay}
                    </strong>

                  </div>


                  <div className="ticket-meta-item">

                    <span className="ticket-small-label">
                      Konfirmasi Kehadiran
                    </span>

                    <strong>
                      {registration.confirmation}
                    </strong>

                  </div>


                  <div className="ticket-meta-item">

                    <span className="ticket-small-label">
                      Pintu Masuk
                    </span>

                    <strong>
                      {registration.gate}
                    </strong>

                  </div>

                </div>


                <div className="ticket-dashed-divider" />


                <div className="ticket-event-info">


                  {/* DATE */}
                  <div className="ticket-event-row">

                    <div className="ticket-event-icon">

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <rect
                          x="3.5"
                          y="5.5"
                          width="17"
                          height="15"
                          rx="2.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />

                        <path
                          d="M7 3.8V7.2M17 3.8V7.2M3.5 9.5H20.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>

                    </div>


                    <div>

                      <span className="ticket-small-label">
                        Tanggal & Waktu
                      </span>

                      <strong>
                        Rabu, 23 September 2026
                      </strong>

                      <p>
                        13.00 – 17.45 WIB
                      </p>

                    </div>

                  </div>


                  {/* LOCATION */}
                  <div className="ticket-event-row">

                    <div className="ticket-event-icon">

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >

                        <path
                          d="M3.5 20H20.5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M6.5 20V13.8"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M17.5 20V13.8"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M6.5 13.8 C6.5 10.7 8.95 8.4 12 8.4 C15.05 8.4 17.5 10.7 17.5 13.8"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />

                        <path
                          d="M10 20V16.5 C10 15.4 10.9 14.5 12 14.5 C13.1 14.5 14 15.4 14 16.5V20"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />

                        <path
                          d="M4.5 20V9.5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M19.5 20V9.5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M3.6 9.5H5.4"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M18.6 9.5H20.4"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M4.5 6.8V9.5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M19.5 6.8V9.5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M3.8 6.8H5.2L4.5 5.4L3.8 6.8Z"
                          fill="currentColor"
                        />

                        <path
                          d="M18.8 6.8H20.2L19.5 5.4L18.8 6.8Z"
                          fill="currentColor"
                        />

                        <path
                          d="M12 8.4V6.4"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M12 5.1 C12.65 5.1 13.15 4.6 13.15 4 C12.72 4.3 12.36 4.35 12 4.35 C11.64 4.35 11.28 4.3 10.85 4 C10.85 4.6 11.35 5.1 12 5.1Z"
                          fill="currentColor"
                        />

                      </svg>

                    </div>


                    <div>

                      <span className="ticket-small-label">
                        Lokasi
                      </span>

                      <strong>
                        Masjid PUSDAI Jawa Barat
                      </strong>

                      <p>
                        Jl. Diponegoro No. 63,
                        Kota Bandung
                      </p>

                    </div>

                  </div>

                </div>

              </div>


              {/* RIGHT */}
              <aside className="event-ticket-side">


                {/* QR */}
                <div className="ticket-qr-section">

                  <div className="ticket-qr-frame">

                    <QRCodeDisplay
                      value={registration.id}
                    />

                  </div>


                  <p className="ticket-qr-title">
                    QR Code Kehadiran
                  </p>


                  <p className="ticket-qr-copy">
                    Tunjukkan QR Code ini kepada
                    petugas saat proses check-in.
                  </p>

                </div>


                {/* STATUS */}
                <div
                  className={`ticket-status ticket-status-${
                    isCheckedIn
                      ? 'checked'
                      : 'active'
                  }`}
                >

                  <span className="ticket-status-icon">

                    {isCheckedIn ? (

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="1.9"
                        />

                        <path
                          d="M8 12.2 10.8 15 16.4 9.4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                    ) : (

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <rect
                          x="4"
                          y="5"
                          width="16"
                          height="14"
                          rx="3"
                          stroke="currentColor"
                          strokeWidth="1.9"
                        />

                        <path
                          d="M8 10h8M8 14h5"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                        />
                      </svg>

                    )}

                  </span>


                  <span className="ticket-status-text">

                    {isCheckedIn
                      ? 'Sudah Check-in'
                      : 'Tiket Aktif'}

                  </span>

                </div>


               {/* TACTLINK */}
            <div className="ticket-brand-wrap">
            <div className="ticket-brand-card">
                <div className="ticket-brand-card-inner">

                <div className="ticket-brand-logo-box">
                    <img
                    src="/image/logo-tactlink.png"
                    alt="TactLink"
                    className="ticket-brand-logo"
                    width={44}
                    height={44}
                    loading="eager"
                    decoding="sync"
                    />
                </div>

                <div className="ticket-brand-copy">
                    <span className="ticket-brand-label">
                    Powered by
                    </span>

                    <strong>
                      Connect smarter with TactLink
                    </strong>
                </div>

                </div>
            </div>
            </div>

            </aside>

            </div>

            </div>

          {/* FOOTER */}
          <div className="event-ticket-footer">

            <span>
              Pengajian Akbar MT MHABD — VIP
            </span>

            <span>
              23.09.2026
            </span>

          </div>

        </section>


        {/* ACTIONS */}
        <div className="ticket-actions">

          <DownloadTicketButton />

          <Link
            href="/register-vip"
            className="ticket-home-button"
          >
            <span>
              Kembali ke Registrasi
            </span>
          </Link>

        </div>


        <p className="ticket-page-note">
          Simpan e-ticket ini sampai acara selesai.
          Satu QR Code berlaku untuk satu jamaah.
        </p>

      </div>


      {/* ======================================================
          LOCAL OVERRIDE — WARNA KARTU NAVY (VIP)

          Semua override di bawah discope ke `.ticket-page-vip`
          supaya TIDAK memengaruhi ticket umum (yang tetap hijau).
          Nilai navy dipilih mengikuti pola/level warna hijau yang
          sudah ada (gradient 3-stop, opacity dekorasi, dst) —
          jadi hanya hue-nya yang berubah, bukan strukturnya.

          Saya belum punya file CSS global asli (yang mendefinisikan
          warna hijau untuk .event-ticket-header, .ticket-status-active,
          dll), jadi override ini saya tulis berdasarkan warna hijau
          yang konsisten dipakai di halaman register (misal #087455,
          #0b7d5b, #19a576, #086b50). Kalau nanti CSS aslinya dikirim
          dan ada bagian yang levelnya beda, tinggal saya sesuaikan lagi.
      ====================================================== */}

      <style>{`

        /* HEADER — dari hijau 3-stop jadi navy 3-stop, pola sama */
        .ticket-page-vip .event-ticket-header {
          background: linear-gradient(
            135deg,
            #0b2340 0%,
            #123a63 55%,
            #1e5c94 100%
          ) !important;
        }

        /* ikon & garis dekoratif header pakai currentColor,
           jadi cukup set warna dasarnya di sini */
        .ticket-page-vip .event-ticket-header-focus {
          color: rgba(233, 240, 250, 0.22) !important;
        }

        .ticket-page-vip .event-ticket-eyebrow {
          color: #cfe0f6 !important;
        }

        /* ikon tanggal/lokasi di body tiket */
        .ticket-page-vip .ticket-event-icon {
          color: #123a63 !important;
          background: rgba(18, 58, 99, 0.09) !important;
        }

        /* status "Tiket Aktif" */
        .ticket-page-vip .ticket-status-active {
          color: #123a63 !important;
          background: rgba(18, 58, 99, 0.08) !important;
          border-color: rgba(18, 58, 99, 0.18) !important;
        }

        .ticket-page-vip .event-ticket-footer {
  background: #123a63 !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
  color: #f7f1df !important;
}

.ticket-page-vip .event-ticket-footer span {
  color: #f7f1df !important;
}

        /* frame QR & label kecil ikut aksen navy */
        .ticket-page-vip .ticket-qr-frame {
          border-color: rgba(18, 58, 99, 0.18) !important;
        }

        .ticket-page-vip .ticket-small-label {
          color: #4f8dc9 !important;
        }

        .ticket-page-vip .ticket-participant h3,
        .ticket-page-vip .ticket-meta-item strong {
          color: #0b2340 !important;
        }

      `}</style>

    </main>
  );
}