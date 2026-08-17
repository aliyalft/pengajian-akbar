'use client';

import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

type Html5QrScannerProps = {
  onScanSuccess: (
    decodedText: string
  ) => void;
};

export default function Html5QrScanner({
  onScanSuccess,
}: Html5QrScannerProps) {
  const scannerRef =
    useRef<any>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [cameraActive, setCameraActive] =
    useState(false);

  const [cameraError, setCameraError] =
    useState<string | null>(null);

  const [starting, setStarting] =
    useState(false);

  const [stopping, setStopping] =
    useState(false);

  const lastScanRef = useRef<{
    value: string;
    time: number;
  } | null>(null);

  const handleDecoded = (
    decodedText: string
  ) => {
    const now = Date.now();

    if (
      lastScanRef.current &&
      lastScanRef.current.value ===
        decodedText &&
      now -
        lastScanRef.current.time <
        3000
    ) {
      return;
    }

    lastScanRef.current = {
      value: decodedText,
      time: now,
    };

    onScanSuccess(decodedText);
  };

  const startCamera = async () => {
    if (
      starting ||
      stopping ||
      cameraActive
    ) {
      return;
    }

    setStarting(true);
    setCameraError(null);

    try {
      const {
        Html5Qrcode,
      } = await import(
        'html5-qrcode'
      );

      if (!scannerRef.current) {
        scannerRef.current =
          new Html5Qrcode(
            'staff-qr-reader'
          );
      }

      await scannerRef.current.start(
        {
          facingMode: 'environment',
        },
        {
          fps: 10,
          qrbox: (
            width: number,
            height: number
          ) => {
            const size =
              Math.floor(
                Math.min(
                  width,
                  height
                ) * 0.7
              );

            return {
              width: size,
              height: size,
            };
          },
        },
        handleDecoded,
        () => {}
      );

      setCameraActive(true);
    } catch (error) {
      console.error(
        'Camera scanner error:',
        error
      );

      setCameraActive(false);

      setCameraError(
        'Kamera tidak dapat digunakan. Izinkan akses kamera lalu coba kembali.'
      );
    } finally {
      setStarting(false);
    }
  };

  const stopCamera = async () => {
    if (
      !scannerRef.current ||
      !cameraActive ||
      stopping
    ) {
      return;
    }

    setStopping(true);
    setCameraError(null);

    try {
      await scannerRef.current.stop();

      try {
        scannerRef.current.clear();
      } catch (clearError) {
        console.warn(
          'Clear camera scanner error:',
          clearError
        );
      }

      scannerRef.current = null;

      setCameraActive(false);
    } catch (error) {
      console.error(
        'Stop camera error:',
        error
      );

      setCameraError(
        'Kamera tidak dapat dimatikan. Silakan coba kembali.'
      );
    } finally {
      setStopping(false);
    }
  };

  const toggleCamera = async () => {
    if (cameraActive) {
      await stopCamera();
      return;
    }

    await startCamera();
  };

  const handleFile = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setCameraError(null);

    try {
      const {
        Html5Qrcode,
      } = await import(
        'html5-qrcode'
      );

      const fileScanner =
        new Html5Qrcode(
          'staff-file-reader'
        );

      const decodedText =
        await fileScanner.scanFile(
          file,
          true
        );

      handleDecoded(decodedText);

      try {
        fileScanner.clear();
      } catch (clearError) {
        console.warn(
          'Clear file scanner error:',
          clearError
        );
      }
    } catch (error) {
      console.error(
        'File QR error:',
        error
      );

      setCameraError(
        'QR Code pada gambar tidak dapat dibaca.'
      );
    } finally {
      event.target.value = '';
    }
  };

  useEffect(() => {
    return () => {
      const scanner =
        scannerRef.current;

      if (!scanner) return;

      scanner
        .stop()
        .catch(() => {})
        .finally(() => {
          try {
            scanner.clear();
          } catch {}
        });
    };
  }, []);

  return (
    <div className="qr-scanner-component">

      {/* SCAN AREA */}
      <div className="qr-scan-stage">

        <div
          id="staff-qr-reader"
          className="qr-camera-reader"
        />

        {!cameraActive && (
          <div className="qr-scan-placeholder">
            <div className="qr-scan-corners">
              <i />
              <i />
              <i />
              <i />
            </div>

            <div className="qr-placeholder-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 8V5.5C4 4.67 4.67 4 5.5 4H8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                <path
                  d="M16 4H18.5C19.33 4 20 4.67 20 5.5V8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                <path
                  d="M20 16V18.5C20 19.33 19.33 20 18.5 20H16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                <path
                  d="M8 20H5.5C4.67 20 4 19.33 4 18.5V16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <strong>
              Menunggu QR Code
            </strong>

            <p>
              Aktifkan kamera atau pilih
              gambar QR Code jamaah.
            </p>
          </div>
        )}

      </div>


      {/* BUTTONS OUTSIDE */}
      <div className="qr-scanner-actions">

        <button
          type="button"
          className={`qr-camera-button ${
            cameraActive
              ? 'is-active'
              : ''
          }`}
          onClick={toggleCamera}
          disabled={
            starting || stopping
          }
        >
          {cameraActive
            ? stopping
              ? 'Mematikan Kamera...'
              : 'Matikan Kamera'
            : starting
              ? 'Membuka Kamera...'
              : 'Buka Kamera'}
        </button>

        <button
          type="button"
          className="qr-file-button"
          onClick={() =>
            fileInputRef.current?.click()
          }
        >
          Pilih Gambar QR
        </button>

      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFile}
      />

      <div
        id="staff-file-reader"
        style={{
          display: 'none',
        }}
      />

      {cameraError && (
        <p className="qr-scanner-error">
          {cameraError}
        </p>
      )}

      <p className="qr-scanner-hint">
        Posisikan QR Code di dalam area
        scanner.
      </p>

    </div>
  );
}