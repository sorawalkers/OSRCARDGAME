import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { GameShell } from "@/components/game/GameShell";
import { NODE_META, REGION_NODES, RegionMap, type MapNode } from "@/components/game/RegionMap";
import { SAMPLE_HERO } from "@/game/data";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa da região — Mesa Vazia" },
      { name: "description", content: "Escolha o próximo passo pela Charneca dos Enforcados. Além de dois passos, só névoa." },
      { property: "og:title", content: "Mapa da região — Mesa Vazia" },
      { property: "og:description", content: "Um mapa desenhado à mão que se revela a cada passo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapScreen,
});

function destination(n: MapNode) {
  switch (n.type) {
    case "vila":
      return { to: "/vila" as const };
    case "ruina":
      return { to: "/combate" as const, search: { m: "carnical" } };
    case "covil":
      return { to: "/combate" as const, search: { m: "lobo" } };
    case "chefe":
      return { to: "/combate" as const, search: { m: "mae-das-moscas" } };
    default:
      return { to: "/cena" as const };
  }
}

const LEGEND = ["estrada", "ruina", "vila", "santuario", "covil", "pedido", "chefe"] as const;

function MapScreen() {
  const [selected, setSelected] = useState<MapNode | undefined>(REGION_NODES.find((n) => n.id === "d0"));
  const dest = selected ? destination(selected) : undefined;

  return (
    <GameShell location="Charneca dos Enforcados · passo 2 de 9">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="label-mono text-ember">Região I</div>
            <h1 className="font-display text-5xl text-bone">Charneca dos Enforcados</h1>
            <p className="mt-1 font-narrative text-lg italic text-bone-dim">
              Tarde do terceiro dia. Um vento baixo faz as cordas rangerem nas forcas.
            </p>
          </div>
          <div className="label-mono text-bone-dim">
            Cada passo custa <span className="text-rot">1 provisão</span> · restam {SAMPLE_HERO.provisions}
          </div>
        </div>

        <div className="paper mt-6 overflow-hidden rounded-sm p-3 sm:p-5">
          <div className="relative z-10 overflow-x-auto scrollbar-none border-2 border-double ink-line">
            <div className="min-w-[860px]">
              <RegionMap current="c1" visited={["a0", "b0", "c1"]} selected={selected?.id} onSelect={setSelected} />
            </div>
            {/* cartucho e rosa dos ventos */}
            <div className="pointer-events-none absolute left-4 top-3 hidden sm:block">
              <div className="font-display text-sm text-ink-faded">Carta da Charneca</div>
              <div className="label-mono text-[0.55rem] text-ink-faded">desenhada por M. Vey, dia 3</div>
            </div>
            <svg viewBox="0 0 60 60" className="pointer-events-none absolute bottom-3 left-4 size-14 text-ink opacity-60">
              <path d="M30 2 L34 30 L30 58 L26 30 Z M2 30 L30 26 L58 30 L30 34 Z" fill="none" stroke="currentColor" />
              <path d="M30 2 L34 30 L26 30 Z" fill="currentColor" />
              <text x="30" y="-2" textAnchor="middle" fontSize="8" fill="currentColor" transform="translate(0 10)" style={{ fontFamily: "var(--font-display)" }}>
                N
              </text>
            </svg>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          {selected ? (
            <div className="animate-rise rounded-sm border border-border/60 bg-card/50 p-5" key={selected.id}>
              <div className="label-mono text-ember">{NODE_META[selected.type].label}</div>
              <h2 className="mt-1 font-display text-3xl text-bone">{selected.name}</h2>
              <p className="mt-2 font-narrative text-lg italic text-bone-dim">{NODE_META[selected.type].desc}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {dest && (
                  <Button asChild variant="ember" size="lg">
                    <Link {...dest}>Seguir para lá · −1 provisão</Link>
                  </Button>
                )}
                <span className="label-mono text-bone-dim">ou escolha outro círculo marcado no mapa</span>
              </div>
            </div>
          ) : (
            <div className="rounded-sm border border-dashed border-border/60 p-5 font-narrative italic text-bone-dim">
              Escolha um dos lugares marcados no mapa.
            </div>
          )}

          <div className="rounded-sm border border-border/60 p-5">
            <div className="label-mono mb-3 text-bone-dim">Legenda</div>
            <ul className="grid grid-cols-2 gap-2">
              {LEGEND.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <svg viewBox="-16 -16 32 32" className="size-6 text-bone">
                    <path d={NODE_META[t].glyph} fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  <span className="font-body text-sm text-bone">{NODE_META[t].label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </GameShell>
  );
}
