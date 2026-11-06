import { cn } from "@/lib/utils";

type Tone = "bone" | "ember" | "blood" | "rot" | "violet";

const toneClass: Record<Tone, string> = {
  bone: "text-bone",
  ember: "text-ember",
  blood: "text-blood",
  rot: "text-rot",
  violet: "text-violet",
};

/** d20 hexagonal desenhado em SVG (projeção clássica do icosaedro). */
export function D20({
  value,
  size = 72,
  tone = "bone",
  rolling = false,
  className,
  label,
}: {
  value?: number | string;
  size?: number;
  tone?: Tone;
  rolling?: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn("relative inline-flex flex-col items-center", toneClass[tone], className)}
      aria-label={label ?? (value !== undefined ? `d20: ${value}` : "d20")}
    >
      <svg
        key={rolling ? `r-${value}` : `s-${value}`}
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={cn("drop-shadow-[0_6px_10px_oklch(0_0_0/0.6)]", rolling && "animate-roll")}
      >
        <polygon
          points="50,4 90,27 90,73 50,96 10,73 10,27"
          fill="currentColor"
          fillOpacity="0.08"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polygon
          points="50,24 76,68 24,68"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <g stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.7">
          <line x1="50" y1="4" x2="50" y2="24" />
          <line x1="50" y1="24" x2="90" y2="27" />
          <line x1="50" y1="24" x2="10" y2="27" />
          <line x1="76" y1="68" x2="90" y2="27" />
          <line x1="76" y1="68" x2="90" y2="73" />
          <line x1="76" y1="68" x2="50" y2="96" />
          <line x1="24" y1="68" x2="10" y2="27" />
          <line x1="24" y1="68" x2="10" y2="73" />
          <line x1="24" y1="68" x2="50" y2="96" />
        </g>
        {value !== undefined && (
          <text
            x="50"
            y="58"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="currentColor"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: String(value).length > 1 ? 20 : 24 }}
          >
            {value}
          </text>
        )}
      </svg>
    </div>
  );
}
