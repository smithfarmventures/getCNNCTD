import Image from 'next/image'

const logos = [
  { src: '/sightful_logo.png',       alt: 'Sightful',              bg: '#000',    h: 36 },
  { src: '/corner_capital_logo.jpg', alt: 'Corner Capital',        bg: '#2d4a52', h: 40 },
  { src: '/kanso_logo.png',          alt: 'Kanso',                 bg: '#111',    h: 36 },
  { src: '/third_wall_logo.png',     alt: 'Third Wall',            bg: '#000',    h: 32 },
  { src: '/baselane_logo.png',       alt: 'Baselane',              bg: '#0f2333', h: 32 },
  { src: '/nucleus_network_logo.png',alt: 'The Nucleus Network',   bg: '#000',    h: 36 },
]

export default function LogoStrip() {
  return (
    <div className="bg-cream border-y border-ink/[0.07] py-10 px-6 overflow-hidden">
      <p className="text-center text-[11px] font-medium tracking-[0.12em] uppercase text-ink-mute mb-8">
        Trusted by founders &amp; investors
      </p>
      <div className="flex items-center justify-center flex-wrap gap-8 max-w-[900px] mx-auto">
        {logos.map((logo) => (
          <div
            key={logo.alt}
            className="rounded-xl overflow-hidden flex items-center justify-center px-4 py-2 flex-shrink-0"
            style={{ backgroundColor: logo.bg, height: 56 }}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={120}
              height={logo.h}
              className="object-contain"
              style={{ maxHeight: logo.h }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
