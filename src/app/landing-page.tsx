'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

const EVENT_DATE = new Date('2026-09-23T13:00:00+07:00');

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function HomePage() {
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = EVENT_DATE.getTime();
      const distance = Math.max(target - now, 0);

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance / (1000 * 60 * 60)) % 24
        ),
        minutes: Math.floor(
          (distance / (1000 * 60)) % 60
        ),
        seconds: Math.floor(
          (distance / 1000) % 60
        ),
      });
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.page}>

      {/* =========================
    NAVBAR
========================= */}
<header className={styles.navbar}>
  <a href="#" className={styles.brand}>
    <span className={styles.brandLogo}>
      <img
        src="/image/logo-mtmhabd.png"
        alt="MT MHABD"
      />
    </span>
  </a>

  <nav className={styles.navLinks}>
    <a href="#tentang">Tentang</a>
    <a href="#penceramah">Penceramah</a>
    <a href="#detail">Detail</a>
    <a href="#lokasi">Lokasi</a>
  </nav>

  <a
    href="/register"
    className={`${styles.button} ${styles.buttonSmall}`}
  >
    Daftar Sekarang
  </a>
</header>


{/* =========================
    HERO
========================= */}
<section className={styles.hero}>

  <div className={styles.heroDecoration}>

  {/* LARGE ORBITS */}
  <div className={`${styles.heroOrbit} ${styles.heroOrbitOne}`} />
  <div className={`${styles.heroOrbit} ${styles.heroOrbitTwo}`} />

  {/* CRESCENT */}
  <div className={styles.heroCrescent}>
    <div className={styles.crescentInner} />
  </div>

  {/* STARS */}
  <div className={`${styles.heroStar} ${styles.heroStarOne}`}>
    ✦
  </div>

  <div className={`${styles.heroStar} ${styles.heroStarTwo}`}>
    ✦
  </div>

  {/* LANTERNS */}
  <div className={`${styles.heroLantern} ${styles.heroLanternLarge}`}>
    <div className={styles.lanternTop} />
    <div className={styles.lanternBody}>
      <span />
      <span />
    </div>
    <div className={styles.lanternBottom} />
  </div>

  <div className={`${styles.heroLantern} ${styles.heroLanternSmall}`}>
    <div className={styles.lanternTop} />
    <div className={styles.lanternBody}>
      <span />
      <span />
    </div>
    <div className={styles.lanternBottom} />
  </div>

</div>


  <div className={styles.heroInner}>

    {/* =========================
        HERO COPY
    ========================= */}
    <div className={styles.heroCopy}>

      <div className={styles.eyebrow}>
        <span className={styles.eyebrowLine} />
        Pengajian Akbar 2026
      </div>

      <h1 className={styles.heroTitle}>
        Meneladani
        <br />
        Rasulullah <span>SAW</span>
        <br />
        <em>Hijrah Menuju Istiqomah</em>
      </h1>

      <p className={styles.heroDescription}>
        Dalam rangka memperingati Maulid Nabi Muhammad SAW,
        mari bersama-sama memperluas dakwah, mempererat
        ukhuwah Islamiyah, dan menumbuhkan kepedulian sosial
        di tengah masyarakat.
      </p>

      <div className={styles.heroActions}>

        <a
          href="/register"
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          Daftar Sekarang
        </a>

        <a
          href="#detail"
          className={`${styles.button} ${styles.buttonGhost}`}
        >
          Lihat Detail
        </a>

      </div>


      {/* =========================
          EVENT INFO
      ========================= */}
      <div className={styles.heroMeta}>

        <div className={styles.metaItem}>
          <small>TANGGAL</small>
          <strong>23 September 2026</strong>
        </div>

        <div className={styles.metaDivider} />

        <div className={styles.metaItem}>
          <small>WAKTU</small>
          <strong>13.00 – 17.45 WIB</strong>
        </div>

        <div className={styles.metaDivider} />

        <div className={styles.metaItem}>
          <small>TEMPAT</small>
          <strong>Masjid PUSDAI Jawa Barat</strong>
        </div>

      </div>

    </div>


    {/* =========================
        HERO VISUAL
    ========================= */}
    <div className={styles.heroVisual}>

      <div className={styles.archGlow} />

      <div className={styles.archFrame}>

        <img
          src="/image/KHbuya-yahya.png"
          alt="KH. Buya Yahya"
          className={styles.heroSpeakerImage}
        />

        <div className={styles.archOverlay} />

        <div className={styles.heroSpeakerBadge}>
          <span>PENCERAMAH UTAMA</span>
          <strong>KH. Buya Yahya</strong>
        </div>

      </div>

      <div className={styles.speakerCaption}>
        <span>Meneladani Rasulullah SAW</span>
        <strong>Hijrah Menuju Istiqomah</strong>
      </div>

    </div>

  </div>


  {/* Scroll */}
  <div className={styles.scrollHint}>
    <span>Scroll untuk mengenal lebih dekat</span>
    <div />
  </div>

</section>


{/* =========================
    COUNTDOWN
========================= */}
<section className={styles.countdownSection} id="detail">

  <div className={styles.countdownContainer}>

    <div className={styles.countdownHeading}>
      <span>MENJELANG HARI H</span>
      <h2>Acara Dimulai Dalam</h2>
      <p>
        Jangan lewatkan kesempatan untuk hadir
        dan bersilaturahmi dalam Pengajian Akbar MT MHABD.
      </p>
    </div>


    <div className={styles.countdownCard}>

      <div className={styles.countdownItem}>
        <strong>
          {String(countdown.days).padStart(2, '0')}
        </strong>
        <span>Hari</span>
      </div>

      <i>:</i>

      <div className={styles.countdownItem}>
        <strong>
          {String(countdown.hours).padStart(2, '0')}
        </strong>
        <span>Jam</span>
      </div>

      <i>:</i>

      <div className={styles.countdownItem}>
        <strong>
          {String(countdown.minutes).padStart(2, '0')}
        </strong>
        <span>Menit</span>
      </div>

      <i>:</i>

      <div className={styles.countdownItem}>
        <strong>
          {String(countdown.seconds).padStart(2, '0')}
        </strong>
        <span>Detik</span>
      </div>

    </div>

  </div>

</section>


      {/* =========================
          INTRO / TENTANG
      ========================= */}
      <section
        id="tentang"
        className={`${styles.section} ${styles.aboutSection}`}
      >
        <div className={styles.sectionShell}>

          <div className={styles.sectionHeading}>
            <span className={styles.sectionEyebrow}>
              Tentang Acara
            </span>

            <h2>
              Sebuah majelis untuk
              <br />
              <em>kembali menguatkan hati.</em>
            </h2>

            <p>
              Maulid Nabi menjadi momentum untuk kembali
              mengingat keteladanan Rasulullah SAW dan
              menjadikannya sebagai inspirasi dalam menjalani
              kehidupan bersama keluarga dan masyarakat.
            </p>
          </div>


          <div className={styles.valueGrid}>

            <article className={styles.valueCard}>
              <div className={styles.cardNumber}>01</div>
              <div className={styles.cardIcon}>♡</div>

              <h3>Cinta Rasul</h3>

              <p>
                Menumbuhkan kembali kecintaan kepada
                Rasulullah SAW melalui majelis ilmu dan
                penghayatan terhadap keteladanan beliau.
              </p>
            </article>


            <article
              className={`${styles.valueCard} ${styles.valueCardMint}`}
            >
              <div className={styles.cardNumber}>02</div>
              <div className={styles.cardIcon}>⌁</div>

              <h3>Hijrah & Istiqomah</h3>

              <p>
                Menjadikan hijrah sebagai perjalanan untuk
                terus memperbaiki diri dan menjaga langkah
                agar tetap istiqomah.
              </p>
            </article>


            <article
              className={`${styles.valueCard} ${styles.valueCardGreen}`}
            >
              <div className={styles.cardNumber}>03</div>
              <div className={styles.cardIcon}>✦</div>

              <h3>Keluarga & Ukhuwah</h3>

              <p>
                Mempererat ukhuwah Islamiyah dan membangun
                kepedulian di tengah keluarga serta
                masyarakat.
              </p>
            </article>

          </div>

        </div>
      </section>


      {/* =========================
          QUOTE / TRANSITION
      ========================= */}
      <section className={styles.quoteSection}>
        <div className={styles.quotePattern} />

        <div className={styles.quoteInner}>
          <span>بِسْمِ اللَّهِ</span>

          <div className={styles.quoteLine} />

          <p>
            “Meneladani Rasulullah SAW,
            melangkah dalam hijrah,
            dan menjaga hati untuk tetap istiqomah.”
          </p>

          <small>
            PENGAJIAN AKBAR MT MHABD · 2026
          </small>
        </div>
      </section>


      {/* =========================
          PENCERAMAH
      ========================= */}
      <section
        id="penceramah"
        className={`${styles.section} ${styles.speakerSection}`}
      >
        <div className={styles.sectionShell}>

          <div className={styles.speakerGrid}>

            <div className={styles.speakerImageWrap}>
              <div className={styles.speakerImageFrame}>
                <img
                  src="/image/KHbuya-yahya.png"
                  alt="KH. Buya Yahya"
                />
              </div>

              <div className={styles.imageCaption}>
                <span>Penceramah Utama</span>
                <strong>KH. Buya Yahya</strong>
              </div>

              <div className={styles.imageDecoration}>✦</div>
            </div>


            <div className={styles.speakerCopy}>

              <span className={styles.sectionEyebrow}>
                Penceramah Utama
              </span>

              <h2>
                KH. Buya
                <br />
                <em>Yahya.</em>
              </h2>

              <div className={styles.goldDivider}>
                <span>✦</span>
              </div>

              <p>
                Hadir bersama dalam majelis ilmu dan
                tausiyah untuk menyambut peringatan
                Maulid Nabi Muhammad SAW dengan tema
                <strong>
                  {' '}
                  “Hijrah Menuju Istiqomah, Menguatkan
                  Keluarga dan Ukhuwah.”
                </strong>
              </p>

              <div className={styles.speakerPoints}>
                <div>
                  <span>✓</span>
                  <p>Majelis ilmu dan tausiyah</p>
                </div>

                <div>
                  <span>✓</span>
                  <p>Momentum memperkuat ukhuwah</p>
                </div>

                <div>
                  <span>✓</span>
                  <p>Refleksi dan penguatan diri</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================
          DETAIL ACARA
      ========================= */}
      <section
        id="detail"
        className={`${styles.section} ${styles.detailSection}`}
      >
        <div className={styles.sectionShell}>

          <div className={styles.centerHeading}>
            <span className={styles.sectionEyebrow}>
              Catat Waktunya
            </span>

            <h2>
              Jangan sampai
              <br />
              <em>terlewat.</em>
            </h2>
          </div>


          <div className={styles.detailGrid}>

            <article className={styles.detailCard}>
              <span className={styles.detailIcon}>◷</span>
              <small>TANGGAL</small>
              <h3>Rabu</h3>
              <strong>23 September 2026</strong>
              <p>Peringatan Maulid Nabi Muhammad SAW</p>
            </article>


            <article className={styles.detailCard}>
              <span className={styles.detailIcon}>◌</span>
              <small>WAKTU</small>
              <h3>13.00 – 17.45</h3>
              <strong>WIB</strong>
              <p>Ba'da Dzuhur</p>
            </article>


            <article className={styles.detailCard}>
              <span className={styles.detailIcon}>⌖</span>
              <small>TEMPAT</small>
              <h3>Masjid PUSDAI</h3>
              <strong>Jawa Barat</strong>
              <p>
                Jl. Diponegoro No. 63, Bandung
              </p>
            </article>

          </div>


          <div className={styles.freeNotice}>
            <div className={styles.freeSymbol}>✦</div>

            <div>
              <span>KEHADIRAN</span>
              <h3>Terbuka untuk jamaah</h3>
              <p>
                Daftarkan kehadiranmu terlebih dahulu
                untuk mendapatkan e-ticket.
              </p>
            </div>

            <a
              href="/register"
              className={`${styles.button} ${styles.buttonWhite}`}
            >
              Daftar Sekarang
              <span>→</span>
            </a>
          </div>

        </div>
      </section>


      {/* =========================
          LOKASI
      ========================= */}
      <section
        id="lokasi"
        className={`${styles.section} ${styles.locationSection}`}
      >
        <div className={styles.sectionShell}>

          <div className={styles.locationGrid}>

            <div className={styles.locationCopy}>
              <span className={styles.sectionEyebrow}>
                Lokasi
              </span>

              <h2>
                Sampai jumpa
                <br />
                di <em>PUSDAI.</em>
              </h2>

              <p>
                Mari hadir dan menjadi bagian dari
                majelis ilmu yang insyaAllah membawa
                keberkahan dan mempererat silaturahmi.
              </p>

              <div className={styles.address}>
                <div className={styles.addressIcon}>⌖</div>

                <div>
                  <strong>
                    Masjid PUSDAI Jawa Barat
                  </strong>

                  <span>
                    Jl. Diponegoro No. 63,
                    Citarum, Kec. Bandung Wetan,
                    Kota Bandung
                  </span>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Masjid+PUSDAI+Jawa+Barat+Jl.+Diponegoro+No.+63+Bandung"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapsLink}
              >
                Buka di Google Maps
                <span>↗</span>
              </a>
            </div>


            <div className={styles.locationVisual}>
              <div className={styles.locationArch}>
                <div className={styles.locationArchContent}>
                  <span>MT MHABD</span>
                  <strong>PUSDAI</strong>
                  <small>JAWA BARAT</small>
                </div>
              </div>

              <div className={styles.locationOrbOne} />
              <div className={styles.locationOrbTwo} />
            </div>

          </div>

        </div>
      </section>


      {/* =========================
          FINAL CTA
      ========================= */}
      <section className={styles.finalCta}>

        <div className={styles.ctaPattern} />

        <div className={styles.ctaContent}>

          <span className={styles.ctaArabic}>
            بِسْمِ اللَّهِ
          </span>

          <span className={styles.sectionEyebrowLight}>
            Pengajian Akbar MT MHABD
          </span>

          <h2>
            Mari melangkah
            <br />
            menuju <em>istiqomah.</em>
          </h2>

          <p>
            Hadir, belajar, bersilaturahmi,
            dan menguatkan hati bersama.
          </p>

          <a
            href="/register"
            className={`${styles.button} ${styles.buttonGold}`}
          >
            Daftar Sekarang
            <span>→</span>
          </a>

        </div>

      </section>


      {/* =========================
          FOOTER
      ========================= */}
      <footer className={styles.footer}>

        <div className={styles.footerBrand}>
          <img
            src="/image/logo-mtmhabd.png"
            alt="MT MHABD"
          />

          <p>
            Menebarkan cahaya Islam melalui majelis
            ilmu, silaturahmi, dan ukhuwah.
          </p>
        </div>

        <div className={styles.footerLinks}>
          <a href="#tentang">Tentang</a>
          <a href="#penceramah">Penceramah</a>
          <a href="#detail">Detail Acara</a>
          <a href="#lokasi">Lokasi</a>
        </div>

        <div className={styles.footerRight}>
          <span>© 2026 MT MHABD</span>
          <span>Barokah dalam silaturahmi.</span>
        </div>

      </footer>

    </main>
  );
}