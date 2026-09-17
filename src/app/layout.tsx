import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import AuthProvider from '@/components/auth/AuthProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'SPOVIBE — Your Sound. Your Vibe.',
  description: 'SPOVIBE is a premium music discovery and streaming platform. Discover personalized music across Tamil, English, Hindi, Malayalam, Telugu, and more.',
  keywords: ['music', 'streaming', 'discovery', 'Tamil music', 'Hindi songs', 'SPOVIBE'],
  openGraph: {
    title: 'SPOVIBE — Your Sound. Your Vibe.',
    description: 'Premium music discovery and streaming platform.',
    type: 'website',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
