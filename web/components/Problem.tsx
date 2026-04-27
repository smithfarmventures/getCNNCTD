const painPoints = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 8h24M4 16h16M4 24h10" stroke="#FF4D6D" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="26" cy="22" r="6" stroke="#FF4D6D" strokeWidth="2" />
        <path d="M26 19v3.5M26 24.5v.5" stroke="#FF4D6D" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Sourcing is Broken',
    body: 'VC deal flow is relationship-gated. Top firms see 1,000+ deals per year — everyone else fights over scraps. Cold emails go nowhere.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" stroke="#FF4D6D" strokeWidth="2" />
        <path d="M16 9v7l4 4" stroke="#FF4D6D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 28l2-3M24 28l-2-3" stroke="#FF4D6D" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Founders Waste Time',
    body: 'Spray-and-pray fundraising costs months of runway. Founders need targeted investor connections, not another database subscription.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 26L16 6l10 20H6z" stroke="#FF4D6D" strokeWidth="2" strokeLinejoin="round" />
        <path d="M16 14v5M16 21v1" stroke="#FF4D6D" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M4 26h24" stroke="#FF4D6D" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Emerging Managers Can't Compete",
    body: "New funds without brand names struggle to access quality deal flow. The playing field is tilted against them — CNNCTD levels it.",
  },
]

export default function Problem() {
  return (
    <section className="bg-bg-base py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16">
          <span className="inline-block text-danger text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full border border-danger/30 bg-danger/5">
            The Problem
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl mx-auto">
            <span className="block">The World Has Changed&hellip;</span>
            <span className="block text-text-secondary font-normal mt-2">
              But Venture Capital Has Not
            </span>
          </h2>
        </div>

        {/* Pain point cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className="bg-bg-surface rounded-2xl p-8 border border-white/5 hover:border-danger/20 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
            >
              <div className="mb-5 p-3 rounded-xl bg-danger/5 w-fit group-hover:bg-danger/10 transition-colors duration-300">
                {point.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{point.title}</h3>
              <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
