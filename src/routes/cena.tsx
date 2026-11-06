import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Choice } from "@/components/game/Choice";
import { D20 } from "@/components/game/D20";
import { GameShell } from "@/components/game/GameShell";
import { MonsterPlate } from "@/components/game/MonsterPlate";
import { MONSTERS, fmtMod, mod, roll, type AttrKey } from "@/game/data";
import type { Hero } from "@/game/hero";
import { game, useGame } from "@/game/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cena")({
  head: () => ({
    meta: [
      { title: "O enforcado que ainda respira — Mesa Vazia" },
      {
        name: "description",
        content: "Uma cena na estrada: narração, escolhas e o d20 decidindo o resto.",
      },
      { property: "og:title", content: "Cena na estrada — Mesa Vazia" },
      {
        property: "og:description",
        content: "Toda rolagem é visível. Toda escolha fica na ata da sessão.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Scene,
});

type Opt = {
  text: string;
  attr?: AttrKey;
  dc?: number;
  ok?: string;
  fail?: string;
  next?: string;
  okNext?: string;
  failNext?: string;
  tone?: "violet" | "blood";
};
// apply: o que o nó muda de verdade na partida ao ser alcançado
type SceneNode = { id: string; text: string; options: Opt[]; effect?: string; apply?: () => void };

const NODES: Record<string, SceneNode> = {
  start: {
    id: "start",
    text: "A estrada faz uma curva perto de uma forca torta. O corpo pendurado gira devagar com o vento — e então tosse. Os olhos dele se abrem, brancos como leite, e procuram os seus. Uma voz rouca, quase sem ar: “Corta… por piedade, corta.”",
    options: [
      {
        text: "Cortar a corda e baixá-lo com cuidado.",
        attr: "FOR",
        dc: 10,
        okNext: "cut",
        failNext: "cutfail",
      },
      {
        text: "Perguntar quem o enforcou, e por quê.",
        attr: "CAR",
        dc: 12,
        okNext: "talk",
        failNext: "fight",
      },
      {
        text: "Revistar os bolsos dele enquanto ainda balança.",
        attr: "DES",
        dc: 11,
        okNext: "loot",
        failNext: "fight",
        tone: "violet",
      },
      { text: "Seguir caminho sem olhar para trás.", next: "leave" },
    ],
  },
  cut: {
    id: "cut",
    effect: "+1 aliado lembrado",
    apply: () =>
      game.log(
        "Cena",
        "Cortou a corda de um enforcado na estrada. Oswin jurou voltar a Pedra-Funda atrás do Padre Anselm.",
      ),
    text: "A corda cede. Ele cai na lama e fica um tempo só respirando. “Meu nome é Oswin. Quem me pendurou foi o Padre Anselm, de Pedra-Funda. Diga a ele que eu volto.” Ele some entre as urzes, mancando.",
    options: [{ text: "Voltar ao mapa.", next: "map" }],
  },
  cutfail: {
    id: "cutfail",
    effect: "−3 de vida",
    apply: () => game.hurt(3, "esmagado por um enforcado que caiu da forca"),
    text: "A faca escorrega na corda molhada e o corpo despenca em cima de você. Quando você se levanta, ele já está de pé — e já não pede piedade.",
    options: [{ text: "Erguer a arma.", next: "fightnow", tone: "blood" }],
  },
  talk: {
    id: "talk",
    effect: "Rumor revelado no mapa",
    apply: () =>
      game.log(
        "Rumor",
        "O enforcado contou que os sinos de Velmire pararam, e sussurrou o caminho até uma ruína esquecida.",
      ),
    text: "“Os sinos de Velmire pararam”, ele diz, “e o padre disse que fui eu.” Ele ri, e a corda ri junto. Antes de fechar os olhos de novo, sussurra o caminho até uma ruína que ninguém mais lembra.",
    options: [{ text: "Anotar o rumor e seguir.", next: "map" }],
  },
  loot: {
    id: "loot",
    effect: "+12 ouro · +12 XP",
    apply: () => {
      game.gainGold(12);
      game.log(
        "Cena",
        "Revistou os bolsos de um enforcado ainda vivo: doze moedas e um dente de ouro.",
      );
    },
    text: "Seus dedos encontram doze moedas e um dente de ouro embrulhado num lenço. Ele não percebe — ou finge não perceber. A corda range mais forte quando você se afasta.",
    options: [{ text: "Guardar o ouro e voltar ao mapa.", next: "map" }],
  },
  fight: {
    id: "fight",
    text: "Algo na sua voz — ou nas suas mãos — o ofende. O pescoço estala quando ele se solta da corda sozinho e cai de pé, torto, sorrindo.",
    options: [{ text: "Lutar.", next: "fightnow", tone: "blood" }],
  },
  leave: {
    id: "leave",
    effect: "+1 corrupção",
    apply: () => {
      game.log("Cena", "Deixou um enforcado pedindo piedade na estrada.");
      game.corrupt(1);
    },
    text: "Você segue. A tosse vai ficando para trás, depois a voz, depois o rangido. Mas à noite, no sonho, a corda está no seu pescoço.",
    options: [{ text: "Voltar ao mapa.", next: "map" }],
  },
};

type LogEntry = { kind: "narr" | "choice" | "roll" | "effect"; text: string; ok?: boolean };

function Scene() {
  const { hero } = useGame();
  if (!hero) return <GameShell location="Estrada · A Forca Torta">{null}</GameShell>;
  return <SceneInner hero={hero} />;
}

function SceneInner({ hero }: { hero: Hero }) {
  const [nodeId, setNodeId] = useState("start");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [lastRoll, setLastRoll] = useState<{
    d: number;
    total: number;
    dc: number;
    ok: boolean;
    key: number;
  } | null>(null);
  const node = NODES[nodeId] ?? NODES["start"]!;
  const monster = MONSTERS.find((m) => m.id === "enforcado")!;

  const choose = (o: Opt) => {
    const entries: LogEntry[] = [{ kind: "choice", text: o.text }];
    let next = o.next;
    if (o.attr && o.dc) {
      const d = roll(20);
      const m = mod(hero.attrs[o.attr]);
      const total = d + m;
      const ok = d === 20 || (d !== 1 && total >= o.dc);
      setLastRoll({ d, total, dc: o.dc, ok, key: Date.now() });
      entries.push({
        kind: "roll",
        text: `d20 ${d} ${fmtMod(m)} ${o.attr} = ${total} contra ${o.dc} · ${d === 20 ? "crítico" : d === 1 ? "desastre" : ok ? "sucesso" : "falha"}`,
        ok,
      });
      next = ok ? o.okNext : o.failNext;
    } else setLastRoll(null);
    const n = next ? NODES[next] : undefined;
    if (n?.effect) entries.push({ kind: "effect", text: n.effect });
    setLog((l) => [...l, ...entries]);
    n?.apply?.();
    if (next && NODES[next]) setNodeId(next);
    else setNodeId(next ?? "start");
  };

  const isEnd = nodeId === "map" || nodeId === "fightnow";

  return (
    <GameShell location="Estrada · A Forca Torta">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-[1fr_320px]">
        <article className="mx-auto w-full max-w-2xl">
          <div className="label-mono text-ember">Tarde · vento baixo · cheiro de corda molhada</div>
          <h1 className="mt-2 font-display text-5xl text-bone">O enforcado que ainda respira</h1>

          <div className="float-right ml-6 mt-6 hidden w-44 rotate-2 sm:block">
            <MonsterPlate monster={monster} />
          </div>

          {!isEnd ? (
            <div key={nodeId} className="animate-ink">
              <p className="drop-cap mt-6 font-narrative text-[1.3rem] leading-relaxed text-bone">
                {node.text}
              </p>
              {node.effect && (
                <div className="label-mono mt-4 inline-block border-y border-ember/40 py-1 text-ember">
                  {node.effect}
                </div>
              )}
            </div>
          ) : (
            <div className="animate-ink mt-6">
              <p className="drop-cap font-narrative text-[1.3rem] leading-relaxed text-bone">
                {nodeId === "fightnow"
                  ? "Não há mais palavras. Só a corda arrastando no chão e os passos tortos vindo na sua direção."
                  : "A cena se fecha. O mestre vira a página do caderno e espera o seu próximo passo."}
              </p>
              <div className="mt-8">
                {nodeId === "fightnow" ? (
                  <Button asChild variant="ember" size="lg">
                    <Link to="/combate" search={{ m: "enforcado" }}>
                      Começar o combate
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="ember" size="lg">
                    <Link to="/mapa">Voltar ao mapa</Link>
                  </Button>
                )}
              </div>
            </div>
          )}

          {lastRoll && (
            <div
              key={lastRoll.key}
              className="mt-6 flex items-center gap-4 rounded-sm border border-border/50 bg-card/40 p-3"
            >
              <D20
                value={lastRoll.d}
                size={64}
                rolling
                tone={lastRoll.d === 20 ? "ember" : lastRoll.ok ? "rot" : "blood"}
              />
              <div>
                <div
                  className={cn("font-display text-2xl", lastRoll.ok ? "text-rot" : "text-blood")}
                >
                  {lastRoll.d === 20
                    ? "Crítico!"
                    : lastRoll.d === 1
                      ? "Desastre"
                      : lastRoll.ok
                        ? "Sucesso"
                        : "Falha"}
                </div>
                <div className="font-mono text-sm text-bone-dim">
                  total {lastRoll.total} · dificuldade {lastRoll.dc}
                </div>
              </div>
            </div>
          )}

          {!isEnd && (
            <div className="mt-8 clear-both">
              {node.options.map((o) => (
                <Choice
                  key={o.text}
                  check={o.attr ? `${o.attr} · CD ${o.dc}` : undefined}
                  tone={o.tone}
                  onClick={() => choose(o)}
                >
                  {o.text}
                </Choice>
              ))}
            </div>
          )}
        </article>

        {/* ata da sessão */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="paper rounded-sm p-5">
            <div className="relative z-10">
              <h3 className="border-b-2 ink-line pb-1 font-display text-xl text-ink">
                Ata da sessão
              </h3>
              {log.length === 0 ? (
                <p className="mt-3 font-narrative italic text-ink-faded">
                  O mestre aguarda sua primeira escolha.
                </p>
              ) : (
                <ol className="paper-rule mt-3 space-y-2">
                  {log.map((l, i) => (
                    <li
                      key={i}
                      className={cn(
                        "leading-snug",
                        l.kind === "choice" && "font-narrative italic text-ink",
                        l.kind === "roll" &&
                          cn("font-mono text-[0.72rem]", l.ok ? "text-ink" : "text-ink-red"),
                        l.kind === "effect" && "label-mono text-[0.6rem] text-ink-red",
                      )}
                    >
                      {l.kind === "choice" ? `◆ ${l.text}` : l.text}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </aside>
      </div>
    </GameShell>
  );
}
