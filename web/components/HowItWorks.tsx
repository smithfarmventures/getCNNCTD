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

const steps = [
  {
    title: 'Join and build your profile',
    desc: 'Investors detail their thesis, check size, and stage focus. Founders share their company, metrics, and what they\'re looking for. Clean, verified, real.',
  },
  {
    title: 'Meet the right people',
    desc: 'Our matching surfaces opportunities that actually fit — no scrolling through irrelevant feeds, no mass outreach, no noise.',
  },
  {
    title: 'Get CNNCTD',
    desc: 'When both sides signal interest, you\'re connected. Chat, schedule, take it wherever it goes. We open the door — the rest is up to you.',
  },
]

export default function HowItWorks() {
  const eyebrowReveal = useReveal()
  const headReveal = useReveal()
  const bodyReveal = useReveal()

  return (
    <section className="bg-white py-[100px] px-12 md:px-12" id="how">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center max-w-[1100px] mx-auto">
        {/* Left: content */}
        <div>
          <p
            ref={eyebrowReveal.ref as React.RefObject<HTMLParagraphElement>}
            className={`reveal text-[11px] font-medium tracking-[0.12em] uppercase text-green mb-4 ${eyebrowReveal.visible ? 'visible' : ''}`}
          >
            How it works
          </p>
          <h2
            ref={headReveal.ref as React.RefObject<HTMLHeadingElement>}
            className={`reveal font-serif font-normal leading-[1.1] tracking-[-0.02em] text-ink max-w-[640px] mb-5 ${headReveal.visible ? 'visible' : ''}`}
            style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
          >
            Built for the way <em className="italic text-green">relationships</em> actually form.
          </h2>
          <p
            ref={bodyReveal.ref as React.RefObject<HTMLParagraphElement>}
            className={`reveal text-[17px] font-light text-ink-soft leading-[1.7] max-w-[520px] ${bodyReveal.visible ? 'visible' : ''}`}
          >
            Venture has always been a relationship business. We just built the infrastructure to support it — on your phone, in your pocket, wherever you are.
          </p>

          {/* Steps */}
          <div className="mt-12 flex flex-col">
            {steps.map((step, i) => (
              <StepRow key={i} num={i + 1} title={step.title} desc={step.desc} delay={i * 0.12} />
            ))}
          </div>
        </div>

        {/* Right: floating cards visual */}
        <div className="relative hidden md:flex items-center justify-center" style={{ height: 480 }}>
          {/* Card A */}
          <div
            className="absolute bg-white rounded-[20px] border border-ink/10 p-5"
            style={{
              width: 200,
              top: 40,
              left: 20,
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
              animation: 'floatA 4s ease-in-out infinite',
              animationDelay: '0s',
            }}
          >
            <div className="w-9 h-9 rounded-[10px] bg-green/[0.08] flex items-center justify-center text-[12px] font-semibold text-green mb-[10px]">NV</div>
            <div className="text-[13px] font-medium text-ink mb-[3px]">Northbridge Ventures</div>
            <div className="text-[11px] text-ink-mute mb-[10px]">Series A · Vertical SaaS</div>
            <div className="flex gap-2">
              <div className="bg-cream rounded-lg px-2 py-[5px]"><div className="text-[8px] text-ink-mute uppercase tracking-[.05em]">Check</div><div className="text-[11px] font-semibold text-ink">$3–8M</div></div>
              <div className="bg-cream rounded-lg px-2 py-[5px]"><div className="text-[8px] text-ink-mute uppercase tracking-[.05em]">Stage</div><div className="text-[11px] font-semibold text-ink">A–B</div></div>
            </div>
          </div>

          {/* Card B — center featured */}
          <div
            className="absolute bg-white rounded-[20px] border border-ink/10 p-5 z-10"
            style={{
              width: 220,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -55%)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.1)',
              animation: 'floatA 4s ease-in-out infinite',
              animationDelay: '1.2s',
            }}
          >
            <div className="inline-flex items-center gap-1 bg-green/[0.08] text-green text-[9px] font-semibold px-2 py-[3px] rounded-full mb-2">
              <div className="w-1 h-1 bg-green rounded-full" />
              94% match
            </div>
            <div className="w-9 h-9 rounded-[10px] bg-ink flex items-center justify-center text-[14px] font-semibold text-white mb-[10px]">T</div>
            <div className="text-[13px] font-medium text-ink mb-[3px]">Tideline</div>
            <div className="text-[11px] text-ink-mute mb-[10px]">Climate fintech · Series A</div>
            <div className="flex gap-2 mb-[10px]">
              <div className="bg-cream rounded-lg px-2 py-[5px]"><div className="text-[8px] text-ink-mute uppercase tracking-[.05em]">Stage</div><div className="text-[11px] font-semibold text-ink">Series A</div></div>
              <div className="bg-cream rounded-lg px-2 py-[5px]"><div className="text-[8px] text-ink-mute uppercase tracking-[.05em]">Raise</div><div className="text-[11px] font-semibold text-ink">$8M</div></div>
            </div>
            <button className="w-full h-[30px] bg-green rounded-lg text-white text-[11px] font-medium">Get CNNCTD →</button>
          </div>

          {/* Card C */}
          <div
            className="absolute bg-white rounded-[20px] border border-ink/10 p-5"
            style={{
              width: 190,
              bottom: 60,
              right: 10,
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
              animation: 'floatA 4s ease-in-out infinite',
              animationDelay: '2.2s',
            }}
          >
            <div className="text-[11px] font-semibold text-ink mb-2">You&apos;ve been CNNCTD</div>
            <div className="flex gap-2 items-center mb-[10px]">
              <div className="w-7 h-7 rounded-full bg-green/[0.1] flex items-center justify-center text-[9px] font-semibold text-green">NV</div>
              <div className="w-7 h-7 rounded-full bg-ink -ml-2 flex items-center justify-center text-[10px] font-semibold text-white">T</div>
              <span className="text-[11px] text-ink-mute flex-1">Northbridge × Tideline</span>
            </div>
            <div className="grid grid-cols-2 gap-[6px]">
              <div className="h-[26px] rounded-lg bg-[#f0f0ee] flex items-center justify-center text-[10px] text-ink-mute font-medium">Chat</div>
              <div className="h-[26px] rounded-lg bg-green flex items-center justify-center text-[10px] text-white font-medium">Schedule</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StepRow({ num, title, desc, delay }: { num: number; title: string; desc: string; delay: number }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`step-reveal flex gap-5 items-start py-6 border-b border-ink/10 last:border-b-0 ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="w-8 h-8 rounded-full bg-green/[0.08] text-green text-[12px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
        {num}
      </div>
      <div>
        <div className="text-[15px] font-medium text-ink mb-[6px]">{title}</div>
        <div className="text-[14px] font-light text-ink-soft leading-[1.6]">{desc}</div>
      </div>
    </div>
  )
}
