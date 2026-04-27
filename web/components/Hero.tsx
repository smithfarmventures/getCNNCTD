import Image from 'next/image'

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-[120px] pb-20 relative overflow-hidden">
      {/* Background orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 500, height: 500, background: 'rgba(26,122,94,0.07)', filter: 'blur(80px)', top: -100, right: -100 }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 400, height: 400, background: 'rgba(26,122,94,0.05)', filter: 'blur(80px)', bottom: -80, left: -80 }}
      />

      {/* Eyebrow */}
      <div className="animate-fade-up-1 inline-flex items-center gap-2 bg-white border border-ink/10 px-[14px] py-[6px] rounded-full text-[11px] font-medium tracking-[0.1em] uppercase text-green mb-8">
        <div className="w-[6px] h-[6px] bg-green rounded-full" />
        The Social Venture Ecosystem
      </div>

      {/* Headline */}
      <h1
        className="animate-fade-up-2 font-serif text-ink font-normal leading-[1.05] tracking-[-0.02em] max-w-[820px] mb-7"
        style={{ fontSize: 'clamp(48px, 7vw, 86px)' }}
      >
        The way great deals<br />get done has{' '}
        <em className="italic text-green">changed.</em>
      </h1>

      {/* Subheadline */}
      <p
        className="animate-fade-up-3 font-light text-ink-soft max-w-[520px] leading-[1.65] mb-10"
        style={{ fontSize: 'clamp(16px, 2vw, 20px)' }}
      >
        CNNCTD is the mobile-first platform where founders meet investors the right way — through intelligent matching, not cold emails into the void.
      </p>

      {/* Slogan / brand mark */}
      <div className="animate-fade-up-3 flex items-center justify-center gap-4 mb-12">
        <span className="h-px w-10 md:w-14 bg-green/40" />
        <div className="flex items-baseline gap-[6px]">
          <span className="text-[10px] md:text-[11px] font-medium tracking-[0.22em] uppercase text-ink-mute">get</span>
          <em className="font-serif italic font-normal text-green leading-none" style={{ fontSize: 'clamp(18px, 2.2vw, 22px)' }}>CNNCTD</em>
          <span className="text-ink-mute/40 leading-none text-[18px] mx-1">,</span>
          <span className="text-[10px] md:text-[11px] font-medium tracking-[0.22em] uppercase text-ink-mute">stay</span>
          <em className="font-serif italic font-normal text-green leading-none" style={{ fontSize: 'clamp(18px, 2.2vw, 22px)' }}>CNNCTD</em>
          <span className="font-serif italic text-green leading-none" style={{ fontSize: 'clamp(18px, 2.2vw, 22px)' }}>.</span>
        </div>
        <span className="h-px w-10 md:w-14 bg-green/40" />
      </div>

      {/* CTAs */}
      <div className="animate-fade-up-4 flex gap-3 flex-wrap justify-center">
        <a
          href="#join"
          className="bg-ink text-white px-8 py-[14px] rounded-full text-[14px] font-medium tracking-[0.01em] hover:bg-green hover:-translate-y-0.5 transition-all duration-200 no-underline inline-flex items-center gap-2 group"
        >
          Get CNNCTD
          <svg className="transition-transform duration-200 group-hover:translate-x-[3px]" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <a
          href="#how"
          className="bg-transparent text-ink px-8 py-[14px] rounded-full text-[14px] font-normal border border-ink/10 hover:bg-white hover:border-ink/20 hover:-translate-y-px transition-all duration-200 no-underline inline-flex items-center gap-2"
        >
          See how it works
        </a>
      </div>

      {/* Phone mockups */}
      <div className="animate-fade-up-5 mt-[72px] relative w-full max-w-[900px]" style={{ height: 460 }}>
        {/* Left phone */}
        <PhoneLeft />
        {/* Center phone */}
        <PhoneCenter />
        {/* Right phone */}
        <PhoneRight />
      </div>
    </section>
  )
}

function PhoneShell({ style, children }: { style: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div style={{
      position: 'absolute',
      background: '#111318',
      borderRadius: 40,
      padding: 10,
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.04)',
      ...style,
    }}>
      <div style={{ width: 60, height: 16, background: '#111318', borderRadius: 20, margin: '0 auto 6px' }} />
      <div style={{ background: '#f7f5f0', borderRadius: 32, width: '100%', height: 'calc(100% - 22px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}

function PSBar() {
  return (
    <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Image
        src="/cnnctd_logo.png"
        alt="CNNCTD"
        width={56}
        height={14}
        style={{ objectFit: 'contain', height: 14, width: 'auto' }}
      />
    </div>
  )
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#f7f5f0', borderRadius: 10, padding: '8px 10px' }}>
      <div style={{ fontSize: 8, color: '#7a8480', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#0c0f0e', marginTop: 2 }}>{value}</div>
    </div>
  )
}

function MatchBadge({ pct }: { pct: string }) {
  return (
    <div style={{ background: 'rgba(26,122,94,0.1)', color: '#1a7a5e', fontSize: 9, fontWeight: 600, padding: '3px 8px', borderRadius: 20 }}>
      {pct} match
    </div>
  )
}

function PhoneLeft() {
  return (
    <PhoneShell style={{ width: 200, height: 400, left: '50%', marginLeft: -260, top: 40, zIndex: 2, transform: 'rotate(-6deg)', opacity: 0.85 }}>
      <PSBar />
      <div style={{ padding: '0 10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'white', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 6 }}>
              <Image src="/broadlight_grey.jpeg" alt="Broadlight Capital" width={40} height={40} style={{ objectFit: 'contain', maxHeight: 40, width: 'auto' }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0c0f0e' }}>Broadlight Capital</div>
            <div style={{ fontSize: 9, color: '#7a8480', textAlign: 'center', lineHeight: 1.4 }}>Seed–Series A · B2B SaaS</div>
            <MatchBadge pct="92%" />
          </div>
          <div style={{ padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <StatPill label="Check" value="$1–3M" />
            <StatPill label="Focus" value="SaaS" />
          </div>
        </div>
      </div>
    </PhoneShell>
  )
}

function PhoneCenter() {
  return (
    <PhoneShell style={{ width: 220, height: 440, left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
      <PSBar />
      <div style={{ padding: '0 10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'white', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            {/* Sightful logo */}
            <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 6 }}>
              <Image src="/sightful_grey.jpeg" alt="Sightful" width={40} height={40} style={{ objectFit: 'contain', maxHeight: 40, width: 'auto' }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0c0f0e' }}>Sightful</div>
            <div style={{ fontSize: 9, color: '#7a8480', textAlign: 'center', lineHeight: 1.4 }}>AR workspace · Spatial computing</div>
            <MatchBadge pct="94%" />
          </div>
          <div style={{ padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <StatPill label="Stage" value="Series A" />
            <StatPill label="Raise" value="$12M" />
            <StatPill label="Industry" value="AR / SaaS" />
            <StatPill label="Product" value="$899" />
          </div>
          <div style={{ padding: '0 12px 12px', display: 'flex', gap: 6 }}>
            <button style={{ flex: 1, height: 32, borderRadius: 10, background: '#f0f0ee', border: 'none', fontSize: 10, color: '#7a8480', fontWeight: 500, cursor: 'pointer' }}>Pass</button>
            <button style={{ flex: 2, height: 32, borderRadius: 10, background: '#1a7a5e', border: 'none', fontSize: 10, color: 'white', fontWeight: 500, cursor: 'pointer' }}>Get CNNCTD →</button>
          </div>
        </div>
      </div>
    </PhoneShell>
  )
}

function PhoneRight() {
  return (
    <PhoneShell style={{ width: 200, height: 400, left: '50%', marginLeft: 60, top: 40, zIndex: 2, transform: 'rotate(6deg)', opacity: 0.85 }}>
      <PSBar />
      <div style={{ padding: 12, flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(0,0,0,.06)', padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, padding: 4 }}>
            <Image src="/baselane_grey.jpeg" alt="Baselane" width={26} height={26} style={{ objectFit: 'contain', maxHeight: 26, width: 'auto' }} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0c0f0e' }}>Corner × Baselane</div>
            <div style={{ fontSize: 10, color: '#7a8480' }}>You&apos;ve been CNNCTD</div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(0,0,0,.06)', padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, padding: 4 }}>
            <Image src="/sightful_grey.jpeg" alt="Sightful" width={26} height={26} style={{ objectFit: 'contain', maxHeight: 26, width: 'auto' }} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0c0f0e' }}>Corner × Sightful</div>
            <div style={{ fontSize: 10, color: '#7a8480' }}>Schedule a call</div>
          </div>
        </div>
        <div style={{ background: 'rgba(26,122,94,.08)', borderRadius: 16, padding: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1a7a5e' }}>3</div>
          <div style={{ fontSize: 10, color: '#1a7a5e', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '.08em' }}>New connections</div>
        </div>
      </div>
    </PhoneShell>
  )
}
