'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import Html5QrScanner from '@/components/Html5QrScanner';
import StaffLogoutButton from '@/components/StaffLogoutButton';

type CheckinStatus =
  | 'success'
  | 'already_checked_in';

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

  ticket_type?: 'UMUM' | 'VIP';

  /*
   * Status check-in terakhir.
   *
   * Field ini akan digunakan setelah API/database
   * menyimpan status terakhir:
   *
   * success
   * already_checked_in
   */
  last_checkin_status?: CheckinStatus;
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
  ticketType?: 'UMUM' | 'VIP';
};

export default function ScannerPage() {
  // =========================================================
  // STATE
  // =========================================================

  const [result, setResult] =
    useState<ScanResult | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [checkingIn, setCheckingIn] =
    useState(false);

  /*
   * Mencegah kamera membaca QR yang sama
   * berkali-kali dalam waktu sangat singkat.
   */
  const [scanLocked, setScanLocked] =
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

  // =========================================================
  // LOAD STATS
  // =========================================================

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch(
        '/api/stats',
        {
          cache: 'no-store',
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Gagal memuat statistik.'
        );
      }

      setStats({
        checkedIn:
          data.checkedIn,
        total:
          data.total,
      });
    } catch (err) {
      console.error(
        'Load stats error:',
        err
      );
    }
  }, []);

  // =========================================================
  // LOAD HISTORY
  // =========================================================

  const loadHistory = useCallback(async () => {
  try {
    // =====================================================
    // LOAD DATA UMUM + VIP BERSAMAAN
    // =====================================================

    const [umumResponse, vipResponse] =
      await Promise.all([
        fetch(
          '/api/admin/registrations?type=umum',
          {
            cache: 'no-store',
          }
        ),

        fetch(
          '/api/admin/registrations?type=vip',
          {
            cache: 'no-store',
          }
        ),
      ]);

    const umumData =
      await umumResponse.json();

    const vipData =
      await vipResponse.json();

    if (!umumResponse.ok) {
      throw new Error(
        umumData.error ||
          'Gagal memuat data jamaah umum.'
      );
    }

    if (!vipResponse.ok) {
      throw new Error(
        vipData.error ||
          'Gagal memuat data jamaah VIP.'
      );
    }

    // =====================================================
    // DATA UMUM
    // =====================================================

    const umumRegistrations =
      (umumData.registrations ??
        []) as Registration[];

    // =====================================================
    // DATA VIP
    // =====================================================

    const vipRegistrations =
      (vipData.registrations ??
        []) as Registration[];

    // =====================================================
    // GABUNGKAN UMUM + VIP
    // =====================================================

    const allRegistrations: Registration[] =
      [
        ...umumRegistrations,
        ...vipRegistrations,
      ];

    // =====================================================
    // AMBIL YANG SUDAH CHECK-IN
    // =====================================================

    const checkedInHistory: ScanHistoryItem[] =
      allRegistrations
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

          /*
           * Setelah refresh, data dari database
           * dianggap sebagai aktivitas check-in berhasil.
           *
           * "already_checked_in" hanya muncul ketika
           * QR benar-benar discan ulang.
           */
          status: 'success',

          time:
            new Date(
              registration.checked_in_at as string
            ).toLocaleTimeString(
              'id-ID',
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            ),

          ticketType:
            registration.ticket_type ??
            (
              registration.id.startsWith(
                'VIP-'
              )
                ? 'VIP'
                : 'UMUM'
            ),
        }));

    setHistory(
      checkedInHistory
    );
  } catch (err) {
    console.error(
      'Load scan history error:',
      err
    );
  }
}, []);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadStats();
    loadHistory();
  }, [
    loadStats,
    loadHistory,
  ]);

  // =========================================================
  // SCAN SUCCESS
  // =========================================================

  const handleScanSuccess = async (
    decodedText: string
  ) => {
    /*
     * Kamera bisa membaca QR yang sama
     * beberapa kali.
     *
     * checkingIn:
     * mencegah request berjalan bersamaan.
     *
     * scanLocked:
     * memberi jeda setelah scan selesai
     * supaya hasil tidak langsung tertimpa.
     */
    if (
      checkingIn ||
      scanLocked
    ) {
      return;
    }

    setScanLocked(true);
    setCheckingIn(true);

    /*
     * Bersihkan hasil/error sebelumnya
     * sebelum memproses QR baru.
     */
    setError(null);
    setResult(null);

    try {
      // =====================================================
      // CHECK-IN REQUEST
      // =====================================================

      const response =
        await fetch(
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

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Check-in gagal.'
        );
      }

      const scanResult =
        data as ScanResult;

      // =====================================================
      // TAMPILKAN HASIL SCAN
      // =====================================================

      setResult(
        scanResult
      );

      // =====================================================
      // TAMBAHKAN HASIL KE HISTORY
      // =====================================================

      const historyItem: ScanHistoryItem =
        {
          id:
            crypto.randomUUID(),

          registrationId:
            scanResult
              .registration.id,

          name:
            scanResult
              .registration
              .full_name,

          /*
           * PENTING:
           *
           * Ambil status langsung dari response API.
           *
           * Jadi:
           *
           * success
           * →
           * Check-in berhasil
           *
           * already_checked_in
           * →
           * Sudah pernah check-in
           */
          status:
            scanResult.status,

          time:
            new Date()
              .toLocaleTimeString(
                'id-ID',
                {
                  hour:
                    '2-digit',

                  minute:
                    '2-digit',
                }
              ),

          ticketType:
            scanResult
              .registration
              .ticket_type,
        };

      setHistory(
        (current) => {
          /*
           * Hapus history lama untuk
           * registration yang sama.
           *
           * Dengan begitu orang yang sama
           * hanya punya satu entry terbaru.
           */
          const withoutSameRegistration =
            current.filter(
              (item) =>
                item.registrationId !==
                scanResult
                  .registration.id
            );

          return [
            historyItem,
            ...withoutSameRegistration,
          ].slice(0, 8);
        }
      );

      // =====================================================
      // UPDATE STATS
      // =====================================================

      /*
       * Stats hanya berubah ketika
       * benar-benar berhasil check-in
       * pertama kali.
       *
       * Kalau already_checked_in,
       * jumlah kehadiran tidak berubah.
       */
      if (
        scanResult.status ===
        'success'
      ) {
        await loadStats();
      }
    } catch (err) {
      // =====================================================
      // ERROR
      // =====================================================

      const message =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat check-in.';

      setError(
        message
      );

      const errorHistoryItem: ScanHistoryItem =
        {
          id:
            crypto.randomUUID(),

          name:
            'QR tidak valid',

          status:
            'error',

          message:
            message,

          time:
            new Date()
              .toLocaleTimeString(
                'id-ID',
                {
                  hour:
                    '2-digit',

                  minute:
                    '2-digit',
                }
              ),
        };

      setHistory(
        (current) => {
          return [
            errorHistoryItem,
            ...current,
          ].slice(0, 8);
        }
      );
    } finally {
      setCheckingIn(false);

      /*
       * Beri jeda 2,5 detik.
       *
       * Ini mencegah kamera langsung
       * memproses QR yang sama berulang kali.
       */
      window.setTimeout(
        () => {
          setScanLocked(false);
        },
        2500
      );
    }
  };

  // =========================================================
  // PROGRESS
  // =========================================================

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

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="scanner-page-v3">

      {/* ===================================================
          BACKGROUND PATTERN
      =================================================== */}

      <div
        className="scanner-page-v3-pattern"
        aria-hidden="true"
      />

      {/* ===================================================
          BACKGROUND DECORATION
      =================================================== */}

      <div
        className="scanner-page-decoration"
        aria-hidden="true"
      >

        {/* LEFT ORBIT */}
        <div
          className="
            scanner-page-orbit
            scanner-page-orbit-left
          "
        />

        {/* RIGHT ORBIT */}
        <div
          className="
            scanner-page-orbit
            scanner-page-orbit-right
          "
        />

        {/* LANTERN */}
        <svg
          className="scanner-page-lantern"
          viewBox="0 0 64 112"
        >
          <path
            d="
              M32 0v12
              M23 12h18
              M20 18h24
              M24 18l-8 16v42
              l16 21 16-21V34l-8-16
              M16 39h32
              M16 72h32
              M24 39v33
              M40 39v33
              M23 82h18
              M28 97v10h8V97
            "
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* CRESCENT */}
        <svg
          className="scanner-page-crescent"
          viewBox="0 0 100 100"
        >
          <path
            d="
              M65 15
              c-23 5-39 26-35 49
              4 24 27 40 51 34
              -18-5-31-22-31-42
              0-17 8-32 22-41
              -2 0-5 0-7 0Z
            "
            fill="currentColor"
          />
        </svg>

        {/* MOSQUE */}
        <div className="scanner-page-mosque">

          <span
            className="
              scanner-page-mosque-dome
            "
          />

          <span
            className="
              scanner-page-mosque-body
            "
          />

          <span
            className="
              scanner-page-mosque-minaret
            "
          />

        </div>

      </div>

      {/* ===================================================
          MAIN SHELL
      =================================================== */}

      <div className="scanner-v3-shell">

        {/* =================================================
            HELP BUTTON
        ================================================= */}

        <button
          type="button"
          className="
            scanner-help-button
            scanner-help-button-top
          "
          onClick={() =>
            setShowHelp(true)
          }
          aria-label="Bantuan scanner"
        >
          ?
        </button>

        {/* =================================================
            HEADER
        ================================================= */}

        <header
          className="
            scanner-v3-header
          "
        >

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

        {/* =================================================
            SCANNER CARD
        ================================================= */}

        <section
          className="
            scanner-v3-card
          "
        >

          {/* SCANNER HEADER */}

          <div
            className="
              scanner-v3-card-head
            "
          >

            <div>

              <span>
                Scan QR Jamaah
              </span>

              <h2>
                Arahkan QR Code ke kamera
              </h2>

            </div>

          </div>

          {/* =================================================
              ACTUAL QR SCANNER
          ================================================= */}

          <Html5QrScanner
            onScanSuccess={
              handleScanSuccess
            }
          />

          {/* =================================================
              PROCESSING
          ================================================= */}

          {checkingIn && (
            <div
              className="
                scanner-v3-processing
              "
            >
              Memproses check-in...
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div
              className="
                scanner-v3-feedback
                scanner-v3-feedback-error
              "
            >

              <div>

                <span
                  className="
                    scanner-v3-feedback-label
                  "
                >
                  Check-in Gagal
                </span>

                <strong>
                  QR Code tidak dapat diproses
                </strong>

              </div>

              <div
                className="
                  scanner-v3-feedback-data
                "
              >

                <span>
                  {error}
                </span>

              </div>

            </div>
          )}

          {/* =================================================
              RESULT
          ================================================= */}

          {result && (
            <div
              className={
                result.status ===
                'success'
                  ? `
                    scanner-v3-feedback
                    scanner-v3-feedback-success
                  `
                  : `
                    scanner-v3-feedback
                    scanner-v3-feedback-already
                  `
              }
            >

              {/* RESULT STATUS + NAME */}

              <div>

                <span
                  className="
                    scanner-v3-feedback-label
                  "
                >

                  {result.status ===
                  'success'
                    ? 'Check-in Berhasil'
                    : 'Sudah Pernah Check-in'}

                </span>

                <strong>
                  {
                    result
                      .registration
                      .full_name
                  }
                </strong>

              </div>

              {/* RESULT DATA */}

              <div
                className="
                  scanner-v3-feedback-data
                "
              >

                {/* TICKET TYPE */}

                <span>
                  Tiket:{' '}

                  {
                    result
                      .registration
                      .ticket_type ??
                    (
                      result
                        .registration
                        .id
                        .startsWith(
                          'VIP-'
                        )
                        ? 'VIP'
                        : 'UMUM'
                    )
                  }
                </span>

                {/* GENDER */}

                <span>
                  {
                    result
                      .registration
                      .gender
                  }
                </span>

                {/* CITY */}

                <span>
                  {
                    result
                      .registration
                      .city
                  }
                </span>

                {/* INSTITUTION */}

                {
                  result
                    .registration
                    .institution && (
                    <span>
                      {
                        result
                          .registration
                          .institution
                      }
                    </span>
                  )
                }

              </div>

            </div>
          )}

        </section>

        {/* =================================================
            ATTENDANCE
        ================================================= */}

        <section
          className="
            scanner-progress-card
          "
        >

          <div
            className="
              scanner-progress-top
            "
          >

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

            <div
              className="
                scanner-progress-percent
              "
            >
              {progress}%
            </div>

          </div>

          {/* PROGRESS BAR */}

          <div
            className="
              scanner-progress-track
            "
          >

            <div
              className="
                scanner-progress-fill
              "
              style={{
                width:
                  `${progress}%`,
              }}
            />

          </div>

        </section>

        {/* =================================================
            HISTORY TOGGLE
        ================================================= */}

        <section
          className={`
            scan-history-card
            ${
              historyOpen
                ? 'is-open'
                : ''
            }
          `}
        >

          <button
            type="button"
            className="
              scan-history-toggle
            "
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

            {/* ICON */}

            <span
              className="
                scan-history-toggle-icon
              "
            >

              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >

                <path
                  d="
                    M8 6h12
                    M8 12h12
                    M8 18h12
                  "
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

            {/* COPY */}

            <span
              className="
                scan-history-toggle-copy
              "
            >

              <strong>
                Riwayat Scan
              </strong>

              <small>
                Lihat hasil check-in terbaru
              </small>

            </span>

            {/* COUNT */}

            <span
              className="
                scan-history-count
              "
            >
              {currentHistory.length}
            </span>

            {/* CHEVRON */}

            <span
              className="
                scan-history-chevron
              "
              aria-hidden="true"
            >
              ›
            </span>

          </button>

        </section>

        {/* =================================================
            HISTORY SIDE DRAWER
        ================================================= */}

        {historyOpen && (
          <div
            className="
              scan-history-drawer-backdrop
            "
            onClick={() =>
              setHistoryOpen(false)
            }
          >

            <aside
              className="
                scan-history-drawer
              "
              onClick={(event) =>
                event.stopPropagation()
              }
              aria-label="Riwayat Scan"
            >

              {/* ===========================================
                  DRAWER HEADER
              =========================================== */}

              <div
                className="
                  scan-history-drawer-head
                "
              >

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

                {/* CLOSE */}

                <button
                  type="button"
                  className="
                    scan-history-drawer-close
                  "
                  onClick={() =>
                    setHistoryOpen(
                      false
                    )
                  }
                  aria-label="
                    Tutup riwayat scan
                  "
                >
                  ×
                </button>

              </div>

              {/* ===========================================
                  DRAWER BODY
              =========================================== */}

              <div
                className="
                  scan-history-drawer-body
                "
              >

                {/* EMPTY */}

                {currentHistory.length ===
                0 ? (

                  <div
                    className="
                      scan-history-empty
                    "
                  >
                    Belum ada aktivitas
                    scan pada sesi ini.
                  </div>

                ) : (

                  <div
                    className="
                      scan-history-list
                      scan-history-list-drawer
                    "
                  >

                    {currentHistory.map(
                      (item) => (

                        <div
                          className="
                            scan-history-item
                            scan-history-item-drawer
                          "
                          key={
                            item.id
                          }
                        >

                          {/* =================================
                              STATUS ICON
                          ================================= */}

                          <div
                            className={`
                              scan-history-status
                              scan-history-status-${item.status}
                            `}
                          >

                            {item.status ===
                            'error' ? (

                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                              >

                                <path
                                  d="
                                    M8 8L16 16
                                    M16 8L8 16
                                  "
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
                                  d="
                                    M7.5 12.5
                                    L10.4 15.4
                                    L16.8 9
                                  "
                                  stroke="currentColor"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />

                              </svg>

                            )}

                          </div>

                          {/* =================================
                              NAME + STATUS
                          ================================= */}

                          <div
                            className="
                              scan-history-info
                            "
                          >

                            <strong>
                              {item.name}
                            </strong>

                            <span>

                              {item.ticketType
                                ? `Tiket ${item.ticketType} · `
                                : ''}

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

                          {/* =================================
                              TIME
                          ================================= */}

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

        {/* =================================================
            BOTTOM CONTROLS
        ================================================= */}

        <div
          className="
            scanner-bottom-actions
          "
        >

          <StaffLogoutButton />

        </div>

      </div>

      {/* ===================================================
          HELP MODAL
      =================================================== */}

      {showHelp && (
        <div
          className="
            scanner-help-backdrop
          "
          onClick={() =>
            setShowHelp(false)
          }
        >

          <div
            className="
              scanner-help-modal
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              type="button"
              className="
                scanner-help-close
              "
              onClick={() =>
                setShowHelp(false)
              }
              aria-label="
                Tutup panduan
              "
            >
              ×
            </button>

            {/* TITLE */}

            <span>
              Panduan Scanner
            </span>

            <h2>
              Cara melakukan check-in
            </h2>

            {/* STEPS */}

            <ol>

              <li>
                <strong>
                  1.
                </strong>{' '}
                Klik{' '}
                <strong>
                  Buka Kamera
                </strong>.
              </li>

              <li>
                <strong>
                  2.
                </strong>{' '}
                Izinkan browser
                menggunakan kamera.
              </li>

              <li>
                <strong>
                  3.
                </strong>{' '}
                Arahkan QR Code jamaah
                ke area scanner.
              </li>

              <li>
                <strong>
                  4.
                </strong>{' '}
                Tunggu hingga hasil
                check-in muncul.
              </li>

              <li>
                <strong>
                  5.
                </strong>{' '}
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