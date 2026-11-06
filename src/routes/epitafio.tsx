import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Candle } from "@/components/game/Candle";
import { heroLine } from "@/game/hero";
import { game, useGame, useGraves } from "@/game/store";

export const Route = createFileRoute("/epitafio")({
  head: () => ({
    meta: [
      { title: "Epitáfio — Mesa Vazia" },
      {
        name: "description",
        content: "O herói morreu. O mundo lembra: o túmulo pode aparecer na estrada do próximo.",
      },
      { property: "og:title", content: "Aqui jaz — Mesa Vazia" },
      {
        property: "og:description",
        content: "Epitáfio, causa da morte e o legado deixado para o próximo herói.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Epitaph,
});

const ORDINAL = [
  "primeiro",
  "segundo",
  "terceiro",
  "quarto",
  "quinto",
  "sexto",
  "sétimo",
  "oitavo",
  "nono",
  "décimo",
];
const dayText = (d: number) =>
  d <= ORDINAL.length ? `ao fim do ${ORDINAL[d - 1]} dia` : `no dia ${d}`;

function Epitaph() {
  const s = useGame();
  const graves = useGraves();
  const h = s.death ? s.hero : null;
  // os que vieram antes: o herói desta lápide não se repete na lista
  const before = h ? graves.slice(1) : graves;
  return (
    <div className="vignette min-h-screen">
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 py-14">
        <div className="label-mono text-blood">A vela apagou</div>
        <h1 className="mt-2 text-center font-display text-5xl text-bone">E o mundo lembrará</h1>

        {h && s.death ? (
          <>
            <div className="relative mt-12 flex items-end gap-6">
              <Candle height={90} className="hidden sm:block" />
              {/* lápide */}
              <div
                className="relative w-[min(88vw,380px)] bg-[linear-gradient(170deg,var(--bone-dim),var(--secondary))] px-8 pb-12 pt-16 text-center shadow-[var(--shadow-paper)]"
                style={{ borderRadius: "190px 190px 6px 6px" }}
              >
                <div
                  className="absolute inset-3 border border-ink/30"
                  style={{ borderRadius: "180px 180px 4px 4px" }}
                />
                <svg viewBox="0 0 40 40" className="mx-auto size-10 text-ink/70">
                  <path
                    d="M20 4 L20 36 M10 14 L30 14"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="none"
                  />
                </svg>
                <div className="label-mono mt-4 text-ink/70">Aqui jaz</div>
                <div className="mt-1 font-display text-4xl text-ink">{h.name}</div>
                <div className="mt-1 font-narrative italic text-ink/80">
                  {heroLine(h)} · nível {h.level}
                  <br />
                  {h.background}
                </div>
                <div className="mx-auto my-5 h-px w-24 bg-ink/40" />
                <p className="font-narrative text-lg italic leading-snug text-ink">
                  Queria {h.motivation.charAt(0).toLowerCase() + h.motivation.slice(1)}.
                  <br />
                  Não chegou lá.
                </p>
                <div className="mx-auto my-5 h-px w-24 bg-ink/40" />
                <p className="font-body text-sm text-ink/80">
                  {s.death.cause.charAt(0).toUpperCase() + s.death.cause.slice(1)}, em{" "}
                  {s.death.place}, {dayText(s.death.day)}.
                </p>
                <div className="label-mono mt-5 text-[0.6rem] text-ink/60">
                  {h.xp} XP · {h.gold} ouro · {s.step} {s.step === 1 ? "passo" : "passos"}
                </div>
              </div>
              <Candle height={70} className="hidden sm:block" />
            </div>
            <div className="h-6 w-[min(96vw,460px)] rounded-[50%] bg-table blur-sm" />
          </>
        ) : (
          <p className="mt-10 max-w-md text-center font-narrative text-xl italic text-bone-dim">
            {s.hero
              ? `${s.hero.name} ainda respira. A vela continua acesa.`
              : "Nenhuma vela apagou nesta mesa ainda."}
          </p>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild variant="ember" size="lg">
            <Link to="/criacao" onClick={() => s.death && game.clear()}>
              Um novo herói se senta à mesa
            </Link>
          </Button>
          <Button asChild variant="bone" size="lg">
            <Link to="/">Levantar da mesa</Link>
          </Button>
        </div>

        {/* legado */}
        <section className="mt-16 w-full">
          <div className="label-mono mb-4 text-center text-bone-dim">
            O cemitério dos que vieram antes
          </div>
          {before.length === 0 ? (
            <p className="text-center font-narrative italic text-bone-dim">
              Ninguém veio antes. Ainda.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              {before.map((f, i) => (
                <div
                  key={`${f.name}-${i}`}
                  className="rounded-t-[80px] border border-border/60 bg-card/50 px-5 pb-5 pt-8 text-center"
                >
                  <div className="font-display text-xl text-bone">{f.name}</div>
                  <div className="font-narrative italic text-bone-dim">
                    {f.line} · nv {f.level}
                  </div>
                  <div className="mt-2 text-sm text-bone-dim/80">
                    {f.cause}, em {f.place}
                  </div>
                  <div className="label-mono mt-3 text-violet">Dia {f.day}</div>
                </div>
              ))}
            </div>
          )}
          <p className="mt-6 text-center font-narrative italic text-bone-dim">
            Na estrada do próximo herói, um destes túmulos pode aparecer. Orar herda uma carta.
            Saquear pode despertar o espectro.
          </p>
        </section>
      </div>
    </div>
  );
}
