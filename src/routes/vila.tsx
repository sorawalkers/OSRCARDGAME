import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Choice } from "@/components/game/Choice";
import { GameShell } from "@/components/game/GameShell";
import { SAMPLE_HERO, mod } from "@/game/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vila")({
  head: () => ({
    meta: [
      { title: "Pedra-Funda — Mesa Vazia" },
      { name: "description", content: "Uma vila cercada por lobos: estalagem, mercado, igreja, ferraria, becos e gente que lembra de você." },
      { property: "og:title", content: "Pedra-Funda, a vila cercada — Mesa Vazia" },
      { property: "og:description", content: "Descanse, compre, aceite pedidos. À noite, os becos ficam perigosos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Village,
});

type Time = "Manhã" | "Tarde" | "Noite";
type PlaceId = "praca" | "estalagem" | "mercado" | "igreja" | "ferraria" | "becos";

const PLACES: { id: PlaceId; name: string; closedAtNight?: boolean; dangerAtNight?: boolean; text: string; glyph: string }[] = [
  { id: "praca", name: "Praça", text: "Um poço seco e um quadro de avisos coberto de nomes riscados. Alguém pregou ali o desenho de um lobo com olhos de gente.", glyph: "M-10 8 L10 8 M-6 8 L-6 -2 L6 -2 L6 8 M-8 -2 L0 -10 L8 -2" },
  { id: "estalagem", name: "Estalagem do Ganso Cego", text: "Fumaça, cerveja choca e um fogo que nunca apaga. A dona, Tess, cobra adiantado.", glyph: "M-10 10 L-10 -4 L0 -11 L10 -4 L10 10 Z M-4 10 L-4 2 L4 2 L4 10 M-14 -8 L-10 -8" },
  { id: "mercado", name: "Mercado", closedAtNight: true, text: "Bancas de lona e pouca coisa à venda. Os lobos cortaram as estradas há duas semanas.", glyph: "M-11 -4 L11 -4 L8 -10 L-8 -10 Z M-9 -4 L-9 10 M9 -4 L9 10 M-11 10 L11 10" },
  { id: "igreja", name: "Igreja de São Velmo", text: "O Padre Anselm reza alto demais, como quem quer abafar outra voz.", glyph: "M0 -14 L0 -6 M-3 -11 L3 -11 M-8 10 L-8 -2 L0 -6 L8 -2 L8 10 Z M-2 10 L-2 4 A2 2 0 0 1 2 4 L2 10" },
  { id: "ferraria", name: "Ferraria", closedAtNight: true, text: "Hesper martela de olhos fechados. Ela é cega há vinte anos e nunca errou um golpe.", glyph: "M-10 4 L10 4 L6 10 L-6 10 Z M-12 -2 L12 -2 L10 4 L-10 4 M4 -10 L10 -4" },
  { id: "becos", name: "Becos", dangerAtNight: true, text: "Passagens estreitas entre casas que se inclinam umas sobre as outras. Alguém sempre está olhando.", glyph: "M-10 10 L-10 -10 M10 10 L10 -10 M-10 -2 L-3 -2 M3 4 L10 4 M-2 10 L2 -10" },
];

const REL = ["Hostil", "Desconfiado", "Neutro", "Amigável", "Aliado"];

const NPCS: Record<PlaceId, { name: string; role: string; rel: number; ask?: string }[]> = {
  praca: [{ name: "Velho Corvin", role: "pregoeiro cego", rel: 2, ask: "Dizem que você cortou a corda de um enforcado. É verdade?" }],
  estalagem: [{ name: "Tess Ruiva", role: "estalajadeira", rel: 3 }, { name: "Estranho de capuz", role: "jogador de dados", rel: 2, ask: "Uma partida? Três moedas contra um segredo." }],
  mercado: [{ name: "Brum", role: "mercador gordo", rel: 2 }],
  igreja: [{ name: "Padre Anselm", role: "pároco", rel: 1, ask: "Traga-me a cabeça do lobo que fala, e Deus esquecerá o que você fez na estrada." }],
  ferraria: [{ name: "Hesper", role: "ferreira cega", rel: 4, ask: "O martelo do meu filho está na ruína ao norte. Traga-o de volta." }],
  becos: [{ name: "O Homem das Sombras", role: "receptador", rel: 0, ask: "Mercado negro. Venenos, chaves, nomes." }],
};

const GOODS = [
  { name: "Provisões (3 dias)", price: 6 },
  { name: "Poção de cura", price: 25 },
  { name: "Tocha ×3", price: 2 },
  { name: "Água benta", price: 18 },
  { name: "Corda (15 m)", price: 3 },
];

function TimeGlyph({ t }: { t: Time }) {
  return (
    <svg viewBox="-12 -12 24 24" className="size-5">
      {t === "Noite" ? (
        <path d="M4 -8 A8 8 0 1 0 8 4 A6 6 0 1 1 4 -8 Z" fill="currentColor" />
      ) : (
        <>
          <circle r={t === "Manhã" ? 4 : 5} fill="currentColor" />
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1="0" y1="7" x2="0" y2="10" stroke="currentColor" strokeWidth="1.4" transform={`rotate(${i * 45})`} />
          ))}
        </>
      )}
    </svg>
  );
}

function Village() {
  const [time, setTime] = useState<Time>("Tarde");
  const [place, setPlace] = useState<PlaceId>("ferraria");
  const p = PLACES.find((x) => x.id === place)!;
  const closed = time === "Noite" && p.closedAtNight;
  const discount = Math.max(0, mod(SAMPLE_HERO.attrs.CAR)) * 5;

  return (
    <GameShell location={`Vila · Pedra-Funda · ${time}`}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="label-mono text-blood">Situação · cercada por lobos</div>
            <h1 className="font-display text-5xl text-bone">Pedra-Funda</h1>
            <p className="mt-1 max-w-2xl font-narrative text-lg italic text-bone-dim">
              As portas fecham cedo. Toda noite, os uivos chegam um pouco mais perto da paliçada.
            </p>
          </div>
          <div className="flex rounded-sm border border-border/60 p-0.5">
            {(["Manhã", "Tarde", "Noite"] as Time[]).map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={cn(
                  "flex items-center gap-2 rounded-sm px-3 py-1.5",
                  time === t ? (t === "Noite" ? "bg-violet/20 text-violet" : "bg-ember/15 text-ember") : "text-bone-dim hover:text-bone",
                )}
              >
                <TimeGlyph t={t} />
                <span className="label-mono">{t}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* lugares */}
          <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {PLACES.map((pl) => {
              const isClosed = time === "Noite" && pl.closedAtNight;
              const danger = time === "Noite" && pl.dangerAtNight;
              return (
                <li key={pl.id}>
                  <button
                    onClick={() => setPlace(pl.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-sm border px-3 py-3 text-left transition-all",
                      place === pl.id ? "border-ember bg-ember/10" : "border-border/60 hover:border-bone/40",
                      isClosed && "opacity-45",
                    )}
                  >
                    <svg viewBox="-14 -14 28 28" className={cn("size-8 shrink-0", danger ? "text-blood" : "text-bone")}>
                      <path d={pl.glyph} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    <span className="flex-1">
                      <span className="block font-display text-lg leading-tight text-bone">{pl.name}</span>
                      <span className="label-mono text-[0.58rem] text-bone-dim">
                        {isClosed ? "fechado" : danger ? "perigoso à noite" : `${NPCS[pl.id].length} pessoa(s)`}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* lugar selecionado */}
          <section key={place + time} className="animate-rise">
            <h2 className="font-display text-4xl text-bone">{p.name}</h2>
            <p className="drop-cap mt-4 max-w-2xl font-narrative text-[1.25rem] leading-relaxed text-bone">
              {closed ? "As portas estão trancadas e a forja, fria. Volte de manhã — se ainda houver manhã." : p.text}
            </p>

            {!closed && (
              <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <div>
                  <div className="label-mono mb-3 text-bone-dim">Gente aqui</div>
                  <div className="space-y-3">
                    {NPCS[place].map((n) => (
                      <div key={n.name} className="paper rounded-sm p-4">
                        <div className="relative z-10">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-display text-xl text-ink">{n.name}</div>
                              <div className="font-narrative italic text-ink-faded">{n.role}</div>
                            </div>
                            <div className="text-right">
                              <div className="flex gap-0.5">
                                {REL.map((_, i) => (
                                  <span key={i} className={cn("size-2 rotate-45 border border-ink/50", i <= n.rel && (n.rel <= 1 ? "bg-ink-red" : "bg-ink"))} />
                                ))}
                              </div>
                              <div className={cn("label-mono mt-1 text-[0.55rem]", n.rel <= 1 ? "text-ink-red" : "text-ink-faded")}>{REL[n.rel]}</div>
                            </div>
                          </div>
                          {n.ask && <p className="mt-3 border-l-2 border-ink-red/50 pl-3 font-narrative italic text-ink">“{n.ask}”</p>}
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button variant="ink" size="sm">Conversar</Button>
                            {n.ask && <Button variant="inkSolid" size="sm">Aceitar pedido</Button>}
                            <Button variant="ink" size="sm" className="text-ink-red">Ameaçar · CAR</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {place === "mercado" || place === "ferraria" ? (
                    <>
                      <div className="label-mono mb-3 flex justify-between text-bone-dim">
                        <span>À venda</span>
                        {discount > 0 && <span className="text-rot">−{discount}% por Carisma</span>}
                      </div>
                      <ul className="rounded-sm border border-border/60">
                        {(place === "ferraria"
                          ? [{ name: "Machado de batalha (d8)", price: 40 }, { name: "Martelo de guerra (d8)", price: 45 }, { name: "Montante (d10)", price: 70 }, { name: "Armadura de placas (CA 16)", price: 120 }]
                          : GOODS
                        ).map((g) => {
                          const price = Math.round(g.price * (1 - discount / 100));
                          return (
                            <li key={g.name} className="flex items-center justify-between border-b border-border/40 px-4 py-2.5 last:border-0">
                              <span className="font-body text-bone">{g.name}</span>
                              <span className="flex items-center gap-3">
                                <span className="font-mono text-sm text-ember">{price} o</span>
                                <Button variant="bone" size="sm" disabled={price > SAMPLE_HERO.gold}>Comprar</Button>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    <>
                      <div className="label-mono mb-1 text-bone-dim">O que fazer</div>
                      {place === "estalagem" && (
                        <>
                          <Choice check="5 ouro">Pagar um quarto e dormir até a manhã.</Choice>
                          <Choice check="CAR · CD 11">Ouvir rumores no balcão.</Choice>
                          <Choice check="d20 vs estranho" tone="violet">Aceitar a partida de dados do estranho.</Choice>
                        </>
                      )}
                      {place === "igreja" && (
                        <>
                          <Choice check="SAB · CD 10">Rezar e recuperar as orações.</Choice>
                          <Choice check="−1 corrupção · 15 ouro">Confessar-se ao Padre Anselm.</Choice>
                          <Choice tone="violet" check="+2 corrupção">Roubar o cálice do altar.</Choice>
                        </>
                      )}
                      {place === "praca" && (
                        <>
                          <Choice>Ler os avisos pregados no poço.</Choice>
                          <Choice check="SAB · CD 12">Observar quem entra e quem sai.</Choice>
                        </>
                      )}
                      {place === "becos" && (
                        <>
                          <Choice check="DES · CD 12" tone={time === "Noite" ? "blood" : undefined}>Seguir o vulto de capuz.</Choice>
                          <Choice tone="violet">Comprar no mercado negro.</Choice>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3 border-t border-border/50 pt-5">
              <Button asChild variant="ember">
                <Link to="/mapa">Deixar a vila</Link>
              </Button>
              <Button variant="bone" onClick={() => setTime(time === "Manhã" ? "Tarde" : time === "Tarde" ? "Noite" : "Manhã")}>
                Esperar · passar o tempo
              </Button>
            </div>
          </section>
        </div>
      </div>
    </GameShell>
  );
}
