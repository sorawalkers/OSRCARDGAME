import { cn } from "@/lib/utils";

// pseudo-aleatório determinístico para o enxame não mudar entre renders
function rng(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

/** A Mãe das Moscas, desenhada em código: um véu de enxame em espiral, à tinta. */
export function FlySwarm({ className }: { className?: string }) {
  const r = rng(7);
  const flies = Array.from({ length: 140 }, (_, i) => {
    const t = i / 140;
    const ang = t * Math.PI * 9 + r() * 0.8;
    const rad = 30 + t * 110 + r() * 18;
    return {
      x: 150 + Math.cos(ang) * rad * 0.9,
      y: 150 + Math.sin(ang) * rad * 0.7 - t * 30,
      s: 1.2 + r() * 2.2,
      a: r() * 180,
    };
  });
  return (
    <svg viewBox="0 0 300 400" className={cn("block bg-paper text-ink", className)} role="img" aria-label="A Mãe das Moscas">
      <defs>
        <pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="currentColor" strokeWidth="0.7" />
        </pattern>
        <pattern id="hatch2" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-40)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      {/* véu / corpo */}
      <path
        d="M150 70 C 120 72 108 110 112 140 C 90 170 70 250 58 380 L 242 380 C 230 250 210 170 188 140 C 192 110 180 72 150 70 Z"
        fill="url(#hatch)"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M150 70 C 132 76 126 100 128 128 C 140 136 160 136 172 128 C 174 100 168 76 150 70 Z" fill="url(#hatch2)" stroke="currentColor" strokeWidth="1.2" />
      {/* olhos */}
      {[[140, 108], [160, 108], [146, 98], [154, 98], [150, 116]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" fill="currentColor" />
      ))}
      {/* boca aberta */}
      <ellipse cx="150" cy="124" rx="5" ry="3.5" fill="currentColor" />
      {/* asas */}
      <path d="M118 150 C 60 110 30 150 40 210 C 70 200 100 180 120 165" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M182 150 C 240 110 270 150 260 210 C 230 200 200 180 180 165" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M118 158 C 80 140 55 165 58 200" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <path d="M182 158 C 220 140 245 165 242 200" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* farrapos */}
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M${66 + i * 12.5} 380 l ${3 - (i % 3) * 3} ${10 + (i % 4) * 6}`} stroke="currentColor" strokeWidth="1" />
      ))}
      {/* enxame */}
      {flies.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y}) rotate(${f.a})`}>
          <ellipse rx={f.s} ry={f.s * 0.6} fill="currentColor" />
          <ellipse cx={-f.s * 0.4} cy={-f.s * 0.9} rx={f.s * 0.7} ry={f.s * 0.35} fill="none" stroke="currentColor" strokeWidth="0.4" />
          <ellipse cx={f.s * 0.4} cy={-f.s * 0.9} rx={f.s * 0.7} ry={f.s * 0.35} fill="none" stroke="currentColor" strokeWidth="0.4" />
        </g>
      ))}
      <line x1="20" y1="388" x2="280" y2="388" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}
