import Image from 'next/image'

const logos = [
  { src: '/sightful_grey.jpeg',     alt: 'Sightful',            w: 130 },
  { src: '/corner_grey.jpeg',       alt: 'Corner Capital',      w: 130 },
  { src: '/kanso_grey.jpeg',        alt: 'Kanso',               w: 130 },
  { src: '/third_wall_grey.jpeg',   alt: 'Third Wall',          w: 130 },
  { src: '/baselane_grey.jpeg',     alt: 'Baselane',            w: 130 },
  { src: '/nucleus_grey.jpeg',      alt: 'The Nucleus Network', w: 150 },
  { src: '/broadlight_grey.jpeg',   alt: 'Broadlight Capital',  w: 150 },
]

// Duplicate for seamless infinite loop
const all = [...logos, ...logos]

export default function Ticker() {
  return (
    <div
      style={{ backgroundColor: '#0c0f0e' }}
      className="py-6 overflow-hidden border-y border-white/5"
    >
      <p className="text-center text-[10px] font-medium tracking-[0.18em] uppercase text-white/40 mb-5">
        Trusted by founders &amp; investors
      </p>
      <div
        className="animate-ticker"
        style={{ display: 'inline-flex', gap: 64, alignItems: 'center', whiteSpace: 'nowrap' }}
      >
        {all.map((logo, i) => (
          <span
            key={i}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 64, flexShrink: 0 }}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.w}
              height={40}
              style={{
                objectFit: 'contain',
                maxHeight: 40,
                width: 'auto',
                opacity: 0.85,
              }}
            />
            <span style={{ color: 'rgba(26,122,94,0.6)', fontSize: 10 }}>●</span>
          </span>
        ))}
      </div>
    </div>
  )
}
