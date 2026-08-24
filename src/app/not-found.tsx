import Link from 'next/link';

export default function NotFound() {
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


          <div className="staff-login-top-intro">

            <h2 className="staff-login-top-kicker">
              Pengajian Akbar MT MHABD
            </h2>

            <p>
              Halaman yang Anda cari tidak tersedia.
            </p>

          </div>



          <section className="staff-login-card">


            <div className="staff-login-icon">

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
                  strokeWidth="1.8"
                />

                <path
                  d="M12 8v5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                <circle
                  cx="12"
                  cy="16.5"
                  r="1"
                  fill="currentColor"
                />

              </svg>

            </div>



            <div className="staff-login-heading">

              <h1>
                404
              </h1>


              <p>
                Maaf, halaman yang Anda buka
                tidak ditemukan. Silakan kembali
                atau lakukan registrasi Pengajian Akbar.
              </p>

            </div>



            <div className="notfound-actions">


              <Link
                href="/register"
                className="notfound-primary"
              >
                Daftar Pengajian Sekarang
              </Link>



              

            </div>


          </section>


        </div>

      </div>


    </main>
  );
}