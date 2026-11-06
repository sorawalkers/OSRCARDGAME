import type { Card } from "@/game/data";
import { cn } from "@/lib/utils";

const typeGlyph: Record<Card["type"], string> = {
  Ataque: "M6 26 L26 6 M20 6 L26 6 L26 12 M6 20 L12 26",
  Defesa: "M16 4 L27 8 L25 20 Q 21 26 16 28 Q 11 26 7 20 L5 8 Z",
  Truque: "M16 4 L19 13 L28 16 L19 19 L16 28 L13 19 L4 16 L13 13 Z",
  Magia: "M16 4 A12 12 0 1 0 28 16 A9 9 0 1 1 16 4 Z",
  Oração: "M16 3 L16 29 M8 11 L24 11",
};

const typeTone: Record<Card["type"], string> = {
  Ataque: "text-blood",
  Defesa: "text-ink-faded",
  Truque: "text-ember",
  Magia: "text-violet",
  Oração: "text-ember",
};

/** Carta de ação com moldura, estilo papel envelhecido. */
export function GameCard({
  card,
  onClick,
  disabled,
  style,
  className,
}: {
  card: Card;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={cn(
        "paper group relative flex h-64 w-44 shrink-0 flex-col rounded-md p-2 text-left shadow-[var(--shadow-card)] transition-all duration-300",
        "hover:z-20 hover:-translate-y-6 hover:rotate-0 hover:scale-105 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      <div className="relative z-10 flex h-full flex-col rounded-sm border-2 border-double ink-line p-2.5">
        <div className="flex items-start justify-between gap-1">
          <h4 className="font-display text-[1.05rem] leading-tight text-ink">{card.name}</h4>
          {card.exhaust && (
            <span className="label-mono rounded-sm border border-violet/60 px-1 text-[0.55rem] text-violet">
              esgota
            </span>
          )}
        </div>
        <div className="label-mono mt-0.5 text-[0.58rem] text-ink-faded">{card.type}</div>

        <div className="my-2 flex flex-1 items-center justify-center border-y ink-line">
          <svg viewBox="0 0 32 32" className={cn("size-12", typeTone[card.type])}>
            <path d={typeGlyph[card.type]} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {card.attr ? (
          <div className="mb-1.5 flex items-center justify-between font-mono text-[0.68rem] text-ink">
            <span>d20 + {card.attr}</span>
            <span className="text-ink-faded">vs {card.dc}</span>
          </div>
        ) : (
          <div className="label-mono mb-1.5 text-[0.58rem] text-ink-faded">sem rolagem</div>
        )}
        <p className="font-body text-[0.82rem] leading-tight text-ink">
          <span className="text-rot">✓</span> {card.success}
        </p>
        {card.fail && (
          <p className="mt-0.5 font-body text-[0.78rem] italic leading-tight text-ink-faded">
            <span className="text-ink-red">✗</span> {card.fail}
          </p>
        )}
      </div>
    </button>
  );
}
