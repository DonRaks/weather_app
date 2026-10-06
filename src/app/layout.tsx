import type { Metadata, Viewport } from 'next';
import './globals.css';
import { WeatherProvider } from '../context/WeatherContext';

export const metadata: Metadata = {
  title: 'Aura Weather — Atmospheric Intelligence',
  description:
    'Aura Weather — A next-generation, portfolio-grade meteorology and atmospheric intelligence web application with live radar, interactive charts, and dynamic atmospheric simulation.',
  manifest: '/manifest.json',
  icons: {
    icon: '/clear.png',
    apple: '/clear.png'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Aura Weather'
  }
};

export const viewport: Viewport = {
  themeColor: '#080c16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" data-weather="clear-day">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <WeatherProvider>{children}</WeatherProvider>
      </body>
    </html>
  );
}
