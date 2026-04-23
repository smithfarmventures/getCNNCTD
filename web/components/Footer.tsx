export default function Footer() {
  return (
    <footer className="bg-ink flex flex-col sm:flex-row items-center justify-between px-12 py-10 gap-3">
      <div className="flex flex-col gap-1">
        <div className="text-[15px] font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
          CNNCTD
        </div>
        <div className="text-[11px] font-medium tracking-[0.1em] uppercase" style={{ color: 'rgba(26,122,94,0.9)' }}>
          getCNNCTD, stay CNNCTD
        </div>
      </div>
      <div className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
        © 2025 CNNCTD. Sourcing and connection only. No transactions facilitated.
      </div>
    </footer>
  )
}
