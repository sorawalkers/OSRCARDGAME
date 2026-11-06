import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Candle } from "@/components/game/Candle";
import { D20 } from "@/components/game/D20";
import { GameCard } from "@/components/game/GameCard";
import { DECK } from "@/game/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mesa Vazia — Roguelike de mesa solo em dark fantasy" },
      { name: "description", content: "Crie seu herói em 3d6, role os dados e enfrente um mundo que nasce sob seus pés. Quando você morre, o mundo lembra." },
      { property: "og:title", content: "Mesa Vazia — Roguelike de mesa solo" },
      { property: "og:description", content: "Ficha de papel, d20 na mesa e monstros saídos dos velhos bestiários." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Title,
});

const MENU = [
  { to: "/criacao", label: "Sentar à mesa", hint: "Nova campanha" },
  { to: "/mapa", label: "Continuar", hint: "Morwen Vey · Dia 3" },
  { to: "/bestiario", label: "Bestiário", hint: "O que espera na névoa" },
  { to: "/epitafio", label: "Cemitério", hint: "Heróis que vieram antes" },
] as const;

function Title() {
  return (
    <div className="vignette relative flex min-h-screen flex-col overflow-hidden">
      <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_1fr]">
        <div className="animate-rise">
          <div className="label-mono text-ember">Um roguelike de mesa solo</div>
          <h1 className="mt-3 font-display text-7xl leading-[0.9] text-bone text-glow sm:text-8xl">
            Mesa
            <br />
            Vazia
          </h1>
          <p className="mt-6 max-w-md font-narrative text-xl italic leading-relaxed text-bone-dim">
            O mestre já chegou. As velas estão acesas. Falta só você — e a cadeira dos outros jogadores
            continua vazia.
          </p>

          <nav className="mt-10 max-w-sm">
            {MENU.map((m, i) => (
              <Link
                key={m.to}
                to={m.to}
                className="group flex items-baseline justify-between border-b border-border/50 py-3 transition-colors hover:border-ember/60"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="flex items-center gap-3">
                  <span className="size-2 rotate-45 border border-ember/70 transition-all group-hover:bg-ember group-hover:shadow-[var(--shadow-ember)]" />
                  <span className="font-display text-2xl text-bone group-hover:text-ember-glow">{m.label}</span>
                </span>
                <span className="label-mono text-bone-dim">{m.hint}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-10 flex items-center gap-4">
            <Button asChild variant="ember" size="lg">
              <Link to="/criacao">Rolar 3d6</Link>
            </Button>
            <span className="label-mono text-bone-dim">v8 · protótipo</span>
          </div>
        </div>

        {/* a mesa */}
        <div className="relative hidden h-[560px] lg:block" aria-hidden>
          <Candle className="absolute left-1/2 top-0 -translate-x-1/2" height={150} />
          <div className="paper absolute left-6 top-40 h-80 w-64 -rotate-6 rounded-sm p-5">
            <div className="relative z-10">
              <div className="border-b-2 ink-line pb-1 font-display text-lg text-ink">Ficha do Aventureiro</div>
              <div className="paper-rule mt-3 h-52 font-narrative italic leading-7 text-ink-faded">
                Nome: ______________
                <br />
                Classe: ____________
                <br />
                FOR __ DES __ CON __
                <br />
                INT __ SAB __ CAR __
                <br />
                Motivação: _________
              </div>
            </div>
          </div>
          <div className="absolute right-4 top-48 rotate-[8deg]">
            <GameCard card={DECK[0]!} />
          </div>
          <div className="absolute right-36 top-64 -rotate-[4deg]">
            <GameCard card={DECK[5]!} />
          </div>
          <D20 value={20} size={86} tone="ember" className="absolute bottom-10 left-44 rotate-12" />
          <D20 value={7} size={60} tone="bone" className="absolute bottom-4 left-72 -rotate-12 opacity-80" />
        </div>
      </div>

      <footer className="relative z-10 border-t border-border/40 py-4 text-center">
        <span className="label-mono text-bone-dim">
          Charneca dos Enforcados · Pântano de Velmire · Campos de Cinza · Floresta Sem Pássaros
        </span>
      </footer>
    </div>
  );
}
