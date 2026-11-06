import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Candle } from "@/components/game/Candle";
import { SAMPLE_HERO } from "@/game/data";

export const Route = createFileRoute("/epitafio")({
  head: () => ({
    meta: [
      { title: "Epitáfio — Mesa Vazia" },
      { name: "description", content: "O herói morreu. O mundo lembra: o túmulo pode aparecer na estrada do próximo." },
      { property: "og:title", content: "Aqui jaz — Mesa Vazia" },
      { property: "og:description", content: "Epitáfio, causa da morte e o legado deixado para o próximo herói." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Epitaph,
});

const FALLEN = [
  { name: "Aldric, o Manco", line: "Anão Clérigo · nv 3", cause: "A Mãe das Moscas, Charneca", fate: "Fantasma" },
  { name: "Isolde Crane", line: "Elfa Maga · nv 1", cause: "Fome, Campos de Cinza", fate: "Túmulo" },
  { name: "Hob", line: "Halfling Ladrão · nv 4", cause: "O Bispo Sem Rosto", fate: "Lenda" },
];

function Epitaph() {
  const h = SAMPLE_HERO;
  return (
    <div className="vignette min-h-screen">
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 py-14">
        <div className="label-mono text-blood">A vela apagou</div>
        <h1 className="mt-2 text-center font-display text-5xl text-bone">E o mundo lembrará</h1>

        <div className="relative mt-12 flex items-end gap-6">
          <Candle height={90} className="hidden sm:block" />
          {/* lápide */}
          <div
            className="relative w-[min(88vw,380px)] bg-[linear-gradient(170deg,var(--bone-dim),var(--secondary))] px-8 pb-12 pt-16 text-center shadow-[var(--shadow-paper)]"
            style={{ borderRadius: "190px 190px 6px 6px" }}
          >
            <div className="absolute inset-3 border border-ink/30" style={{ borderRadius: "180px 180px 4px 4px" }} />
            <svg viewBox="0 0 40 40" className="mx-auto size-10 text-ink/70">
              <path d="M20 4 L20 36 M10 14 L30 14" stroke="currentColor" strokeWidth="2.5" fill="none" />
            </svg>
            <div className="label-mono mt-4 text-ink/70">Aqui jaz</div>
            <div className="mt-1 font-display text-4xl text-ink">{h.name}</div>
            <div className="mt-1 font-narrative italic text-ink/80">
              {h.race} {h.cls} · nível {h.level}
              <br />
              {h.background}
            </div>
            <div className="mx-auto my-5 h-px w-24 bg-ink/40" />
            <p className="font-narrative text-lg italic leading-snug text-ink">
              Queria {h.motivation.charAt(0).toLowerCase() + h.motivation.slice(1)}.
              <br />
              Não chegou ao mar.
            </p>
            <div className="mx-auto my-5 h-px w-24 bg-ink/40" />
            <p className="font-body text-sm text-ink/80">
              Morta pela Mãe das Moscas, no Coração da Charneca dos Enforcados, ao fim do terceiro dia.
            </p>
            <div className="label-mono mt-5 text-[0.6rem] text-ink/60">112 XP · 47 ouro · 9 passos</div>
          </div>
          <Candle height={70} className="hidden sm:block" />
        </div>
        <div className="h-6 w-[min(96vw,460px)] rounded-[50%] bg-table blur-sm" />

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild variant="ember" size="lg">
            <Link to="/criacao">Um novo herói se senta à mesa</Link>
          </Button>
          <Button asChild variant="bone" size="lg">
            <Link to="/">Levantar da mesa</Link>
          </Button>
        </div>

        {/* legado */}
        <section className="mt-16 w-full">
          <div className="label-mono mb-4 text-center text-bone-dim">O cemitério dos que vieram antes</div>
          <div className="grid gap-4 sm:grid-cols-3">
            {FALLEN.map((f) => (
              <div key={f.name} className="rounded-t-[80px] border border-border/60 bg-card/50 px-5 pb-5 pt-8 text-center">
                <div className="font-display text-xl text-bone">{f.name}</div>
                <div className="font-narrative italic text-bone-dim">{f.line}</div>
                <div className="mt-2 text-sm text-bone-dim/80">{f.cause}</div>
                <div className="label-mono mt-3 text-violet">Volta como {f.fate}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center font-narrative italic text-bone-dim">
            Na estrada do próximo herói, um destes túmulos pode aparecer. Orar herda uma carta. Saquear pode despertar o espectro.
          </p>
        </section>
      </div>
    </div>
  );
}
