import type { Metadata } from 'next'
import { Instrument_Serif, DM_Sans } from 'next/font/google'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CNNCTD — The Social Venture Ecosystem',
  description:
    'The mobile-first platform where founders meet investors the right way — through intelligent matching, not cold emails into the void.',
  keywords: ['venture capital', 'startup', 'founder', 'investor', 'fundraising', 'deal flow', 'matching'],
  openGraph: {
    title: 'CNNCTD — The Social Venture Ecosystem',
    description: 'The way great deals get done has changed.',
    type: 'website',
    siteName: 'CNNCTD',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CNNCTD — The Social Venture Ecosystem',
    description: 'The way great deals get done has changed.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${dmSans.variable}`}>
      <body className="bg-cream text-ink antialiased">
        {children}
      </body>
    </html>
  )
}
