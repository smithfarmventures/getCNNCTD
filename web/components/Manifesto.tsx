'use client'

import { useEffect, useRef, useState } from 'react'

export default function Manifesto() {
  const ref = useRef<HTMLParagraphElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="text-white text-center py-[120px] px-12" style={{ backgroundColor: '#0c0f0e' }}>
      <p
        ref={ref}
        className={`manifesto-reveal font-serif font-normal leading-[1.2] tracking-[-0.02em] mx-auto mb-8 ${visible ? 'visible' : ''}`}
        style={{ fontSize: 'clamp(28px, 4vw, 54px)', maxWidth: 860 }}
      >
        No transactions. No fees. No gatekeepers.<br />
        Just the <em className="italic" style={{ color: '#5dcaa5' }}>right people</em> finding each other.
      </p>
      <p className="text-[16px] font-light max-w-[480px] mx-auto mb-14 leading-[1.7]" style={{ color: 'rgba(255,255,255,0.5)' }}>
        CNNCTD is purely a sourcing and connection platform. We don&apos;t touch money, we don&apos;t facilitate deals. We just make sure you never miss the right one.
      </p>
      <a
        href="#join"
        className="bg-white text-ink px-8 py-[14px] rounded-full text-[14px] font-medium tracking-[0.01em] no-underline inline-flex items-center gap-2 hover:bg-cream transition-all duration-200 group"
      >
        Get early access
        <svg className="transition-transform duration-200 group-hover:translate-x-[3px]" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  )
}
