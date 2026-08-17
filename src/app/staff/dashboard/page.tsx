'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';
import * as XLSX from 'xlsx';

type DashboardStats = {
  total: number;
  checkedIn: number;
};

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
  created_at: string;
};

type GenderFilter =
  | 'all'
  | 'Ikhwan'
  | 'Akhwat';

type StatusFilter =
  | 'all'
  | 'checked_in'
  | 'not_checked_in';

export default function StaffDashboardPage() {
  const [stats, setStats] =
    useState<DashboardStats>({
      total: 0,
      checkedIn: 0,
    });

  const [registrations, setRegistrations] =
    useState<Registration[]>([]);

  const [loadingStats, setLoadingStats] =
    useState(true);

  const [
    loadingRegistrations,
    setLoadingRegistrations,
  ] = useState(true);

  const [
    registrationError,
    setRegistrationError,
  ] = useState<string | null>(null);

  const [search, setSearch] =
    useState('');

  const [genderFilter, setGenderFilter] =
    useState<GenderFilter>('all');

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('all');

  const [deletingId, setDeletingId] =
    useState<string | null>(null);


  /* =========================================
     LOAD STATS
  ========================================= */

  const loadStats = useCallback(async () => {
    try {
      setLoadingStats(true);

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
        total: data.total,
        checkedIn: data.checkedIn,
      });
    } catch (error) {
      console.error(
        'Dashboard stats error:',
        error
      );
    } finally {
      setLoadingStats(false);
    }
  }, []);


  /* =========================================
     LOAD REGISTRATIONS
  ========================================= */

  const loadRegistrations =
    useCallback(async () => {
      try {
        setLoadingRegistrations(true);
        setRegistrationError(null);

        const response = await fetch(
          '/api/admin/registrations',
          {
            cache: 'no-store',
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              'Gagal memuat data jamaah.'
          );
        }

        setRegistrations(
          data.registrations ?? []
        );
      } catch (error) {
        console.error(
          'Dashboard registrations error:',
          error
        );

        setRegistrationError(
          error instanceof Error
            ? error.message
            : 'Gagal memuat data jamaah.'
        );
      } finally {
        setLoadingRegistrations(false);
      }
    }, []);


  useEffect(() => {
    loadStats();
    loadRegistrations();
  }, [
    loadStats,
    loadRegistrations,
  ]);


  /* =========================================
     FILTER DATA
  ========================================= */

  const filteredRegistrations =
    useMemo(() => {
      const keyword =
        search.trim().toLowerCase();

      return registrations.filter(
        (registration) => {
          const matchesSearch =
            keyword.length === 0 ||
            registration.full_name
              .toLowerCase()
              .includes(keyword) ||
            registration.email
              .toLowerCase()
              .includes(keyword) ||
            registration.phone_number
              .toLowerCase()
              .includes(keyword) ||
            registration.city
              .toLowerCase()
              .includes(keyword) ||
            (
              registration.institution ??
              ''
            )
              .toLowerCase()
              .includes(keyword);

          const matchesGender =
            genderFilter === 'all' ||
            registration.gender ===
              genderFilter;

          const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter ===
              'checked_in' &&
              registration.checked_in) ||
            (statusFilter ===
              'not_checked_in' &&
              !registration.checked_in);

          return (
            matchesSearch &&
            matchesGender &&
            matchesStatus
          );
        }
      );
    }, [
      registrations,
      search,
      genderFilter,
      statusFilter,
    ]);


  /* =========================================
     DELETE
  ========================================= */

  const handleDelete = async (
    registration: Registration
  ) => {
    const confirmed =
      window.confirm(
        `Hapus data "${registration.full_name}"?\n\nData yang sudah dihapus tidak dapat dikembalikan.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(registration.id);

      const response = await fetch(
        '/api/admin/registrations',
        {
          method: 'DELETE',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            id: registration.id,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Gagal menghapus peserta.'
        );
      }

      setRegistrations(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              registration.id
          )
      );

      await loadStats();
    } catch (error) {
      console.error(
        'Delete registration error:',
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : 'Gagal menghapus peserta.'
      );
    } finally {
      setDeletingId(null);
    }
  };


  /* =========================================
     EXPORT XLSX
  ========================================= */

  const handleExportExcel = () => {
    if (
      filteredRegistrations.length === 0
    ) {
      return;
    }

    const exportData =
      filteredRegistrations.map(
        (registration, index) => ({
          No: index + 1,

          Nama:
            registration.full_name,

          'Jenis Kelamin':
            registration.gender,

          'No. Telepon':
            registration.phone_number,

          Email:
            registration.email,

          Domisili:
            registration.city,

          'Instansi / Komunitas':
            registration.institution ||
            '-',

          'Status Check-in':
            registration.checked_in
              ? 'Sudah Check-in'
              : 'Belum Check-in',

          'Waktu Check-in':
            registration.checked_in_at
              ? new Date(
                  registration.checked_in_at
                ).toLocaleString(
                  'id-ID'
                )
              : '-',

          'Tanggal Registrasi':
            new Date(
              registration.created_at
            ).toLocaleString(
              'id-ID'
            ),
        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        exportData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Data Jamaah'
    );

    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 28 },
      { wch: 16 },
      { wch: 20 },
      { wch: 32 },
      { wch: 22 },
      { wch: 30 },
      { wch: 18 },
      { wch: 24 },
      { wch: 24 },
    ];

    XLSX.writeFile(
      workbook,
      'data-jamaah-pengajian-akbar-mt-mhabd.xlsx'
    );
  };


  /* =========================================
     RESET FILTER
  ========================================= */

  const resetFilters = () => {
    setSearch('');
    setGenderFilter('all');
    setStatusFilter('all');
  };


  const remaining = Math.max(
    stats.total - stats.checkedIn,
    0
  );

  const totalIkhwan = registrations.filter(
    (registration) => registration.gender === 'Ikhwan'
  ).length;

  const totalAkhwat = registrations.filter(
    (registration) => registration.gender === 'Akhwat'
  ).length;

  const checkInRate =
    stats.total > 0
      ? Math.round(
          (stats.checkedIn / stats.total) * 100
        )
      : 0;


  return (
    <main className="admin-dashboard-page">
      <div className="admin-dashboard-shell">

        {/* TOP BAR */}
        <header className="admin-dashboard-topbar">

          <div>
            <span className="admin-dashboard-kicker">
              Admin Panel
            </span>

            <h1>
              Pengajian Akbar MT MHABD
            </h1>
          </div>


          <div className="admin-dashboard-top-actions">

            <Link
              href="/staff/scanner"
              className="admin-dashboard-scanner-link"
            >
              Buka Scanner QR
            </Link>

            <Link
              href="/"
              className="admin-dashboard-site-link"
            >
              Kembali ke Website
            </Link>

          </div>

        </header>


        {/* PAGE HEADING */}
        <section className="admin-dashboard-heading">

          <h2>
            Dashboard Kehadiran
          </h2>

          <p>
            Pantau data registrasi jamaah
            dan status check-in acara.
          </p>

        </section>


        {/* STATS */}
        <section className="admin-dashboard-stats">

          <div className="admin-dashboard-stat">

            <span>
              Total Pendaftar
            </span>

            <strong>
              {loadingStats
                ? '—'
                : stats.total}
            </strong>

          </div>


          <div className="admin-dashboard-stat admin-dashboard-stat-primary">

            <span>
              Sudah Check-in
            </span>

            <strong>
              {loadingStats
                ? '—'
                : stats.checkedIn}
            </strong>

          </div>


          <div className="admin-dashboard-stat">

            <span>
              Belum Check-in
            </span>

            <strong>
              {loadingStats
                ? '—'
                : remaining}
            </strong>

          </div>


          <div className="admin-dashboard-stat">

            <span>
              Ikhwan
            </span>

            <strong>
              {loadingRegistrations
                ? '—'
                : totalIkhwan}
            </strong>

          </div>


          <div className="admin-dashboard-stat">

            <span>
              Akhwat
            </span>

            <strong>
              {loadingRegistrations
                ? '—'
                : totalAkhwat}
            </strong>

          </div>


          <div className="admin-dashboard-stat admin-dashboard-stat-rate">

            <span>
              Check-in Rate
            </span>

            <strong>
              {loadingStats
                ? '—'
                : `${checkInRate}%`}
            </strong>

          </div>

        </section>


        {/* DATA CARD */}
        <section className="admin-dashboard-table-card">

          {/* TABLE HEADER */}
          <div className="admin-dashboard-table-head">

            <div>
              <h3>
                Data Jamaah
              </h3>

              <p>
                Daftar peserta yang sudah
                melakukan registrasi.
              </p>
            </div>


            <button
              type="button"
              className="admin-dashboard-export"
              onClick={
                handleExportExcel
              }
              disabled={
                loadingRegistrations ||
                filteredRegistrations
                  .length === 0
              }
            >
              Export ke Excel
            </button>

          </div>


          {/* FILTERS */}
          <div className="admin-dashboard-filters">

            <div className="admin-dashboard-search">

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Cari nama, email, telepon, domisili..."
              />

            </div>


            <select
              value={genderFilter}
              onChange={(event) =>
                setGenderFilter(
                  event.target
                    .value as GenderFilter
                )
              }
              className="admin-dashboard-filter-select"
            >
              <option value="all">
                Semua Gender
              </option>

              <option value="Ikhwan">
                Ikhwan
              </option>

              <option value="Akhwat">
                Akhwat
              </option>
            </select>


            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as StatusFilter
                )
              }
              className="admin-dashboard-filter-select"
            >
              <option value="all">
                Semua Status
              </option>

              <option value="checked_in">
                Sudah Check-in
              </option>

              <option value="not_checked_in">
                Belum Check-in
              </option>
            </select>


            <button
              type="button"
              className="admin-dashboard-reset-filter"
              onClick={resetFilters}
            >
              Reset
            </button>

          </div>


          {/* RESULT INFO */}
          {!loadingRegistrations &&
            !registrationError && (
              <div className="admin-dashboard-result-info">

                Menampilkan{' '}
                <strong>
                  {
                    filteredRegistrations.length
                  }
                </strong>{' '}
                dari{' '}
                <strong>
                  {registrations.length}
                </strong>{' '}
                peserta

              </div>
            )}


          {/* TABLE */}
          {loadingRegistrations ? (

            <div className="admin-dashboard-empty">
              Memuat data jamaah...
            </div>

          ) : registrationError ? (

            <div className="admin-dashboard-empty">
              {registrationError}
            </div>

          ) : registrations.length === 0 ? (

            <div className="admin-dashboard-empty">
              Belum ada data pendaftaran.
            </div>

          ) : filteredRegistrations.length ===
            0 ? (

            <div className="admin-dashboard-empty">
              Tidak ada peserta yang
              sesuai dengan pencarian atau
              filter.
            </div>

          ) : (

            <div className="admin-dashboard-table-wrap">

              <table className="admin-dashboard-table">

                <thead>
                  <tr>
                    <th>No.</th>

                    <th>
                      Nama Jamaah
                    </th>

                    <th>
                      Jenis Kelamin
                    </th>

                    <th>
                      No. Telepon
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Domisili
                    </th>

                    <th>
                      Instansi / Komunitas
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Waktu Check-in
                    </th>

                    <th>
                      Aksi
                    </th>
                  </tr>
                </thead>


                <tbody>

                  {filteredRegistrations.map(
                    (
                      registration,
                      index
                    ) => (

                      <tr
                        key={
                          registration.id
                        }
                      >

                        <td>
                          {index + 1}
                        </td>


                        <td>
                          <strong className="admin-dashboard-name">
                            {
                              registration.full_name
                            }
                          </strong>
                        </td>


                        <td>
                          {
                            registration.gender
                          }
                        </td>


                        <td>
                          {
                            registration.phone_number
                          }
                        </td>


                        <td>
                          {
                            registration.email
                          }
                        </td>


                        <td>
                          {
                            registration.city
                          }
                        </td>


                        <td>
                          {
                            registration.institution ||
                            '—'
                          }
                        </td>


                        <td>
                          <span
                            className={
                              registration.checked_in
                                ? 'admin-dashboard-status admin-dashboard-status-success'
                                : 'admin-dashboard-status admin-dashboard-status-pending'
                            }
                          >
                            {
                              registration.checked_in
                                ? 'Sudah Check-in'
                                : 'Belum Check-in'
                            }
                          </span>
                        </td>


                        <td>
                          {registration.checked_in_at
                            ? new Date(
                                registration.checked_in_at
                              ).toLocaleString(
                                'id-ID',
                                {
                                  dateStyle:
                                    'short',
                                  timeStyle:
                                    'short',
                                }
                              )
                            : '—'}
                        </td>


                        <td>
                          <button
                            type="button"
                            className="admin-dashboard-delete"
                            disabled={
                              deletingId ===
                              registration.id
                            }
                            onClick={() =>
                              handleDelete(
                                registration
                              )
                            }
                          >
                            {deletingId ===
                            registration.id
                              ? 'Menghapus...'
                              : 'Hapus'}
                          </button>
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>
    </main>
  );
}