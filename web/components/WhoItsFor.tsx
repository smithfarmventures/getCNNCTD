'use client'

import { useEffect, useRef, useState } from 'react'

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el) } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2.5 6h7M6 2.5L9.5 6 6 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function WhoItsFor() {
  const eyebrow = useReveal()
  const head = useReveal()
  const body = useReveal()

  return (
    <section className="bg-cream py-[100px] px-6 md:px-12" id="investors">
      <div className="max-w-[1100px] mx-auto">
        <p
          ref={eyebrow.ref as React.RefObject<HTMLParagraphElement>}
          className={`reveal text-center text-[11px] font-medium tracking-[0.12em] uppercase text-green mb-4 ${eyebrow.visible ? 'visible' : ''}`}
        >
          Who it&apos;s for
        </p>
        <h2
          ref={head.ref as React.RefObject<HTMLHeadingElement>}
          className={`reveal font-serif font-normal leading-[1.1] tracking-[-0.02em] text-ink text-center mx-auto mb-4 ${head.visible ? 'visible' : ''}`}
          style={{ fontSize: 'clamp(32px, 4vw, 52px)', maxWidth: 640 }}
        >
          Two sides. <em className="italic text-green">One platform.</em>
        </h2>
        <p
          ref={body.ref as React.RefObject<HTMLParagraphElement>}
          className={`reveal text-[17px] font-light text-ink-soft text-center mx-auto leading-[1.7] ${body.visible ? 'visible' : ''}`}
          style={{ maxWidth: 520 }}
        >
          Whether you&apos;re writing checks or raising them, CNNCTD was built with you in mind from day one.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1100px] mx-auto mt-[60px]" id="founders">
        <WhoCard
          tag="For Investors"
          headline="Source the way you already live — on your phone."
          body="No more digging through spreadsheets, cold inbound decks, or legacy databases with six-month-old data. Your deal flow, finally mobile-native."
          points={[
            'Discover companies that match your exact thesis and check size',
            'Validated data — no stale metrics, no unverified claims',
            'Build your pipeline and track companies over time',
            'Connect only when there\'s mutual interest — no cold inbound',
          ]}
          cta="Join as an investor"
          delay={0}
        />
        <WhoCard
          tag="For Founders"
          headline="Stop sending cold emails into the void."
          body="Raise capital the way people actually make decisions — through genuine connection. Your story, your metrics, your vision — put in front of the right people."
          points={[
            'Match with investors actively looking for what you\'re building',
            'Skip the cold outreach — both sides opt in before connecting',
            'Present your company exactly how you want it seen',
            'AI-powered insights to sharpen your narrative as you grow',
          ]}
          cta="Join as a founder"
          delay={0.15}
        />
      </div>
    </section>
  )
}

function WhoCard({
  tag, headline, body, points, cta, delay
}: {
  tag: string; headline: string; body: string; points: string[]; cta: string; delay: number
}) {
  const { ref, visible } = useReveal()

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`card-reveal bg-white rounded-[24px] border border-ink/10 p-10 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.07)] transition-all duration-300 ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="inline-block text-[10px] font-semibold uppercase tracking-[0.1em] text-green bg-green/[0.08] px-3 py-[5px] rounded-full mb-6">
        {tag}
      </div>
      <h3 className="font-serif font-normal text-[28px] leading-[1.2] tracking-[-0.02em] text-ink mb-4">
        {headline}
      </h3>
      <p className="text-[15px] font-light text-ink-soft leading-[1.7] mb-7">{body}</p>
      <ul className="flex flex-col gap-[10px] list-none p-0">
        {points.map((pt, i) => (
          <li key={i} className="flex items-start gap-[10px] text-[14px] text-ink-soft leading-[1.5]">
            <div className="w-[6px] h-[6px] bg-green rounded-full flex-shrink-0 mt-[7px]" />
            {pt}
          </li>
        ))}
      </ul>
      <a
        href="#join"
        className="inline-flex items-center gap-[6px] mt-7 text-[14px] font-medium text-green no-underline hover:gap-[10px] transition-all duration-200"
      >
        {cta} <ArrowIcon />
      </a>
    </div>
  )
}
