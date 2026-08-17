'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import Html5QrScanner from '@/components/Html5QrScanner';
import StaffLogoutButton from '@/components/StaffLogoutButton';

type Registration = {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  gender: 'Ikhwan' | 'Akhwat';
  city: string;
  institution: string | null;
  checked_in: boolean;
  checked_in_at: string | null;
};

type ScanResult =
  | {
      status: 'success';
      registration: Registration;
    }
  | {
      status: 'already_checked_in';
      registration: Registration;
    };

type ScanHistoryItem = {
  id: string;
  registrationId?: string;
  name: string;
  status:
    | 'success'
    | 'already_checked_in'
    | 'error';
  time: string;
  message?: string;
};

export default function ScannerPage() {
  const [result, setResult] =
    useState<ScanResult | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [checkingIn, setCheckingIn] =
    useState(false);

  const [showHelp, setShowHelp] =
    useState(false);

  const [historyOpen, setHistoryOpen] =
    useState(false);

  const [history, setHistory] =
    useState<ScanHistoryItem[]>([]);

  const [stats, setStats] = useState({
    checkedIn: 0,
    total: 0,
  });

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch(
        '/api/stats',
        {
          cache: 'no-store',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Gagal memuat statistik.'
        );
      }

      setStats({
        checkedIn: data.checkedIn,
        total: data.total,
      });
    } catch (err) {
      console.error(
        'Load stats error:',
        err
      );
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const response = await fetch(
        '/api/admin/registrations',
        {
          cache: 'no-store',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Gagal memuat riwayat scan.'
        );
      }

      const registrations =
        (data.registrations ??
          []) as Registration[];

      const checkedInHistory: ScanHistoryItem[] =
        registrations
          .filter(
            (registration) =>
              registration.checked_in &&
              registration.checked_in_at
          )
          .sort(
            (a, b) =>
              new Date(
                b.checked_in_at as string
              ).getTime() -
              new Date(
                a.checked_in_at as string
              ).getTime()
          )
          .slice(0, 8)
          .map((registration) => ({
            id: `db-${registration.id}`,

            registrationId:
              registration.id,

            name:
              registration.full_name,

            status: 'success',

            time: new Date(
              registration.checked_in_at as string
            ).toLocaleTimeString(
              'id-ID',
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            ),
          }));

      setHistory(checkedInHistory);
    } catch (err) {
      console.error(
        'Load scan history error:',
        err
      );
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadHistory();
  }, [loadStats, loadHistory]);

  const handleScanSuccess = async (
    decodedText: string
  ) => {
    if (checkingIn) return;

    setCheckingIn(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        '/api/checkin',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            id: decodedText,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Check-in gagal.'
        );
      }

      const scanResult =
        data as ScanResult;

      setResult(scanResult);

      const successHistoryItem: ScanHistoryItem =
        {
          id: crypto.randomUUID(),

          registrationId:
            scanResult.registration.id,

          name:
            scanResult.registration
              .full_name,

          status:
            scanResult.status,

          time:
            new Date().toLocaleTimeString(
              'id-ID',
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            ),
        };

      setHistory((current) => {
        const withoutSameRegistration =
          current.filter(
            (item) =>
              item.registrationId !==
              scanResult.registration.id
          );

        return [
          successHistoryItem,
          ...withoutSameRegistration,
        ].slice(0, 8);
      });

      if (
        scanResult.status ===
        'success'
      ) {
        await loadStats();
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat check-in.';

      setError(message);

      const errorHistoryItem: ScanHistoryItem =
        {
          id: crypto.randomUUID(),

          name: 'QR tidak valid',

          status: 'error',

          message,

          time:
            new Date().toLocaleTimeString(
              'id-ID',
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            ),
        };

      setHistory((current) => {
        const updatedHistory: ScanHistoryItem[] =
          [
            errorHistoryItem,
            ...current,
          ];

        return updatedHistory.slice(
          0,
          8
        );
      });
    } finally {
      setCheckingIn(false);
    }
  };

  const progress =
    stats.total > 0
      ? Math.round(
          (stats.checkedIn /
            stats.total) *
            100
        )
      : 0;

  const currentHistory =
    history;

  return (
    <main className="scanner-page-v3">
      <div
        className="scanner-page-v3-pattern"
        aria-hidden="true"
      />

      <div className="scanner-v3-shell">

        {/* HELP BUTTON */}
        <button
          type="button"
          className="scanner-help-button scanner-help-button-top"
          onClick={() =>
            setShowHelp(true)
          }
          aria-label="Bantuan scanner"
        >
          ?
        </button>


        {/* HEADER */}
        <header className="scanner-v3-header">
          <span className="scanner-v3-kicker">
            Event Check-in
          </span>

          <h1>
            QR Check-in Scanner
          </h1>

          <p>
            Scan QR Code pada e-ticket
            jamaah untuk memvalidasi
            registrasi dan menyelesaikan
            proses check-in.
          </p>
        </header>


        {/* SCANNER */}
        <section className="scanner-v3-card">

          <div className="scanner-v3-card-head">
            <div>
              <span>
                Scan QR Jamaah
              </span>

              <h2>
                Arahkan QR Code ke kamera
              </h2>
            </div>
          </div>


          <Html5QrScanner
            onScanSuccess={
              handleScanSuccess
            }
          />


          {checkingIn && (
            <div className="scanner-v3-processing">
              Memproses check-in...
            </div>
          )}


          {error && (
            <div className="scanner-v3-feedback scanner-v3-feedback-error">

              <div>
                <span className="scanner-v3-feedback-label">
                  Check-in Gagal
                </span>

                <strong>
                  QR Code tidak dapat diproses
                </strong>
              </div>

              <div className="scanner-v3-feedback-data">
                <span>
                  {error}
                </span>
              </div>

            </div>
          )}


          {result && (
            <div
              className={
                result.status ===
                'success'
                  ? 'scanner-v3-feedback scanner-v3-feedback-success'
                  : 'scanner-v3-feedback scanner-v3-feedback-already'
              }
            >

              <div>
                <span className="scanner-v3-feedback-label">

                  {result.status ===
                  'success'
                    ? 'Check-in Berhasil'
                    : 'Sudah Pernah Check-in'}

                </span>

                <strong>
                  {
                    result.registration
                      .full_name
                  }
                </strong>
              </div>


              <div className="scanner-v3-feedback-data">

                <span>
                  {
                    result.registration
                      .gender
                  }
                </span>

                <span>
                  {
                    result.registration
                      .city
                  }
                </span>

                {result.registration
                  .institution && (
                  <span>
                    {
                      result.registration
                        .institution
                    }
                  </span>
                )}

              </div>

            </div>
          )}

        </section>


        {/* ATTENDANCE */}
        <section className="scanner-progress-card">

          <div className="scanner-progress-top">

            <div>
              <span>
                Kehadiran Jamaah
              </span>

              <strong>
                {stats.checkedIn}

                <small>
                  / {stats.total}
                </small>
              </strong>
            </div>

            <div className="scanner-progress-percent">
              {progress}%
            </div>

          </div>


          <div className="scanner-progress-track">

            <div
              className="scanner-progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </section>


        {/* HISTORY */}
        <section
          className={`scan-history-card ${
            historyOpen
              ? 'is-open'
              : ''
          }`}
        >

          <button
            type="button"
            className="scan-history-toggle"
            onClick={() =>
              setHistoryOpen(
                (current) =>
                  !current
              )
            }
            aria-expanded={
              historyOpen
            }
          >

            <span className="scan-history-toggle-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 6h12M8 12h12M8 18h12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                <circle
                  cx="4"
                  cy="6"
                  r="1.2"
                  fill="currentColor"
                />

                <circle
                  cx="4"
                  cy="12"
                  r="1.2"
                  fill="currentColor"
                />

                <circle
                  cx="4"
                  cy="18"
                  r="1.2"
                  fill="currentColor"
                />
              </svg>
            </span>


            <span className="scan-history-toggle-copy">
              <strong>
                Riwayat Scan
              </strong>

              <small>
                Lihat hasil check-in terbaru
              </small>
            </span>


            <span className="scan-history-count">
              {currentHistory.length}
            </span>


            <span
              className="scan-history-chevron"
              aria-hidden="true"
            >
              ›
            </span>

          </button>

        </section>


        {/* HISTORY SIDE PANEL */}
        {historyOpen && (
          <div
            className="scan-history-drawer-backdrop"
            onClick={() =>
              setHistoryOpen(false)
            }
          >

            <aside
              className="scan-history-drawer"
              onClick={(event) =>
                event.stopPropagation()
              }
              aria-label="Riwayat Scan"
            >

              <div className="scan-history-drawer-head">

                <div>
                  <span>
                    Riwayat Scan
                  </span>

                  <h2>
                    Hasil check-in terbaru
                  </h2>

                  <p>
                    {currentHistory.length}{' '}
                    aktivitas terakhir
                  </p>
                </div>


                <button
                  type="button"
                  className="scan-history-drawer-close"
                  onClick={() =>
                    setHistoryOpen(false)
                  }
                  aria-label="Tutup riwayat scan"
                >
                  ×
                </button>

              </div>


              <div className="scan-history-drawer-body">

                {currentHistory.length ===
                0 ? (

                  <div className="scan-history-empty">
                    Belum ada aktivitas scan pada sesi ini.
                  </div>

                ) : (

                  <div className="scan-history-list scan-history-list-drawer">

                    {currentHistory.map(
                      (item) => (

                        <div
                          className="scan-history-item scan-history-item-drawer"
                          key={item.id}
                        >

                          {/* STATUS ICON */}
                          <div
                            className={`scan-history-status scan-history-status-${item.status}`}
                          >

                            {item.status ===
                            'error' ? (

                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                              >
                                <path
                                  d="M8 8L16 16M16 8L8 16"
                                  stroke="currentColor"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                />
                              </svg>

                            ) : (

                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                              >
                                <path
                                  d="M7.5 12.5L10.4 15.4L16.8 9"
                                  stroke="currentColor"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>

                            )}

                          </div>


                          {/* NAME + STATUS */}
                          <div className="scan-history-info">

                            <strong>
                              {item.name}
                            </strong>

                            <span>
                              {item.status ===
                              'success'
                                ? 'Check-in berhasil'
                                : item.status ===
                                    'already_checked_in'
                                  ? 'Sudah pernah check-in'
                                  : item.message ||
                                    'QR tidak valid'}
                            </span>

                          </div>


                          {/* TIME */}
                          <time>
                            {item.time}
                          </time>

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

            </aside>

          </div>
        )}


        {/* BOTTOM CONTROLS */}
        <div className="scanner-bottom-actions">
          <StaffLogoutButton />
        </div>

      </div>


      {/* HELP MODAL */}
      {showHelp && (
        <div
          className="scanner-help-backdrop"
          onClick={() =>
            setShowHelp(false)
          }
        >

          <div
            className="scanner-help-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="scanner-help-close"
              onClick={() =>
                setShowHelp(false)
              }
              aria-label="Tutup panduan"
            >
              ×
            </button>


            <span>
              Panduan Scanner
            </span>

            <h2>
              Cara melakukan check-in
            </h2>


            <ol>

              <li>
                <strong>1.</strong>{' '}
                Klik{' '}
                <strong>
                  Buka Kamera
                </strong>.
              </li>

              <li>
                <strong>2.</strong>{' '}
                Izinkan browser
                menggunakan kamera.
              </li>

              <li>
                <strong>3.</strong>{' '}
                Arahkan QR Code jamaah
                ke area scanner.
              </li>

              <li>
                <strong>4.</strong>{' '}
                Tunggu hingga hasil
                check-in muncul.
              </li>

              <li>
                <strong>5.</strong>{' '}
                Jika kamera bermasalah,
                gunakan tombol{' '}
                <strong>
                  Pilih Gambar QR
                </strong>.
              </li>

            </ol>

          </div>

        </div>
      )}

    </main>
  );
}