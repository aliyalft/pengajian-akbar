import type { Metadata } from 'next';
import { Cormorant_Garamond, Noto_Sans } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
});

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mhabd.web.id'),

  title: 'Pengajian Akbar',
  description: 'Registrasi Pengajian Akbar MT MHABD 2026',

  authors: [
    {
      name: 'Aliyah Alfita Rossa',
    },
  ],

  creator: 'Aliyah Alfita Rossa',

  

  openGraph: {
    title: 'Pengajian Akbar MT MHABD 2026',
    description: 'Registrasi Pengajian Akbar MT MHABD 2026',
    url: 'https://mhabd.web.id',
    siteName: 'Pengajian Akbar MT MHABD 2026',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/image/poster.png',
        width: 1200,
        height: 630,
        alt: 'Pengajian Akbar MT MHABD 2026',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${cormorant.variable} ${notoSans.variable}`}>
        {children}
      </body>
    </html>
  );
}