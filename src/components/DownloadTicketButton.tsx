'use client';

import { useState } from 'react';
import { toPng } from 'html-to-image';

export default function DownloadTicketButton() {
  const [downloading, setDownloading] =
    useState(false);


  /* =========================================
     WAIT UNTIL ALL IMAGES ARE READY
  ========================================= */

  const waitForImages = async (
    element: HTMLElement
  ) => {
    const images = Array.from(
      element.querySelectorAll('img')
    );

    await Promise.all(
      images.map(async (image) => {
        if (
          image.complete &&
          image.naturalWidth > 0
        ) {
          return;
        }

        try {
          await image.decode();
        } catch {
          await new Promise<void>(
            (resolve) => {
              image.onload = () =>
                resolve();

              image.onerror = () =>
                resolve();
            }
          );
        }
      })
    );
  };


  /* =========================================
     CONVERT IMAGE TO DATA URL
     supaya logo ikut saat capture
  ========================================= */

  const imageToDataUrl = async (
    src: string
  ) => {
    const response =
      await fetch(src, {
        cache: 'force-cache',
      });

    if (!response.ok) {
      throw new Error(
        `Gagal memuat image: ${src}`
      );
    }

    const blob =
      await response.blob();

    return await new Promise<string>(
      (resolve, reject) => {
        const reader =
          new FileReader();

        reader.onloadend = () => {
          if (
            typeof reader.result ===
            'string'
          ) {
            resolve(reader.result);
          } else {
            reject(
              new Error(
                'Gagal mengubah image.'
              )
            );
          }
        };

        reader.onerror = () => {
          reject(
            new Error(
              'Gagal membaca image.'
            )
          );
        };

        reader.readAsDataURL(blob);
      }
    );
  };


  /* =========================================
     EMBED ALL IMG
  ========================================= */

  const embedImages = async (
    element: HTMLElement
  ) => {
    const images = Array.from(
      element.querySelectorAll(
        'img'
      )
    );

    const originals =
      new Map<
        HTMLImageElement,
        string
      >();

    await Promise.all(
      images.map(
        async (image) => {
          const originalSrc =
            image.getAttribute(
              'src'
            );

          if (!originalSrc) {
            return;
          }

          originals.set(
            image,
            originalSrc
          );

          /*
            Kalau sudah data:image,
            tidak perlu diubah lagi.
          */
          if (
            originalSrc.startsWith(
              'data:'
            )
          ) {
            return;
          }

          try {
            const dataUrl =
              await imageToDataUrl(
                originalSrc
              );

            image.src =
              dataUrl;

            try {
              await image.decode();
            } catch {
              // browser tertentu
              // tetap bisa lanjut
            }
          } catch (error) {
            console.warn(
              'Image embed failed:',
              originalSrc,
              error
            );
          }
        }
      )
    );

    /*
      fungsi untuk mengembalikan
      src asli setelah capture
    */
    return () => {
      originals.forEach(
        (
          originalSrc,
          image
        ) => {
          image.src =
            originalSrc;
        }
      );
    };
  };


  /* =========================================
     DOWNLOAD
  ========================================= */

  const handleDownload =
    async () => {
      if (downloading) return;

      const ticket =
        document.getElementById(
          'downloadable-ticket'
        );

      if (!ticket) return;

      let restoreImages:
        | (() => void)
        | null = null;

      try {
        setDownloading(true);


        /*
          Tunggu semua custom font
        */
        await document.fonts.ready;


        /*
          Tunggu semua image
          termasuk logo TactLink
        */
        await waitForImages(
          ticket
        );


        /*
          Ubah semua img sementara
          menjadi data URL
        */
        restoreImages =
          await embedImages(
            ticket
          );


        /*
          Tunggu lagi setelah
          src gambar berubah
        */
        await waitForImages(
          ticket
        );


        /*
          Browser perlu sedikit waktu
          untuk menyelesaikan layout.
        */
        await new Promise<void>(
          (resolve) => {
            requestAnimationFrame(
              () => {
                requestAnimationFrame(
                  () => {
                    resolve();
                  }
                );
              }
            );
          }
        );


        /*
          tambahan delay kecil agar
          image benar-benar ter-render
        */
        await new Promise<void>(
          (resolve) => {
            setTimeout(
              resolve,
              120
            );
          }
        );


        const rect =
          ticket.getBoundingClientRect();


        const dataUrl =
          await toPng(
            ticket,
            {
              /*
                Jangan request ulang
                image saat capture.
              */
              cacheBust: false,

              pixelRatio: 2,

              backgroundColor:
                '#fffefa',

              width:
                Math.ceil(
                  rect.width
                ),

              height:
                Math.ceil(
                  ticket.scrollHeight
                ),

              style: {
                margin: '0',
                transform: 'none',
              },
            }
          );


        const link =
          document.createElement(
            'a'
          );

        link.download =
          'e-ticket-pengajian-akbar-mt-mhabd.png';

        link.href =
          dataUrl;

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

      } catch (error) {
        console.error(
          'Download ticket failed:',
          error
        );
      } finally {

        /*
          Kembalikan src logo/image
          ke kondisi semula.
        */
        if (restoreImages) {
          restoreImages();
        }

        setDownloading(false);
      }
    };


  return (
    <button
      type="button"
      onClick={
        handleDownload
      }
      disabled={
        downloading
      }
    >
      {downloading
        ? 'Menyiapkan Tiket...'
        : 'Download Tiket'}
    </button>
  );
}