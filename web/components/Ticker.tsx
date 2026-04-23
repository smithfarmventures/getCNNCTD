import Image from 'next/image'

const logos = [
  { src: '/sightful_logo.png',        alt: 'Sightful'            },
  { src: '/corner_capital_logo.jpg',  alt: 'Corner Capital'      },
  { src: '/kanso_logo.png',           alt: 'Kanso'               },
  { src: '/third_wall_logo.png',      alt: 'Third Wall'          },
  { src: '/baselane_logo.png',        alt: 'Baselane'            },
  { src: '/nucleus_network_logo.png', alt: 'The Nucleus Network' },
]

// Duplicate for seamless infinite loop
const all = [...logos, ...logos]

export default function Ticker() {
  return (
    <div style={{ backgroundColor: '#0c0f0e' }} className="py-[14px] overflow-hidden">
      <div
        className="animate-ticker"
        style={{ display: 'inline-flex', gap: 48, alignItems: 'center', whiteSpace: 'nowrap' }}
      >
        {all.map((logo, i) => (
          <span
            key={i}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 48, flexShrink: 0 }}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={96}
              height={28}
              style={{
                objectFit: 'contain',
                maxHeight: 28,
                filter: 'brightness(0) invert(1)',
                opacity: 0.7,
              }}
            />
            <span style={{ color: '#1a7a5e', fontSize: 12 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
