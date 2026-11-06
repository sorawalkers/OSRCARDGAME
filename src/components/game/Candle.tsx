import { cn } from "@/lib/utils";

/** Vela acesa em SVG, com chama tremulante. */
export function Candle({ className, height = 120 }: { className?: string; height?: number }) {
  return (
    <div className={cn("relative inline-block", className)} style={{ height }} aria-hidden>
      <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/3 rounded-full bg-ember/20 blur-3xl animate-flicker" />
      <svg viewBox="0 0 40 120" height={height} className="relative">
        <g className="origin-[20px_28px] animate-flicker">
          <path d="M20 4 C 27 16, 26 26, 20 30 C 14 26, 13 16, 20 4 Z" className="fill-ember" />
          <path d="M20 13 C 23 20, 23 25, 20 28 C 17 25, 17 20, 20 13 Z" className="fill-ember-glow" />
        </g>
        <line x1="20" y1="28" x2="20" y2="34" className="stroke-ink" strokeWidth="1.5" />
        <path
          d="M8 34 Q 20 31 32 34 L 32 112 Q 20 116 8 112 Z"
          className="fill-bone"
          fillOpacity="0.92"
        />
        <path d="M27 35 Q 29 48 26 58 Q 25 52 24 36 Z" className="fill-paper" />
        <path d="M8 34 Q 20 31 32 34 L 32 112 Q 20 116 8 112 Z" className="fill-ink" fillOpacity="0.12" />
      </svg>
    </div>
  );
}
