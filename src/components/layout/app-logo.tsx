export function AppLogo({ size = 64 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="drop-shadow-lg transition-all duration-500 hover:drop-shadow-emerald-500/40"
      >
        <circle cx="40" cy="40" r="38" fill="url(#logoGradient)" />
        <circle cx="40" cy="40" r="38" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <path
          d="M28 52V28h8c6 0 10 3.5 10 9.5S42 47 36 47h-4v5H28zm8-11h3.5c2.5 0 4-1.5 4-3.5s-1.5-3.5-4-3.5H36v7z"
          fill="white"
        />
        <path
          d="M48 52l6-24h7l6 24h-6.5l-1-4.5h-7.5l-1 4.5H48zm8.5-18l-2.5 9.5h5L56.5 34z"
          fill="white"
          opacity="0.95"
        />
        <circle cx="58" cy="24" r="4" fill="#6ee7b7" className="animate-pulse-glow" />
        <defs>
          <linearGradient id="logoGradient" x1="0" y1="0" x2="80" y2="80">
            <stop stopColor="#059669" />
            <stop offset="1" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
      </svg>
      <span className="mt-2 text-lg font-bold tracking-tight text-white">Life OS</span>
    </div>
  );
}
