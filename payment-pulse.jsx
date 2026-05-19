/* ====================================================================
   PaymentPulse — minimal SVG animation for the Overview hero.
   A central Loka hub with three chain nodes (BTC · SUI · EVM); luminous
   pulses travel along each edge in both directions, representing the
   atomic settlement traffic the docs describe.
   ==================================================================== */

function PaymentPulse() {
  // Coordinates inside a 320×280 viewBox
  const C = { x: 160, y: 140 };       // hub (Loka)
  const N = [
    { id: 'btc', label: 'BTC', x: 60,  y: 60,  color: 'var(--gold)' },
    { id: 'sui', label: 'SUI', x: 260, y: 60,  color: 'var(--cyan)' },
    { id: 'evm', label: 'EVM', x: 160, y: 240, color: 'var(--violet)' },
  ];

  return (
    <div className="payment-pulse">
      <svg viewBox="0 0 320 280" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="var(--gold)" stopOpacity="0.9" />
            <stop offset="60%"  stopColor="var(--gold)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="currentColor" stopOpacity="0.6" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* concentric rings around hub */}
        <g className="hub-rings" opacity="0.4">
          {[40, 60, 80].map((r, i) => (
            <circle key={i} cx={C.x} cy={C.y} r={r}
              fill="none" stroke="var(--border-hi)" strokeWidth="0.5"
              strokeDasharray="2 4"
              style={{ animation: `pp-ring-rotate ${30 + i*8}s linear ${i % 2 ? 'reverse' : 'normal'} infinite` }}
            />
          ))}
        </g>

        {/* edges hub ↔ each node */}
        {N.map(n => {
          const id = `path-${n.id}`;
          const d = `M ${C.x} ${C.y} L ${n.x} ${n.y}`;
          return (
            <g key={n.id}>
              <path id={id} d={d} fill="none"
                stroke="var(--border-hi)" strokeWidth="1" opacity="0.55" />
              {/* outgoing pulse */}
              <circle r="3" fill={n.color}
                style={{ filter: `drop-shadow(0 0 6px ${n.color})` }}>
                <animateMotion dur="3.2s" repeatCount="indefinite"
                  begin={`${0.6 * N.indexOf(n)}s`}>
                  <mpath href={`#${id}`} />
                </animateMotion>
                <animate attributeName="opacity"
                  values="0;1;1;0"
                  dur="3.2s" repeatCount="indefinite"
                  begin={`${0.6 * N.indexOf(n)}s`} />
              </circle>
              {/* incoming pulse */}
              <circle r="2.4" fill="var(--gold)"
                style={{ filter: 'drop-shadow(0 0 5px var(--gold))' }}>
                <animateMotion dur="3.2s" repeatCount="indefinite"
                  begin={`${1.6 + 0.6 * N.indexOf(n)}s`} keyPoints="1;0" keyTimes="0;1">
                  <mpath href={`#${id}`} />
                </animateMotion>
                <animate attributeName="opacity"
                  values="0;1;1;0"
                  dur="3.2s" repeatCount="indefinite"
                  begin={`${1.6 + 0.6 * N.indexOf(n)}s`} />
              </circle>
            </g>
          );
        })}

        {/* chain nodes */}
        {N.map(n => (
          <g key={n.id} style={{ color: n.color }}>
            <circle cx={n.x} cy={n.y} r="22" fill="url(#node-glow)" />
            <circle cx={n.x} cy={n.y} r="11"
              fill="var(--bg-2)" stroke="currentColor" strokeWidth="1.2" />
            <text x={n.x} y={n.y + 3.5} textAnchor="middle"
              fontFamily="var(--font-mono)" fontSize="8.5" fontWeight="600"
              fill="currentColor">{n.label}</text>
          </g>
        ))}

        {/* hub (Loka) */}
        <g>
          <circle cx={C.x} cy={C.y} r="32" fill="url(#hub-glow)" />
          <circle cx={C.x} cy={C.y} r="16"
            fill="var(--bg-1)" stroke="var(--gold)" strokeWidth="1.4">
            <animate attributeName="r" values="15;17;15"
              dur="2.8s" repeatCount="indefinite" />
          </circle>
          {/* lightning bolt — mirrors the brand bolt direction (upper-right → lower-left) */}
          <path d={`M ${C.x + 4} ${C.y - 6} L ${C.x - 2} ${C.y - 1} L ${C.x + 1} ${C.y - 1} L ${C.x - 4} ${C.y + 6} L ${C.x + 2} ${C.y + 1} L ${C.x - 1} ${C.y + 1} Z`}
            fill="var(--gold)" style={{ filter: 'drop-shadow(0 0 4px var(--gold))' }} />
        </g>

        {/* corner tick marks (terminal-style) */}
        <g stroke="var(--fg-3)" strokeWidth="1" opacity="0.5" fill="none">
          <path d="M 4 4 L 14 4 M 4 4 L 4 14" />
          <path d="M 316 4 L 306 4 M 316 4 L 316 14" />
          <path d="M 4 276 L 14 276 M 4 276 L 4 266" />
          <path d="M 316 276 L 306 276 M 316 276 L 316 266" />
        </g>
      </svg>

      <div className="payment-pulse__readout">
        <span className="pp-dot" />
        <span className="pp-label">LIVE</span>
        <span className="pp-counter" data-pp-counter>0</span>
        <span className="pp-unit">tx/s</span>
      </div>
    </div>
  );
}

/* Live-ish counter that drifts up and down to feel real */
(function attachCounter() {
  if (window.__ppCounterAttached) return;
  window.__ppCounterAttached = true;
  let v = 12400;
  setInterval(() => {
    document.querySelectorAll('[data-pp-counter]').forEach(el => {
      v += Math.round((Math.random() - 0.45) * 90);
      if (v < 10500) v = 10500;
      if (v > 13800) v = 13800;
      el.textContent = v.toLocaleString();
    });
  }, 800);
})();

window.PaymentPulse = PaymentPulse;
