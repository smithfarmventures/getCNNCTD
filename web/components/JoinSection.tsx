export default function JoinSection() {
  return (
    <section className="bg-cream text-center py-[120px] px-12" id="join">
      <div className="max-w-[640px] mx-auto reveal visible">
        <h2
          className="font-serif font-normal leading-[1.1] tracking-[-0.02em] text-ink mb-5"
          style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
        >
          Ready to get <em className="italic text-green">CNNCTD?</em>
        </h2>
        <p className="text-[13px] font-medium tracking-[0.12em] uppercase text-green mb-4">
          getCNNCTD, stay CNNCTD
        </p>
        <p className="text-[17px] font-light text-ink-soft leading-[1.65] mb-12">
          The venture ecosystem is changing. Be part of the first wave.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href="/waitlist?role=founder"
            className="px-7 py-[13px] rounded-full text-[13px] font-medium no-underline border border-green bg-green text-white hover:bg-[#0f4d3a] hover:border-[#0f4d3a] hover:-translate-y-px transition-all duration-200 inline-flex items-center gap-[7px]"
          >
            I&apos;m a founder →
          </a>
          <a
            href="/waitlist?role=investor"
            className="px-7 py-[13px] rounded-full text-[13px] font-medium no-underline border border-ink/10 text-ink bg-white hover:bg-ink hover:text-white hover:border-ink hover:-translate-y-px transition-all duration-200 inline-flex items-center gap-[7px]"
          >
            I&apos;m an investor →
          </a>
        </div>
      </div>
    </section>
  )
}
