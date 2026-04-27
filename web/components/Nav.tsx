'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] px-12 py-5 flex items-center justify-between transition-[border-color] duration-300 bg-cream/85 backdrop-blur-xl border-b ${
        scrolled ? 'border-ink/10' : 'border-transparent'
      }`}
    >
      <a href="#" className="no-underline flex items-center">
        <Image
          src="/getcnnctd_logo.jpeg"
          alt="CNNCTD"
          width={144}
          height={80}
          className="object-contain"
          style={{ height: 36, width: 'auto', objectPosition: 'left center' }}
        />
      </a>

      <div className="hidden md:flex items-center gap-9">
        <a href="#how" className="text-[13px] text-ink-soft hover:text-ink transition-colors duration-200 no-underline tracking-[0.01em]">
          How it works
        </a>
        <a href="#investors" className="text-[13px] text-ink-soft hover:text-ink transition-colors duration-200 no-underline tracking-[0.01em]">
          Investors
        </a>
        <a href="#founders" className="text-[13px] text-ink-soft hover:text-ink transition-colors duration-200 no-underline tracking-[0.01em]">
          Founders
        </a>
      </div>

      <a
        href="#join"
        className="bg-ink text-white px-[22px] py-[9px] rounded-full text-[13px] font-medium tracking-[0.01em] hover:bg-green hover:-translate-y-px transition-all duration-200 no-underline inline-block"
      >
        Get CNNCTD
      </a>
    </nav>
  )
}
