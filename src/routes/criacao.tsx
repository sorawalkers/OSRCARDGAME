import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { CharacterSheet } from "@/components/game/CharacterSheet";
import { D20 } from "@/components/game/D20";
import {
  ATTRS,
  BACKGROUNDS,
  CLASSES,
  FLAWS,
  MOTIVATIONS,
  NAMES,
  RACES,
  VIRTUES,
  fmtMod,
  mod,
  roll3d6,
  type AttrKey,
} from "@/game/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/criacao")({
  head: () => ({
    meta: [
      { title: "Criação do herói — Mesa Vazia" },
      { name: "description", content: "Role 3d6 para os seis atributos, escolha raça, classe, antecedente, traços e a motivação do seu herói." },
      { property: "og:title", content: "Criação do herói — Mesa Vazia" },
      { property: "og:description", content: "A ficha de papel se preenche enquanto você decide quem vai morrer primeiro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Creation,
});

const STEPS = ["Atributos", "Raça", "Classe", "Antecedente", "Traços", "Nome e motivação"];

const rollAll = () => Object.fromEntries(ATTRS.map((a) => [a.key, roll3d6()])) as Record<AttrKey, number>;

function Option({
  active,
  disabled,
  onClick,
  title,
  sub,
  aside,
}: {
  active?: boolean | undefined;
  disabled?: boolean | undefined;
  onClick: () => void;
  title: string;
  sub?: string | undefined;
  aside?: string | undefined;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-sm border px-4 py-3 text-left transition-all",
        active ? "border-ember bg-ember/10 shadow-[var(--shadow-ember)]" : "border-border/60 hover:border-bone/40 hover:bg-accent/40",
        disabled && "cursor-not-allowed opacity-35 hover:border-border/60 hover:bg-transparent",
      )}
    >
      <span className={cn("mt-2 size-2 shrink-0 rotate-45 border", active ? "border-ember bg-ember" : "border-bone-dim")} />
      <span className="flex-1">
        <span className="font-display text-lg text-bone">{title}</span>
        {sub && <span className="block font-body text-sm text-bone-dim">{sub}</span>}
      </span>
      {aside && <span className="label-mono mt-1.5 text-ember">{aside}</span>}
    </button>
  );
}

function Creation() {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"ordem" | "distribuir">("ordem");
  const [base, setBase] = useState<Record<AttrKey, number>>({ FOR: 13, DES: 10, CON: 14, INT: 8, SAB: 11, CAR: 12 });
  const [rolling, setRolling] = useState(0);
  const [swap, setSwap] = useState<AttrKey | null>(null);
  const [raceId, setRaceId] = useState<string>();
  const [classId, setClassId] = useState<string>();
  const [bg, setBg] = useState<string>();
  const [virtues, setVirtues] = useState<string[]>([]);
  const [flaws, setFlaws] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [motivation, setMotivation] = useState<string>();

  const race = RACES.find((r) => r.id === raceId);
  const cls = CLASSES.find((c) => c.id === classId);

  const attrs = useMemo(() => {
    const out = { ...base };
    if (race) for (const [k, v] of Object.entries(race.mods)) out[k as AttrKey] = Math.min(18, Math.max(3, out[k as AttrKey] + (v ?? 0)));
    if (race?.id === "humano") {
      const k = cls?.main ?? "FOR";
      out[k] = Math.min(18, out[k] + 2);
    }
    return out;
  }, [base, race, cls]);

  const points = 1 + flaws.length - virtues.reduce((s, v) => s + (VIRTUES.find((x) => x.name === v)?.cost ?? 0), 0);

  const armorBase = cls ? ({ guerreiro: 15, clerigo: 15, ladrao: 12, mago: 10 } as Record<string, number>)[cls.id] : undefined;
  const sheet = {
    name: name || undefined,
    race: race?.name,
    cls: cls?.name,
    background: bg,
    motivation,
    level: cls ? 1 : undefined,
    xp: 0,
    attrs,
    hp: cls ? cls.baseHp + mod(attrs.CON) * 3 : undefined,
    hpMax: cls ? cls.baseHp + mod(attrs.CON) * 3 : undefined,
    ac: armorBase !== undefined ? armorBase + mod(attrs.DES) : undefined,
    attack: cls ? (cls.id === "guerreiro" ? 1 : 0) : undefined,
    weapon: cls?.gear.split(",")[0],
    armor: cls ? cls.gear.split(",").slice(1).join(",").trim() : undefined,
    virtues,
    flaws,
    saves: cls?.saves,
    highlight: cls?.main,
  };

  const doRoll = () => {
    setBase(rollAll());
    setRolling((r) => r + 1);
    setSwap(null);
  };

  const clickAttr = (k: AttrKey) => {
    if (mode !== "distribuir") return;
    if (!swap) return setSwap(k);
    setBase((b) => ({ ...b, [swap]: b[k], [k]: b[swap] }));
    setSwap(null);
  };

  const canNext = [true, !!race, !!cls, !!bg, points >= 0, !!name && !!motivation][step];

  return (
    <div className="vignette min-h-screen">
      <header className="relative z-10 border-b border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="font-display text-lg text-bone hover:text-ember">
            Mesa Vazia
          </Link>
          <span className="label-mono text-bone-dim">Criação do herói · etapa {step + 1} de 6</span>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[200px_1fr_440px]">
        {/* etapas */}
        <ol className="flex gap-2 overflow-x-auto scrollbar-none lg:flex-col lg:gap-0">
          {STEPS.map((s, i) => (
            <li key={s}>
              <button
                onClick={() => i <= step && setStep(i)}
                className={cn(
                  "flex w-full items-center gap-3 whitespace-nowrap py-2.5 text-left transition-colors lg:border-l-2 lg:pl-4",
                  i === step ? "border-ember text-ember-glow" : i < step ? "border-bone-dim/40 text-bone" : "border-border/40 text-bone-dim/50",
                )}
              >
                <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-lg">{s}</span>
              </button>
            </li>
          ))}
        </ol>

        {/* conteúdo da etapa */}
        <section key={step} className="animate-rise">
          {step === 0 && (
            <>
              <h2 className="font-display text-4xl text-bone">Os seis atributos</h2>
              <p className="mt-2 max-w-xl font-narrative text-lg italic text-bone-dim">
                Três dados de seis faces para cada um. O que o destino der, você carrega.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex rounded-sm border border-border/60 p-0.5">
                  {(["ordem", "distribuir"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={cn("label-mono rounded-sm px-3 py-1.5", mode === m ? "bg-ember/15 text-ember" : "text-bone-dim hover:text-bone")}
                    >
                      {m === "ordem" ? "Em ordem" : "Distribuir"}
                    </button>
                  ))}
                </div>
                <Button variant="ember" onClick={doRoll}>
                  Rolar 3d6 ×6
                </Button>
                {mode === "distribuir" && <span className="label-mono text-bone-dim">clique em dois para trocar</span>}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ATTRS.map((a, i) => (
                  <button
                    key={a.key}
                    onClick={() => clickAttr(a.key)}
                    className={cn(
                      "flex items-center gap-4 rounded-sm border bg-card/60 p-4 text-left transition-all",
                      swap === a.key ? "border-ember shadow-[var(--shadow-ember)]" : "border-border/60",
                      mode === "distribuir" && "cursor-pointer hover:border-bone/40",
                      mode === "ordem" && "cursor-default",
                    )}
                  >
                    <D20 value={base[a.key]} size={54} tone={base[a.key] >= 15 ? "ember" : base[a.key] <= 6 ? "blood" : "bone"} rolling={rolling > 0} key={`${rolling}-${i}`} />
                    <div>
                      <div className="font-display text-xl text-bone">
                        {a.key} <span className="font-mono text-sm text-ember">{fmtMod(mod(base[a.key]))}</span>
                      </div>
                      <div className="text-sm text-bone-dim">{a.name}</div>
                      <div className="text-xs text-bone-dim/70">{a.use}</div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="label-mono mt-6 text-bone-dim/70">3 = −3 · 4–5 = −2 · 6–8 = −1 · 9–12 = 0 · 13–15 = +1 · 16–17 = +2 · 18 = +3</p>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="font-display text-4xl text-bone">De que sangue você vem?</h2>
              <div className="mt-6 grid gap-2">
                {RACES.map((r) => (
                  <Option key={r.id} active={raceId === r.id} onClick={() => setRaceId(r.id)} title={r.name} sub={r.trait} aside={r.adjust} />
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-display text-4xl text-bone">O que você faz para sobreviver?</h2>
              <div className="mt-6 grid gap-2">
                {CLASSES.map((c) => {
                  const blocked = c.id === "mago" && race?.noMage;
                  return (
                    <Option
                      key={c.id}
                      disabled={blocked}
                      active={classId === c.id}
                      onClick={() => setClassId(c.id)}
                      title={c.name}
                      sub={blocked ? `${race?.name} não pode ser Mago.` : `${c.ability}. ${c.gear}.`}
                      aside={`${c.main} · ${c.hitDie}`}
                    />
                  );
                })}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="font-display text-4xl text-bone">Quem você era antes?</h2>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {BACKGROUNDS.map((b) => (
                  <Option key={b.name} active={bg === b.name} onClick={() => setBg(b.name)} title={b.name} sub={b.bonus} />
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="flex items-end justify-between">
                <h2 className="font-display text-4xl text-bone">Virtudes e defeitos</h2>
                <div className="text-right">
                  <div className={cn("font-mono text-3xl", points < 0 ? "text-blood" : "text-ember")}>{points}</div>
                  <div className="label-mono text-bone-dim">pontos</div>
                </div>
              </div>
              <p className="mt-2 font-narrative text-lg italic text-bone-dim">Cada defeito aceito vale um ponto. No máximo dois.</p>
              <h3 className="label-mono mt-6 text-rot">Virtudes</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {VIRTUES.map((v) => (
                  <Option
                    key={v.name}
                    active={virtues.includes(v.name)}
                    onClick={() => setVirtues((s) => (s.includes(v.name) ? s.filter((x) => x !== v.name) : [...s, v.name]))}
                    title={v.name}
                    aside={`${v.cost} pt`}
                  />
                ))}
              </div>
              <h3 className="label-mono mt-6 text-blood">Defeitos</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {FLAWS.map((f) => (
                  <Option
                    key={f}
                    active={flaws.includes(f)}
                    disabled={!flaws.includes(f) && flaws.length >= 2}
                    onClick={() => setFlaws((s) => (s.includes(f) ? s.filter((x) => x !== f) : [...s, f]))}
                    title={f}
                    aside="+1"
                  />
                ))}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="font-display text-4xl text-bone">Como vão chamar você no epitáfio?</h2>
              <div className="mt-6 flex gap-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Escreva um nome…"
                  className="flex-1 border-b border-bone/30 bg-transparent px-1 py-2 font-narrative text-2xl italic text-bone placeholder:text-bone-dim/50 focus:border-ember focus:outline-none"
                />
                <Button variant="bone" onClick={() => setName(NAMES[Math.floor(Math.random() * NAMES.length)] ?? "Aldric")}>
                  Sortear
                </Button>
              </div>
              <h3 className="label-mono mt-8 text-bone-dim">Por que você está na estrada?</h3>
              <div className="mt-2 grid gap-2">
                {MOTIVATIONS.map((m) => (
                  <Option key={m} active={motivation === m} onClick={() => setMotivation(m)} title={m} />
                ))}
              </div>
            </>
          )}

          <div className="mt-10 flex items-center justify-between border-t border-border/50 pt-5">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="font-display text-base text-bone-dim">
              ← Voltar
            </Button>
            {step < 5 ? (
              <Button variant="ember" size="lg" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
                Próxima etapa →
              </Button>
            ) : (
              <Button asChild variant="ember" size="lg" disabled={!canNext}>
                <Link to="/mapa">Começar a campanha</Link>
              </Button>
            )}
          </div>
        </section>

        {/* ficha ao vivo */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <CharacterSheet data={sheet} className="rotate-[0.8deg]" />
        </aside>
      </div>
    </div>
  );
}
