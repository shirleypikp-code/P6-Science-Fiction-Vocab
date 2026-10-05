interface StarshipVisualizerProps {
  shipId: string;
  petId: string;
  shieldId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isAnimated?: boolean;
}

export default function StarshipVisualizer({
  shipId,
  petId,
  shieldId,
  className = '',
  size = 'md',
  isAnimated = true
}: StarshipVisualizerProps) {
  // Shield color mapping
  const shieldGlowMap: Record<string, { stroke: string; fill: string; shadow: string }> = {
    'shield-cyan': { stroke: '#06b6d4', fill: 'rgba(6, 182, 212, 0.12)', shadow: 'drop-shadow(0 0 16px rgba(6, 182, 212, 0.4))' },
    'shield-emerald': { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.12)', shadow: 'drop-shadow(0 0 16px rgba(16, 185, 129, 0.4))' },
    'shield-amber': { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.12)', shadow: 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.4))' },
    'shield-violet': { stroke: '#8b5cf6', fill: 'rgba(139, 92, 246, 0.12)', shadow: 'drop-shadow(0 0 16px rgba(139, 92, 246, 0.4))' }
  };

  const shieldConfig = shieldGlowMap[shieldId] || shieldGlowMap['shield-cyan'];

  const dims = {
    sm: 'w-20 h-20',
    md: 'w-36 h-36',
    lg: 'w-52 h-52'
  }[size];

  return (
    <div className={`relative flex items-center justify-center ${dims} ${className}`}>
      {/* Outer Shield Bubble */}
      <svg
        viewBox="0 0 200 200"
        className={`absolute inset-0 w-full h-full pointer-events-none transition-all duration-500 ${isAnimated ? 'animate-pulse-slow' : ''}`}
        style={{ filter: shieldConfig.shadow }}
      >
        <circle
          cx="100"
          cy="100"
          r="92"
          fill={shieldConfig.fill}
          stroke={shieldConfig.stroke}
          strokeWidth="2.5"
          strokeDasharray="8 4"
          className="opacity-75"
        />
        {/* Shield node rings */}
        <circle cx="100" cy="8" r="4" fill={shieldConfig.stroke} />
        <circle cx="192" cy="100" r="4" fill={shieldConfig.stroke} />
        <circle cx="100" cy="192" r="4" fill={shieldConfig.stroke} />
        <circle cx="8" cy="100" r="4" fill={shieldConfig.stroke} />
      </svg>

      {/* Starship Chassis Rendering */}
      <svg
        viewBox="0 0 160 160"
        className={`w-3/4 h-3/4 transition-transform duration-300 ${isAnimated ? 'hover:scale-105' : ''}`}
      >
        <defs>
          <linearGradient id="scoutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="falconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="nebulaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>
          <linearGradient id="titanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="thrusterGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Thruster Plumes */}
        <polygon
          points="70,126 90,126 80,154"
          fill="url(#thrusterGlow)"
          className={isAnimated ? 'animate-pulse' : ''}
        />

        {/* Ship Hull Variants */}
        {shipId === 'ship-falcon' ? (
          // Solar Falcon
          <g>
            {/* Extended swept wings */}
            <polygon points="80,18 20,110 40,116 74,96" fill="#78350f" opacity="0.9" />
            <polygon points="80,18 140,110 120,116 86,96" fill="#78350f" opacity="0.9" />
            <polygon points="80,24 28,104 42,108 76,92" fill="url(#falconGrad)" />
            <polygon points="80,24 132,104 118,108 84,92" fill="url(#falconGrad)" />
            {/* Center fuselage */}
            <polygon points="80,14 62,90 80,128 98,90" fill="#fef3c7" />
            <polygon points="80,18 66,88 80,124 94,88" fill="url(#falconGrad)" />
            {/* Cockpit Canopy */}
            <ellipse cx="80" cy="54" rx="7" ry="16" fill="#0f172a" stroke="#fde047" strokeWidth="1.5" />
            <ellipse cx="80" cy="52" rx="4" ry="10" fill="#38bdf8" opacity="0.8" />
          </g>
        ) : shipId === 'ship-nebula' ? (
          // Nebula Striker
          <g>
            {/* Heavy armored wings */}
            <polygon points="80,20 16,92 24,124 64,112" fill="#3b0764" />
            <polygon points="80,20 144,92 136,124 96,112" fill="#3b0764" />
            <polygon points="80,26 26,88 32,116 68,108" fill="url(#nebulaGrad)" />
            <polygon points="80,26 134,88 128,116 92,108" fill="url(#nebulaGrad)" />
            {/* Dual plasma cannons */}
            <rect x="22" y="70" width="6" height="34" rx="2" fill="#e9d5ff" />
            <rect x="132" y="70" width="6" height="34" rx="2" fill="#e9d5ff" />
            {/* Main hull */}
            <polygon points="80,16 58,78 68,126 80,132 92,126 102,78" fill="url(#nebulaGrad)" stroke="#f3e8ff" strokeWidth="1.5" />
            <circle cx="80" cy="62" r="10" fill="#0f172a" stroke="#c084fc" strokeWidth="2" />
            <circle cx="80" cy="62" r="5" fill="#a855f7" />
          </g>
        ) : shipId === 'ship-dreadnought' ? (
          // Quantum Titan
          <g>
            {/* Massive geometric multi-fin armor */}
            <polygon points="80,10 12,80 30,134 60,118 72,138 80,142 88,138 100,118 130,134 148,80" fill="#064e3b" />
            <polygon points="80,16 22,78 36,124 62,112 74,130 80,134 86,130 98,112 124,124 138,78" fill="url(#titanGrad)" />
            {/* Quantum Core emitter */}
            <polygon points="80,22 66,74 80,110 94,74" fill="#ecfdf5" />
            <circle cx="80" cy="74" r="11" fill="#022c22" stroke="#6ee7b7" strokeWidth="2" />
            <circle cx="80" cy="74" r="6" fill="#34d399" />
            <polygon points="80,34 76,46 84,46" fill="#10b981" />
          </g>
        ) : (
          // Default: Astro Dart MK-I
          <g>
            <polygon points="80,18 36,104 54,116 72,106" fill="#0369a1" />
            <polygon points="80,18 124,104 106,116 88,106" fill="#0369a1" />
            <polygon points="80,22 42,98 56,108 72,100" fill="url(#scoutGrad)" />
            <polygon points="80,22 118,98 104,108 88,100" fill="url(#scoutGrad)" />
            {/* Fuselage */}
            <polygon points="80,14 64,88 80,126 96,88" fill="url(#scoutGrad)" stroke="#bae6fd" strokeWidth="1.5" />
            {/* Cockpit */}
            <ellipse cx="80" cy="56" rx="6" ry="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <ellipse cx="80" cy="54" rx="3.5" ry="8" fill="#7dd3fc" opacity="0.9" />
          </g>
        )}
      </svg>

      {/* Floating Pet Companion Icon */}
      {petId && petId !== 'pet-none' && (
        <div
          className="absolute -top-1 -right-1 bg-slate-900/90 border border-slate-700/80 rounded-full p-1.5 shadow-lg shadow-cyan-500/10 flex items-center justify-center transform transition-transform hover:scale-110"
          title={`Co-pilot companion: ${petId}`}
        >
          <span className="text-xl">
            {petId === 'pet-sparky' ? '🐕‍🦺' : petId === 'pet-pixel' ? '🐱' : '🐲'}
          </span>
        </div>
      )}
    </div>
  );
}
