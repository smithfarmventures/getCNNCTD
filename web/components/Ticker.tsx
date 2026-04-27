import Image from 'next/image'

const logos = [
  { src: '/sightful_grey.jpeg',     alt: 'Sightful',            w: 240 },
  { src: '/corner_grey.jpeg',       alt: 'Corner Capital',      w: 240 },
  { src: '/kanso_grey.jpeg',        alt: 'Kanso',               w: 240 },
  { src: '/third_wall_grey.jpeg',   alt: 'Third Wall',          w: 240 },
  { src: '/baselane_grey.jpeg',     alt: 'Baselane',            w: 240 },
  { src: '/nucleus_grey.jpeg',      alt: 'The Nucleus Network', w: 280 },
  { src: '/broadlight_grey.jpeg',   alt: 'Broadlight Capital',  w: 280 },
]

// Duplicate for seamless infinite loop
const all = [...logos, ...logos]

export default function Ticker() {
  return (
    <div
      style={{ backgroundColor: '#000' }}
      className="py-12 overflow-hidden border-y border-white/5"
    >
      <p className="text-center text-[11px] font-medium tracking-[0.22em] uppercase text-white/45 mb-9">
        Trusted by founders &amp; investors
      </p>
      <div
        className="animate-ticker"
        style={{ display: 'inline-flex', gap: 96, alignItems: 'center', whiteSpace: 'nowrap' }}
      >
        {all.map((logo, i) => (
          <span
            key={i}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 96, flexShrink: 0 }}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.w}
              height={72}
              style={{
                objectFit: 'contain',
                height: 72,
                width: 'auto',
                opacity: 0.95,
              }}
            />
            <span style={{ color: 'rgba(26,122,94,0.5)', fontSize: 12 }}>●</span>
          </span>
        ))}
      </div>
    </div>
  )
}
