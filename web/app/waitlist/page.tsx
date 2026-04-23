import type { Metadata } from 'next'
import Link from 'next/link'
import WaitlistForm from '@/components/WaitlistForm'

export const metadata: Metadata = {
  title: 'Join the Waitlist — CNNCTD',
  description:
    'Join the CNNCTD waitlist for early access. Founders and investors only.',
}

export default function WaitlistPage() {
  return (
    <main className="min-h-screen bg-bg-base text-white">
      <header className="px-6 py-5 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-white/70 hover:text-white transition-colors text-sm no-underline inline-flex items-center gap-2"
          >
            ← Back to CNNCTD
          </Link>
        </div>
      </header>
      <WaitlistForm />
    </main>
  )
}
