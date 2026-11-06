import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { BookOpen, ScrollText, Map as MapIcon } from "lucide-react";

import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { CharacterSheet } from "./CharacterSheet";
import { Journal } from "./Journal";
import { SAMPLE_HERO, CLASSES, JOURNAL } from "@/game/data";
import { cn } from "@/lib/utils";

type Overrides = Partial<Pick<typeof SAMPLE_HERO, "hp" | "corruption" | "gold" | "provisions" | "day">>;

function Stat({ label, value, className }: { label: string; value: ReactNode; className?: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="label-mono text-[0.58rem] text-bone-dim">{label}</span>
      <span className={cn("font-mono text-sm text-bone", className)}>{value}</span>
    </div>
  );
}

/** Estrutura das telas de jogo: barra fina no topo, gavetas laterais, cena no centro. */
export function GameShell({
  children,
  location,
  overrides,
}: {
  children: ReactNode;
  location: string;
  overrides?: Overrides;
}) {
  const hero = { ...SAMPLE_HERO, ...overrides };
  const [sheetOpen, setSheetOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [unread, setUnread] = useState(2);
  const hpPct = Math.max(0, (hero.hp / hero.hpMax) * 100);
  const cls = CLASSES.find((c) => c.name === hero.cls);

  return (
    <div className="vignette min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2">
          <Link to="/" className="font-display text-lg text-bone hover:text-ember">
            Mesa Vazia
          </Link>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <div className="font-narrative italic text-bone">
            {hero.name} <span className="text-bone-dim">· {hero.cls} nv {hero.level}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="label-mono text-[0.58rem] text-bone-dim">Vida</span>
            <div className="relative h-2 w-24 overflow-hidden rounded-full bg-blood-dark/40 ring-1 ring-blood/40">
              <div className="h-full bg-[image:var(--gradient-blood)] transition-all duration-500" style={{ width: `${hpPct}%` }} />
            </div>
            <span className="font-mono text-sm text-blood">
              {hero.hp}/{hero.hpMax}
            </span>
          </div>

          <div className="flex items-center gap-2" title="Corrupção">
            <span className="label-mono text-[0.58rem] text-bone-dim">Corr.</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className={cn("size-1.5 rotate-45", i < hero.corruption ? "bg-violet" : "bg-border")} />
              ))}
            </div>
          </div>

          <Stat label="CA" value={hero.ac} />
          <Stat label="Ouro" value={hero.gold} className="text-ember" />
          <Stat label="Prov." value={hero.provisions} className="text-rot" />
          <Stat label="Dia" value={hero.day} />

          <div className="ml-auto flex items-center gap-1">
            <span className="label-mono mr-3 hidden text-[0.58rem] text-bone-dim lg:inline">{location}</span>
            <Link
              to="/mapa"
              className="flex items-center gap-1.5 rounded-sm px-2 py-1 text-bone-dim hover:bg-accent hover:text-bone"
            >
              <MapIcon className="size-4" /> <span className="label-mono hidden sm:inline">Mapa</span>
            </Link>
            <button
              onClick={() => setSheetOpen(true)}
              className="flex items-center gap-1.5 rounded-sm px-2 py-1 text-bone-dim hover:bg-accent hover:text-bone"
            >
              <ScrollText className="size-4" /> <span className="label-mono hidden sm:inline">Ficha</span>
            </button>
            <button
              onClick={() => {
                setJournalOpen(true);
                setUnread(0);
              }}
              className="relative flex items-center gap-1.5 rounded-sm px-2 py-1 text-bone-dim hover:bg-accent hover:text-bone"
            >
              <BookOpen className="size-4" /> <span className="label-mono hidden sm:inline">Diário</span>
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-blood font-mono text-[0.6rem] text-bone">
                  {unread}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">{children}</main>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-full overflow-y-auto border-border/60 bg-table p-4 sm:max-w-lg">
          <SheetTitle className="sr-only">Ficha</SheetTitle>
          <SheetDescription className="sr-only">Ficha de papel do herói</SheetDescription>
          <CharacterSheet
            data={{
              ...hero,
              hp: hero.hp,
              saves: cls?.saves,
            }}
            className="mt-6 -rotate-[0.6deg]"
          />
        </SheetContent>
      </Sheet>

      <Sheet open={journalOpen} onOpenChange={setJournalOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto border-border/60 bg-table p-4 sm:max-w-md">
          <SheetTitle className="sr-only">Diário</SheetTitle>
          <SheetDescription className="sr-only">{JOURNAL.length} anotações</SheetDescription>
          <div className="mt-6 rotate-[0.5deg]">
            <Journal />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
