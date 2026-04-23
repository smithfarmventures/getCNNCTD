'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

type Role = 'founder' | 'investor' | ''

function WaitlistFormInner() {
  const searchParams = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (roleParam === 'founder' || roleParam === 'investor') {
      setRole(roleParam)
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !role) {
      setError('Please fill in all required fields and select your role.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, company }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || 'Something went wrong. Please try again.')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {/* Checkmark */}
        <div className="w-20 h-20 rounded-full bg-success/10 border-2 border-success flex items-center justify-center mb-6">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <path d="M8 18l7 7 13-13" stroke="#00C48C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
          You&apos;re CNNCTD!
        </h3>
        <p className="text-text-secondary text-lg max-w-md">
          We&apos;ll be in touch soon with early access details. Stay CNNCTD with the first wave.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-lg mx-auto">
      {/* Name */}
      <div className="mb-5">
        <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
          Full Name <span className="text-danger">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Smith"
          required
          className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-secondary/40 focus:outline-none focus:border-brand-light focus:ring-1 focus:ring-brand-light transition-colors duration-200 text-base"
        />
      </div>

      {/* Email */}
      <div className="mb-5">
        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
          Email Address <span className="text-danger">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@company.com"
          required
          className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-secondary/40 focus:outline-none focus:border-brand-light focus:ring-1 focus:ring-brand-light transition-colors duration-200 text-base"
        />
      </div>

      {/* Role toggle */}
      <div className="mb-5">
        <span className="block text-sm font-medium text-text-secondary mb-2">
          I am a&hellip; <span className="text-danger">*</span>
        </span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setRole('founder')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 border ${
              role === 'founder'
                ? 'bg-brand-mid border-brand-mid text-white shadow-lg shadow-brand-mid/20'
                : 'bg-transparent border-white/15 text-text-secondary hover:border-brand-light/50 hover:text-white'
            }`}
          >
            Founder
          </button>
          <button
            type="button"
            onClick={() => setRole('investor')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 border ${
              role === 'investor'
                ? 'bg-brand-mid border-brand-mid text-white shadow-lg shadow-brand-mid/20'
                : 'bg-transparent border-white/15 text-text-secondary hover:border-brand-light/50 hover:text-white'
            }`}
          >
            Investor
          </button>
        </div>
      </div>

      {/* Company */}
      <div className="mb-7">
        <label htmlFor="company" className="block text-sm font-medium text-text-secondary mb-2">
          Company / Fund{' '}
          <span className="text-text-secondary/50 font-normal">(optional)</span>
        </label>
        <input
          id="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Acme Ventures"
          className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-secondary/40 focus:outline-none focus:border-brand-light focus:ring-1 focus:ring-brand-light transition-colors duration-200 text-base"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-8 rounded-xl bg-brand-mid text-white font-bold text-base tracking-wide hover:bg-brand-light transition-all duration-200 shadow-lg hover:shadow-brand-mid/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-mid flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
              <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Getting you CNNCTD&hellip;
          </>
        ) : (
          'Get CNNCTD'
        )}
      </button>

      <p className="mt-4 text-center text-text-secondary/50 text-xs">
        No spam. Early access only. Unsubscribe any time.
      </p>
    </form>
  )
}

export default function WaitlistForm() {
  return (
    <section id="waitlist" className="bg-bg-surface py-24 px-6 border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-success text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full border border-success/30 bg-success/5">
            Early Access
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Be First.{' '}
            <span className="text-gradient-brand">Get CNNCTD.</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Join the waitlist for early access. We&apos;re launching to a select group of founders and investors first.
          </p>
        </div>

        <Suspense fallback={
          <div className="w-full max-w-lg mx-auto flex justify-center py-12">
            <svg className="animate-spin w-8 h-8 text-brand-light" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        }>
          <WaitlistFormInner />
        </Suspense>
      </div>
    </section>
  )
}
