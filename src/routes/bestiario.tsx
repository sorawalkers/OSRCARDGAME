import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { MonsterPlate } from "@/components/game/MonsterPlate";
import { INTENT_LABEL, MONSTERS } from "@/game/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bestiario")({
  head: () => ({
    meta: [
      { title: "Bestiário — Mesa Vazia" },
      { name: "description", content: "Carniçais, enforcados, lobos da névoa e os três Corações: as criaturas que esperam na névoa, em gravuras à tinta." },
      { property: "og:title", content: "Bestiário — Mesa Vazia" },
      { property: "og:description", content: "Pranchas à tinta no estilo dos velhos manuais de monstros." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Bestiary,
});

function Bestiary() {
  return (
    <div className="vignette min-h-screen">
      <header className="relative z-10 border-b border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="font-display text-lg text-bone hover:text-ember">
            Mesa Vazia
          </Link>
          <Button asChild variant="bone" size="sm">
            <Link to="/mapa">Ir ao mapa</Link>
          </Button>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        <div className="text-center">
          <div className="label-mono text-ember">Manual do Mestre · apêndice</div>
          <h1 className="mt-2 font-display text-6xl text-bone">Bestiário</h1>
          <p className="mx-auto mt-3 max-w-xl font-narrative text-lg italic text-bone-dim">
            O que se sabe das coisas que andam na névoa. Quase tudo foi escrito por quem não voltou.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {MONSTERS.map((m, i) => (
            <article
              key={m.id}
              className={cn("paper animate-rise rounded-sm p-5", i % 2 ? "rotate-[0.6deg]" : "-rotate-[0.5deg]")}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="relative z-10">
                <div className="flex items-baseline justify-between border-b-2 ink-line pb-1">
                  <h2 className="font-display text-2xl text-ink">{m.name}</h2>
                  <span className={cn("label-mono text-[0.58rem]", m.kind === "chefe" ? "text-ink-red" : "text-ink-faded")}>
                    {m.kind === "chefe" ? "Coração" : m.kind === "forte" ? "Forte" : "Comum"}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-[120px_1fr] gap-4">
                  <MonsterPlate monster={m} className="shadow-none" />
                  <dl className="font-mono text-[0.72rem] leading-6 text-ink">
                    {[
                      ["Defesa", m.defense],
                      ["Vida", m.hp],
                      ["Acerto", `+${m.hit}`],
                      ["Dano", m.damage],
                      ["Habitat", m.habitat],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2 border-b border-dotted ink-line">
                        <dt className="text-ink-faded">{k}</dt>
                        <dd className="text-right">{v}</dd>
                      </div>
                    ))}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {[...new Set(m.intents)].map((it) => (
                        <span key={it} className="label-mono rounded-sm border ink-line px-1 text-[0.52rem] text-ink-faded">
                          {INTENT_LABEL[it].label}
                        </span>
                      ))}
                    </div>
                  </dl>
                </div>
                <p className="mt-4 font-narrative text-[1.02rem] leading-snug text-ink">{m.lore}</p>
                <p className="mt-2 font-narrative text-sm italic text-ink-faded">Ao morrer: “{m.deathLine}”</p>
                <div className="mt-4">
                  <Button asChild variant="ink" size="sm">
                    <Link to="/combate" search={{ m: m.id }}>
                      Enfrentar na mesa
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
