import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { D20 } from "@/components/game/D20";
import { GameCard } from "@/components/game/GameCard";
import { GameShell } from "@/components/game/GameShell";
import { IntentSeal } from "@/components/game/IntentSeal";
import { MonsterPlate } from "@/components/game/MonsterPlate";
import {
  DECK,
  MONSTERS,
  fmtMod,
  mod,
  prepArticle,
  roll,
  withArticle,
  type Card,
  type Intent,
} from "@/game/data";
import {
  armorClass,
  attackBonus,
  saveBonus,
  saveTarget,
  type Hero,
  type SaveKind,
} from "@/game/hero";
import { game, getState, useGame } from "@/game/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/combate")({
  validateSearch: (s: Record<string, unknown>) => ({
    m: typeof s["m"] === "string" ? s["m"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Combate — Mesa Vazia" },
      {
        name: "description",
        content:
          "Compre três cartas, jogue uma, role o d20. O inimigo mostra o que vai fazer antes de agir.",
      },
      { property: "og:title", content: "Combate com cartas — Mesa Vazia" },
      {
        property: "og:description",
        content: "Cartas de ação, d20 contra a Defesa e golpes narrados.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Combat,
});

function rollDice(expr: string) {
  const m = expr.match(/(\d+)d(\d+)([+-]\d+)?/);
  if (!m) return 0;
  let t = 0;
  for (let i = 0; i < Number(m[1]); i++) t += roll(Number(m[2]));
  return t + Number(m[3] ?? 0);
}

const draw = () => [...DECK].sort(() => Math.random() - 0.5).slice(0, 3);

type Line = { who: "hero" | "foe" | "gm"; text: string };

// teste de resistência pedido por cada intenção do inimigo
const SAVE_FOR: Partial<Record<Intent, SaveKind>> = {
  envenenar: "veneno",
  enfraquecer: "paralisia",
  amaldicoar: "magia",
};

function Combat() {
  const { hero } = useGame();
  if (!hero) return <GameShell location="Combate">{null}</GameShell>;
  return <CombatInner hero={hero} />;
}

function CombatInner({ hero }: { hero: Hero }) {
  const { m } = Route.useSearch();
  const foe = MONSTERS.find((x) => x.id === m) ?? MONSTERS[0]!;
  const [foeHp, setFoeHp] = useState(foe.hp);
  const hp = hero.hp;
  // dentro dos timeouts, o herói atual vem do estado (as props podem estar velhas)
  const cur = () => getState().hero ?? hero;
  const [reward, setReward] = useState<{ xp: number; gold: number } | null>(null);
  const rewarded = useRef(false);
  const [block, setBlock] = useState(0);
  const [focus, setFocus] = useState(0);
  const [hand, setHand] = useState<Card[]>(() => DECK.slice(0, 3));
  const [turn, setTurn] = useState(0);
  const [busy, setBusy] = useState(false);
  const [die, setDie] = useState<{ v: number; ok: boolean; key: number; label: string } | null>(
    null,
  );
  const [hurt, setHurt] = useState(0);
  const [lines, setLines] = useState<Line[]>([
    { who: "gm", text: `${foe.name} surge à sua frente. ${foe.lore}` },
  ]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHand(draw());
  }, []);
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const intent = foe.intents[turn % foe.intents.length]!;
  const say = (l: Line) => setLines((s) => [...s, l]);
  const over = foeHp <= 0 || hp <= 0;

  // refs evitam efeitos duplicados e leituras velhas dentro dos timeouts
  const foeHpRef = useRef(foe.hp);
  const blockRef = useRef(0);
  const setFoe = (n: number) => {
    foeHpRef.current = n;
    setFoeHp(n);
  };

  const foeAct = (currentIntent: typeof intent) => {
    const block = blockRef.current;
    if (currentIntent === "atacar") {
      const d = roll(20);
      const total = d + foe.hit;
      const ac = armorClass(cur()) + (block > 0 ? 2 : 0);
      if (d === 20 || total >= ac) {
        const dmg = Math.max(0, rollDice(foe.damage) * (d === 20 ? 2 : 1) - block);
        game.hurt(dmg, `abatido ${prepArticle("por", foe.name)}`);
        say({
          who: "foe",
          text: `${foe.name} avança e acerta (d20 ${d}+${foe.hit} = ${total} contra CA ${ac}) · ${dmg} de dano`,
        });
      } else
        say({
          who: "foe",
          text: `${foe.name} ataca, mas encontra só aço e ar (${total} contra CA ${ac}).`,
        });
    } else if (currentIntent === "curar") {
      setFoe(Math.min(foe.hp, foeHpRef.current + 6));
      say({ who: "foe", text: `${foe.name} se recompõe · cura 6` });
    } else if (currentIntent === "proteger" || currentIntent === "fortalecer") {
      say({ who: "foe", text: `${foe.name} se prepara. A próxima investida vai doer mais.` });
    } else {
      const kind = SAVE_FOR[currentIntent] ?? "veneno";
      const h = cur();
      const d = roll(20);
      const b = saveBonus(h, kind);
      const target = saveTarget(h, kind);
      const ok = d === 20 || (d !== 1 && d + b >= target);
      const verb =
        currentIntent === "envenenar"
          ? "envenenar"
          : currentIntent === "enfraquecer"
            ? "enfraquecer"
            : "amaldiçoar";
      const roll_ = `resistência contra ${kind}: d20 ${d} ${fmtMod(b)} = ${d + b} contra ${target}`;
      if (ok) say({ who: "foe", text: `${foe.name} tenta ${verb} você — ${roll_}: resistiu.` });
      else if (currentIntent === "amaldicoar") {
        game.corrupt(1, `corrompido ${prepArticle("por", foe.name)}`);
        say({
          who: "foe",
          text: `${foe.name} sussurra o seu nome — ${roll_}: falhou · +1 de corrupção`,
        });
      } else {
        game.hurt(
          3,
          `${currentIntent === "envenenar" ? "envenenado" : "abatido"} ${prepArticle("por", foe.name)}`,
        );
        say({ who: "foe", text: `${roll_}: falhou. A ferida arde · 3 de dano` });
      }
    }
    blockRef.current = 0;
    setBlock(0);
    setTurn((t) => t + 1);
    setHand(draw());
    setBusy(false);
  };

  const play = (c: Card) => {
    if (busy || over) return;
    setBusy(true);
    const currentIntent = intent;
    let success = true;
    let crit = false;
    if (c.attr) {
      const d = roll(20);
      const isAtk = c.type === "Ataque";
      const h = cur();
      const bonus = mod(h.attrs[c.attr]) + (isAtk ? attackBonus(h) : 0) + focus;
      const target = c.dc === "Defesa" ? foe.defense : c.dc === "Resist." ? 12 : Number(c.dc);
      crit = d === 20;
      success = crit || (d !== 1 && d + bonus >= target);
      setDie({
        v: d,
        ok: success,
        key: Date.now(),
        label: `${d} ${fmtMod(bonus)} = ${d + bonus} vs ${target}`,
      });
      setFocus(0);
      say({
        who: "hero",
        text: `${c.name}: d20 ${d} ${fmtMod(bonus)} = ${d + bonus} contra ${target} · ${crit ? "crítico!" : d === 1 ? "desastre" : success ? "sucesso" : "falha"}`,
      });
    } else setDie(null);

    setTimeout(
      () => {
        if (c.damage) {
          const dmg = success
            ? c.damage * (crit ? 2 : 1) + roll(3) - 1
            : c.id === "estocada"
              ? 1
              : 0;
          if (dmg > 0) {
            const n = Math.max(0, foeHpRef.current - dmg);
            setFoe(n);
            setHurt((x) => x + 1);
            say({ who: "hero", text: `Você crava a lâmina · ${dmg} de dano` });
            if (n === 0) say({ who: "gm", text: foe.deathLine });
          }
        }
        if (c.block) {
          blockRef.current = c.block;
          setBlock(c.block);
          say({ who: "hero", text: `Você ergue o escudo · bloqueia ${c.block}` });
        }
        if (c.heal && success) {
          game.heal(c.heal);
          say({ who: "hero", text: `Uma luz morna fecha a ferida · cura ${c.heal}` });
        }
        if (c.id === "foco") {
          setFocus(3);
          say({
            who: "hero",
            text: "Você respira fundo. O mundo desacelera · +3 na próxima rolagem",
          });
        }
        if (c.id === "sono" && success) {
          say({ who: "gm", text: `${foe.name} cambaleia e cai num sono pesado. Perde o turno.` });
          setTimeout(() => {
            setTurn((t) => t + 1);
            setHand(draw());
            setBusy(false);
          }, 500);
          return;
        }
        setTimeout(() => {
          if (foeHpRef.current > 0) foeAct(currentIntent);
          else setBusy(false);
        }, 700);
      },
      c.attr ? 900 : 200,
    );
  };

  const flee = () => {
    const h = cur();
    const d = roll(20) + mod(h.attrs.DES) - (h.flaws.includes("Manco") ? 4 : 0);
    if (d >= 10) {
      say({ who: "gm", text: `Você corre (DES ${d} contra 10) e a névoa o engole.` });
      game.log("Fuga", `Fugiu ${prepArticle("de", foe.name)} em ${getState().place}.`);
      setFoe(-1);
    } else {
      say({ who: "gm", text: `Você tenta fugir (DES ${d} contra 10), mas tropeça.` });
      setBusy(true);
      const currentIntent = intent;
      setTimeout(() => foeAct(currentIntent), 600);
    }
  };

  // vitória: XP e ouro uma vez só
  useEffect(() => {
    if (foeHp !== 0 || rewarded.current) return;
    rewarded.current = true;
    const xp = foe.kind === "chefe" ? 50 : foe.kind === "forte" ? 20 : 8;
    const gold = roll(12) + 4;
    game.gainXp(xp);
    game.gainGold(gold);
    game.log(
      "Combate",
      `Derrotou ${withArticle(foe.name)} em ${getState().place}. ${foe.deathLine}`,
    );
    setReward({ xp, gold });
  }, [foeHp, foe]);

  const canFlee = foe.kind === "normal";
  const foePct = (Math.max(0, foeHp) / foe.hp) * 100;

  return (
    <GameShell location={`Combate · ${foe.name}`} allowDead>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_300px]">
        <section className="flex flex-col items-center">
          {/* inimigo */}
          <div className="flex w-full max-w-xl flex-col items-center">
            <div className="mb-4">
              {!over && (
                <IntentSeal intent={intent} value={intent === "atacar" ? foe.damage : undefined} />
              )}
            </div>
            <div
              className={cn(
                "w-60 sm:w-64",
                foeHp <= 0 && "opacity-40 grayscale transition-all duration-700",
              )}
            >
              <MonsterPlate monster={foe} hurt={hurt > 0} key={hurt} />
            </div>
            <div className="mt-4 text-center">
              <div className="label-mono text-blood">
                {foe.kind === "chefe"
                  ? "Chefe"
                  : foe.kind === "forte"
                    ? "Inimigo forte"
                    : "Inimigo"}
              </div>
              <h1 className="font-display text-4xl text-bone">{foe.name}</h1>
              <div className="mt-2 flex items-center justify-center gap-3">
                <div className="h-2 w-56 overflow-hidden rounded-full bg-blood-dark/40 ring-1 ring-blood/40">
                  <div
                    className="h-full bg-[image:var(--gradient-blood)] transition-all duration-500"
                    style={{ width: `${foePct}%` }}
                  />
                </div>
                <span className="font-mono text-sm text-blood">
                  {Math.max(0, foeHp)}/{foe.hp}
                </span>
              </div>
              <div className="label-mono mt-1.5 text-bone-dim">
                Defesa {foe.defense} · Acerto +{foe.hit} · Dano {foe.damage}
              </div>
            </div>
          </div>

          {/* dado */}
          <div className="my-6 flex h-24 items-center gap-4">
            {die ? (
              <>
                <D20
                  key={die.key}
                  value={die.v}
                  size={84}
                  rolling
                  tone={die.v === 20 ? "ember" : die.ok ? "rot" : "blood"}
                />
                <div className="font-mono text-sm text-bone-dim">{die.label}</div>
              </>
            ) : (
              <span className="font-narrative italic text-bone-dim">
                {block > 0 && `Escudo erguido: bloqueia ${block}. `}
                {focus > 0 && "Foco: +3 na próxima rolagem."}
              </span>
            )}
          </div>

          {/* fim */}
          {foeHp <= 0 && (
            <div className="animate-rise mb-6 w-full max-w-md rounded-sm border border-ember/50 bg-card/70 p-6 text-center">
              <div className="label-mono text-ember">{foeHp < 0 ? "Fuga" : "Vitória"}</div>
              <p className="mt-2 font-narrative text-xl italic text-bone">
                {foeHp < 0
                  ? "Você escapou, mas o caminho continua lá."
                  : reward
                    ? `+${reward.xp} XP · +${reward.gold} ouro (o ouro também vale XP)`
                    : ""}
              </p>
              <Button asChild variant="ember" className="mt-4">
                <Link to="/mapa">Voltar ao mapa</Link>
              </Button>
            </div>
          )}
          {hp <= 0 && (
            <div className="animate-rise mb-6 w-full max-w-md rounded-sm border border-blood/60 bg-blood-dark/30 p-6 text-center">
              <div className="label-mono text-blood">Fim da linha</div>
              <p className="mt-2 font-narrative text-xl italic text-bone">
                Os dados não perdoam. A vela tremula e apaga.
              </p>
              <Button asChild variant="ember" className="mt-4">
                <Link to="/epitafio">Ler o epitáfio</Link>
              </Button>
            </div>
          )}

          {/* mão em leque */}
          <div className="w-full">
            <div className="flex items-end justify-center gap-0 overflow-x-auto px-6 pb-4 pt-10 scrollbar-none max-sm:justify-start max-sm:gap-3">
              {hand.map((c, i) => {
                const rot = (i - (hand.length - 1) / 2) * 7;
                return (
                  <GameCard
                    key={`${turn}-${c.id}-${i}`}
                    card={c}
                    disabled={busy || over}
                    onClick={() => play(c)}
                    className="animate-rise sm:-mx-3"
                    style={{
                      transform: `rotate(${rot}deg) translateY(${Math.abs(rot) * 1.2}px)`,
                      animationDelay: `${i * 90}ms`,
                    }}
                  />
                );
              })}
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <span className="label-mono text-bone-dim">Baralho 5 · Descarte 3 · Esgotadas 0</span>
              <Button
                variant="bone"
                size="sm"
                disabled={!canFlee || busy || over}
                onClick={flee}
                title={canFlee ? "DES contra 10" : "Não dá para fugir deste"}
              >
                Fugir {canFlee ? "· DES vs 10" : "· impossível"}
              </Button>
            </div>
          </div>
        </section>

        {/* narração do combate */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="label-mono mb-2 text-bone-dim">Narração · turno {turn + 1}</div>
          <div
            ref={logRef}
            className="max-h-[70vh] space-y-3 overflow-y-auto border-l border-border/60 pl-4 scrollbar-none"
          >
            {lines.map((l, i) => (
              <p
                key={i}
                className={cn(
                  "animate-ink font-narrative leading-snug",
                  l.who === "gm" && "italic text-bone-dim",
                  l.who === "hero" && "text-bone",
                  l.who === "foe" && "text-blood",
                )}
              >
                {l.text}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </GameShell>
  );
}
