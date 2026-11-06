import type { Monster } from "@/game/data";
import { cn } from "@/lib/utils";
import { FlySwarm } from "./FlySwarm";

/** Gravura do monstro emoldurada como prancha de bestiário antigo. */
export function MonsterPlate({
  monster,
  className,
  hurt,
}: {
  monster: Monster;
  className?: string;
  hurt?: boolean;
}) {
  return (
    <figure className={cn("paper rounded-sm p-2.5", hurt && "animate-[shake_0.4s]", className)}>
      <div className="relative z-10 overflow-hidden border-2 border-double ink-line">
        {monster.image ? (
          <img
            src={monster.image}
            alt={`Gravura: ${monster.name}`}
            width={768}
            height={1024}
            loading="lazy"
            className="engraving block aspect-[3/4] w-full object-cover"
          />
        ) : (
          <FlySwarm className="aspect-[3/4] w-full" />
        )}
      </div>
      <figcaption className="relative z-10 mt-1.5 text-center">
        <span className="label-mono text-[0.55rem] text-ink-faded">Prancha · {monster.epithet}</span>
      </figcaption>
    </figure>
  );
}
