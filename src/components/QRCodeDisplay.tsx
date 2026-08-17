'use client';

import QRCode from 'react-qr-code';

export default function QRCodeDisplay({
  value,
}: {
  value: string;
}) {
  return (
    <div>
      <QRCode
        value={value}
        size={210}
        bgColor="#FFFFFF"
        fgColor="#000000"
        level="M"
      />
    </div>
  );
}