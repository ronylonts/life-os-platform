export function MedicalIllustration() {
  return (
    <div className="medical-scene relative flex shrink-0 items-center justify-center">
      <div className="absolute h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl animate-pulse-glow" />
      <svg
        viewBox="0 0 420 320"
        className="medical-svg relative z-10 h-auto w-full max-w-[420px] drop-shadow-2xl"
        role="img"
        aria-label="Médecin et infirmière"
      >
        {/* Sol */}
        <ellipse cx="210" cy="298" rx="160" ry="14" fill="#1e3a5f" opacity="0.5" />

        {/* Infirmière (gauche) */}
        <g className="animate-nurse-float">
          {/* Corps */}
          <ellipse cx="130" cy="175" rx="38" ry="50" fill="#0ea5e9" />
          <rect x="98" y="155" width="64" height="70" rx="12" fill="#38bdf8" />
          {/* Tablier blanc */}
          <path d="M108 175 L152 175 L148 230 L112 230 Z" fill="#f8fafc" />
          {/* Bras */}
          <ellipse cx="95" cy="195" rx="12" ry="28" fill="#fcd34d" className="animate-wave-left" style={{ transformOrigin: "95px 195px" }} />
          <ellipse cx="165" cy="200" rx="12" ry="26" fill="#fcd34d" />
          {/* Tête */}
          <circle cx="130" cy="115" r="32" fill="#fcd34d" />
          {/* Cheveux + coiffe */}
          <path d="M98 108 Q130 75 162 108 L158 95 Q130 68 102 95 Z" fill="#1e293b" />
          <path d="M108 88 Q130 72 152 88 L150 82 Q130 68 110 82 Z" fill="#f8fafc" />
          {/* Visage */}
          <circle cx="120" cy="118" r="3" fill="#1e293b" />
          <circle cx="140" cy="118" r="3" fill="#1e293b" />
          <path d="M122 128 Q130 134 138 128" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Dossier */}
          <rect x="158" y="188" width="28" height="36" rx="3" fill="#f59e0b" className="animate-chart-bob" />
          <line x1="164" y1="198" x2="180" y2="198" stroke="#fff" strokeWidth="2" />
          <line x1="164" y1="206" x2="178" y2="206" stroke="#fff" strokeWidth="2" />
          <line x1="164" y1="214" x2="176" y2="214" stroke="#fff" strokeWidth="2" />
          {/* Jambes */}
          <rect x="112" y="228" width="16" height="45" rx="6" fill="#0369a1" />
          <rect x="132" y="228" width="16" height="45" rx="6" fill="#0369a1" />
          <ellipse cx="120" cy="278" rx="14" ry="6" fill="#0f172a" />
          <ellipse cx="140" cy="278" rx="14" ry="6" fill="#0f172a" />
        </g>

        {/* Médecin (droite) */}
        <g className="animate-doctor-float">
          {/* Corps - blouse */}
          <rect x="248" y="150" width="72" height="85" rx="14" fill="#f8fafc" />
          <path d="M258 150 L310 150 L305 175 L263 175 Z" fill="#10b981" />
          {/* Stéthoscope */}
          <path
            d="M278 175 Q278 200 295 205 Q312 200 312 175"
            stroke="#334155"
            strokeWidth="3"
            fill="none"
          />
          <circle cx="295" cy="208" r="8" fill="#64748b" />
          <circle cx="295" cy="208" r="4" fill="#94a3b8" />
          {/* Bras */}
          <ellipse cx="238" cy="198" rx="13" ry="28" fill="#fcd34d" />
          <ellipse cx="330" cy="192" rx="13" ry="26" fill="#fcd34d" className="animate-wave-right" style={{ transformOrigin: "330px 192px" }} />
          {/* Tête */}
          <circle cx="284" cy="112" r="34" fill="#fcd34d" />
          {/* Cheveux */}
          <path d="M252 105 Q284 78 316 105 L312 98 Q284 72 256 98 Z" fill="#475569" />
          {/* Lunettes */}
          <circle cx="272" cy="115" r="10" stroke="#334155" strokeWidth="2" fill="none" />
          <circle cx="296" cy="115" r="10" stroke="#334155" strokeWidth="2" fill="none" />
          <line x1="282" y1="115" x2="286" y2="115" stroke="#334155" strokeWidth="2" />
          {/* Visage */}
          <circle cx="272" cy="118" r="2.5" fill="#1e293b" />
          <circle cx="296" cy="118" r="2.5" fill="#1e293b" />
          <path d="M276 130 Q284 136 292 130" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Jambes */}
          <rect x="262" y="232" width="18" height="48" rx="7" fill="#334155" />
          <rect x="288" y="232" width="18" height="48" rx="7" fill="#334155" />
          <ellipse cx="271" cy="284" rx="15" ry="6" fill="#0f172a" />
          <ellipse cx="297" cy="284" rx="15" ry="6" fill="#0f172a" />
        </g>

        {/* Cœur animé entre eux */}
        <g className="animate-heart-pulse" style={{ transformOrigin: "210px 200px" }}>
          <path
            d="M210 195 C210 185 198 178 190 185 C182 178 170 185 170 195 C170 210 210 228 210 228 C210 228 250 210 250 195 C250 185 238 178 230 185 C222 178 210 185 210 195 Z"
            fill="#ef4444"
            opacity="0.9"
          />
        </g>

        {/* Bulles décoratives autour des personnages */}
        <circle cx="60" cy="80" r="12" fill="#10b981" opacity="0.3" className="animate-bubble-small" />
        <circle cx="360" cy="60" r="18" fill="#38bdf8" opacity="0.25" className="animate-bubble-small" style={{ animationDelay: "1s" }} />
        <circle cx="210" cy="40" r="8" fill="#a78bfa" opacity="0.35" className="animate-bubble-small" style={{ animationDelay: "2s" }} />
      </svg>
      <p className="mt-4 text-center text-sm font-medium text-emerald-300/90 animate-fade-in">
        Votre santé, notre priorité
      </p>
    </div>
  );
}
