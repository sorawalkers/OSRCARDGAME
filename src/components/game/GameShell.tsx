import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { BookOpen, ScrollText, Map as MapIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { CharacterSheet } from "./CharacterSheet";
import { Journal } from "./Journal";
import { CORRUPTION_MAX, armorClass, classOf, heroToSheet } from "@/game/hero";
import { game, useGame } from "@/game/store";
import { cn } from "@/lib/utils";

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="label-mono text-[0.58rem] text-bone-dim">{label}</span>
      <span className={cn("font-mono text-sm text-bone", className)}>{value}</span>
    </div>
  );
}

/** Aviso no lugar da cena quando não há partida, ou quando o herói já morreu. */
function NoCampaign({ dead }: { dead: boolean }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <div className="label-mono text-blood">{dead ? "A vela apagou" : "Mesa vazia"}</div>
      <h1 className="mt-2 font-display text-4xl text-bone">
        {dead ? "Seu herói não se levanta mais" : "Ninguém sentou à mesa ainda"}
      </h1>
      <p className="mt-3 font-narrative text-lg italic text-bone-dim">
        {dead
          ? "O mundo lembra dele. Leia o epitáfio e chame o próximo."
          : "Crie um herói para começar uma campanha."}
      </p>
      <Button asChild variant="ember" size="lg" className="mt-8">
        {dead ? (
          <Link to="/epitafio">Ler o epitáfio</Link>
        ) : (
          <Link to="/criacao">Sentar à mesa</Link>
        )}
      </Button>
    </div>
  );
}

/** Estrutura das telas de jogo: barra fina no topo, gavetas laterais, cena no centro.
 *  Lê o herói do estado da partida; sem partida (ou com o herói morto, se `allowDead` for falso), mostra um aviso. */
export function GameShell({
  children,
  location,
  allowDead = false,
}: {
  children: ReactNode;
  location: string;
  allowDead?: boolean;
}) {
  const s = useGame();
  const hero = s.hero;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const blocked = !hero || (!!s.death && !allowDead);

  return (
    <div className="vignette min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2">
          <Link to="/" className="font-display text-lg text-bone hover:text-ember">
            Mesa Vazia
          </Link>
          {hero && (
            <>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <div className="font-narrative italic text-bone">
                {hero.name}{" "}
                <span className="text-bone-dim">
                  · {classOf(hero).name} nv {hero.level}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="label-mono text-[0.58rem] text-bone-dim">Vida</span>
                <div className="relative h-2 w-24 overflow-hidden rounded-full bg-blood-dark/40 ring-1 ring-blood/40">
                  <div
                    className="h-full bg-[image:var(--gradient-blood)] transition-all duration-500"
                    style={{ width: `${Math.max(0, (hero.hp / hero.hpMax) * 100)}%` }}
                  />
                </div>
                <span className="font-mono text-sm text-blood">
                  {Math.max(0, hero.hp)}/{hero.hpMax}
                </span>
              </div>

              <div
                className="flex items-center gap-2"
                title={`Corrupção: ${hero.corruption} de ${CORRUPTION_MAX}`}
              >
                <span className="label-mono text-[0.58rem] text-bone-dim">Corr.</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: CORRUPTION_MAX }, (_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "size-1.5 rotate-45",
                        i < hero.corruption ? "bg-violet" : "bg-border",
                      )}
                    />
                  ))}
                </div>
              </div>

              <Stat label="CA" value={armorClass(hero)} />
              <Stat label="Ouro" value={hero.gold} className="text-ember" />
              <Stat
                label="Prov."
                value={hero.provisions}
                className={hero.provisions === 0 ? "text-blood" : "text-rot"}
              />
              <Stat label="Dia" value={s.day} />

              <div className="ml-auto flex items-center gap-1">
                <span className="label-mono mr-3 hidden text-[0.58rem] text-bone-dim lg:inline">
                  {location}
                </span>
                <Link
                  to="/mapa"
                  className="flex items-center gap-1.5 rounded-sm px-2 py-1 text-bone-dim hover:bg-accent hover:text-bone"
                >
                  <MapIcon className="size-4" />{" "}
                  <span className="label-mono hidden sm:inline">Mapa</span>
                </Link>
                <button
                  onClick={() => setSheetOpen(true)}
                  className="flex items-center gap-1.5 rounded-sm px-2 py-1 text-bone-dim hover:bg-accent hover:text-bone"
                >
                  <ScrollText className="size-4" />{" "}
                  <span className="label-mono hidden sm:inline">Ficha</span>
                </button>
                <button
                  onClick={() => {
                    setJournalOpen(true);
                    game.markRead();
                  }}
                  className="relative flex items-center gap-1.5 rounded-sm px-2 py-1 text-bone-dim hover:bg-accent hover:text-bone"
                >
                  <BookOpen className="size-4" />{" "}
                  <span className="label-mono hidden sm:inline">Diário</span>
                  {s.unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-blood font-mono text-[0.6rem] text-bone">
                      {Math.min(s.unread, 9)}
                    </span>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <main className="relative z-10">
        {blocked ? <NoCampaign dead={!!hero && !!s.death} /> : children}
      </main>

      {hero && (
        <>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetContent
              side="left"
              className="w-full overflow-y-auto border-border/60 bg-table p-4 sm:max-w-lg"
            >
              <SheetTitle className="sr-only">Ficha</SheetTitle>
              <SheetDescription className="sr-only">Ficha de papel do herói</SheetDescription>
              <CharacterSheet data={heroToSheet(hero)} className="mt-6 -rotate-[0.6deg]" />
            </SheetContent>
          </Sheet>

          <Sheet open={journalOpen} onOpenChange={setJournalOpen}>
            <SheetContent
              side="right"
              className="w-full overflow-y-auto border-border/60 bg-table p-4 sm:max-w-md"
            >
              <SheetTitle className="sr-only">Diário</SheetTitle>
              <SheetDescription className="sr-only">{s.journal.length} anotações</SheetDescription>
              <div className="mt-6 rotate-[0.5deg]">
                <Journal entries={s.journal} />
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  );
}
