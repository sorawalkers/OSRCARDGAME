/* Estado da partida, compartilhado entre as telas e salvo no navegador.
 * As telas leem com useGame() e mudam o estado só pelas ações de `game`. */

import { useSyncExternalStore } from "react";

import { REGIONS } from "./data";
import { CORRUPTION_MAX, classOf, heroLine, raceOf, xpMultiplier, type Hero } from "./hero";

export type TimeOfDay = "Manhã" | "Tarde" | "Noite";

export type JournalEntry = { day: number; time: TimeOfDay; tag: string; text: string };

export type Death = { cause: string; place: string; day: number };

export type GameState = {
  version: 1;
  hero: Hero | null;
  day: number;
  time: TimeOfDay;
  region: string;
  /** passos dados na região (0 = acampamento) */
  step: number;
  /** lugar onde o herói está agora */
  place: string;
  journal: JournalEntry[];
  unread: number;
  death: Death | null;
};

/** Um herói que caiu: fica no cemitério e pode reaparecer na estrada do próximo. */
export type Grave = {
  name: string;
  line: string;
  level: number;
  cause: string;
  place: string;
  day: number;
  xp: number;
  gold: number;
};

const SAVE_KEY = "mesa-vazia:partida:v1";
const GRAVES_KEY = "mesa-vazia:cemiterio:v1";
const MAX_GRAVES = 12;

export const EMPTY: GameState = {
  version: 1,
  hero: null,
  day: 1,
  time: "Manhã",
  region: REGIONS[0]!,
  step: 0,
  place: "Acampamento",
  journal: [],
  unread: 0,
  death: null,
};
const NO_GRAVES: Grave[] = [];

/* ---------------- armazenamento ---------------- */

let state: GameState = EMPTY;
let graves: Grave[] = NO_GRAVES;
let loaded = false;
const listeners = new Set<() => void>();

// localStorage pode não existir (servidor) ou falhar (aba privada): o jogo segue sem salvar
function read<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* sem salvamento nesta sessão */
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const saved = read<GameState>(SAVE_KEY);
  if (saved?.version === 1) state = { ...EMPTY, ...saved };
  const g = read<Grave[]>(GRAVES_KEY);
  if (Array.isArray(g)) graves = g;
}

function emit() {
  for (const l of listeners) l();
}

function set(next: GameState) {
  state = next;
  write(SAVE_KEY, state);
  emit();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function getState() {
  load();
  return state;
}
export function getGraves() {
  load();
  return graves;
}

/** Estado da partida. No servidor (e no primeiro render) é o estado vazio; no navegador, o salvo. */
export function useGame() {
  return useSyncExternalStore(subscribe, getState, () => EMPTY);
}
export function useGraves() {
  return useSyncExternalStore(subscribe, getGraves, () => NO_GRAVES);
}

/* ---------------- ações ---------------- */

function withHero(fn: (h: Hero, s: GameState) => Partial<GameState> | void) {
  const s = getState();
  if (!s.hero || s.death) return;
  const hero = { ...s.hero };
  const patch = fn(hero, s) ?? {};
  set({ ...s, hero, ...patch });
}

function entry(s: GameState, tag: string, text: string): Pick<GameState, "journal" | "unread"> {
  return { journal: [...s.journal, { day: s.day, time: s.time, tag, text }], unread: s.unread + 1 };
}

export const game = {
  /** Começa uma campanha nova com o herói criado. */
  start(hero: Hero) {
    load();
    const first = `${hero.name}, ${heroLine(hero).toLowerCase()}, ${hero.background.toLowerCase()}, parte rumo à ${EMPTY.region}. Quer ${lowerFirst(hero.motivation)}. Leva ${hero.gold} moedas e pouca esperança.`;
    set({
      ...EMPTY,
      hero,
      journal: [{ day: 1, time: "Manhã", tag: "Partida", text: first }],
      unread: 1,
    });
  },

  /** Anota no diário. */
  log(tag: string, text: string) {
    const s = getState();
    if (!s.hero) return;
    set({ ...s, ...entry(s, tag, text) });
  },

  markRead() {
    const s = getState();
    if (s.unread) set({ ...s, unread: 0 });
  },

  /** Um passo no mapa: gasta 1 provisão (ou a fome tira 4 de vida) e o dia avança. */
  travel(place: string) {
    const s = getState();
    if (!s.hero || s.death) return;
    const hero = { ...s.hero };
    const step = s.step + 1;
    const free = hero.virtues.includes("Pé na estrada") && step % 3 === 0;
    let hungry = false;
    if (!free) {
      if (hero.provisions > 0) hero.provisions -= 1;
      else hungry = true;
    }
    if (hero.flaws.includes("Glutão") && step % 4 === 0 && hero.provisions > 0)
      hero.provisions -= 1;
    const next: GameState = { ...s, hero, step, day: s.day + 1, time: "Manhã", place };
    Object.assign(
      next,
      entry(
        next,
        "Viagem",
        `Seguiu para ${place}.${free ? " O passo leve poupou uma provisão." : ""}`,
      ),
    );
    if (hungry) {
      hero.hp = Math.max(0, hero.hp - 4);
      Object.assign(
        next,
        entry(next, "Fome", `Sem provisões, a fome tira 4 de vida a caminho de ${place}.`),
      );
      set(next);
      if (hero.hp <= 0) game.die("morto de fome na estrada");
      return;
    }
    set(next);
  },

  setTime(time: TimeOfDay) {
    const s = getState();
    if (s.hero) set({ ...s, time });
  },

  /** Uma noite de sono: o dia vira e volta a ser manhã. */
  sleep() {
    const s = getState();
    if (s.hero && !s.death) set({ ...s, day: s.day + 1, time: "Manhã" });
  },

  /** Dano no herói. Se a vida chegar a 0, ele morre com a causa informada. */
  hurt(n: number, cause: string) {
    if (n <= 0) return;
    let died = false;
    withHero((h) => {
      h.hp = Math.max(0, h.hp - n);
      died = h.hp <= 0;
    });
    if (died) game.die(cause);
  },

  heal(n: number) {
    withHero((h) => {
      h.hp = Math.min(h.hpMax, h.hp + n);
    });
  },

  /** Ouro ganho também vale experiência, como nas regras antigas. */
  gainGold(n: number) {
    withHero((h) => {
      h.gold += n;
      if (n > 0) h.xp += Math.round(n * xpMultiplier(h));
    });
  },

  /** Gasta ouro; devolve false se não houver o bastante. */
  spend(n: number) {
    const h = getState().hero;
    if (!h || h.gold < n) return false;
    withHero((x) => {
      x.gold -= n;
    });
    return true;
  },

  gainXp(n: number) {
    withHero((h) => {
      h.xp += Math.round(n * xpMultiplier(h));
    });
  },

  /** Corrupção: com 10, a escuridão leva o herói. */
  corrupt(n: number, cause = "consumido pela corrupção") {
    let died = false;
    withHero((h) => {
      h.corruption = Math.max(0, h.corruption + n);
      died = h.corruption >= CORRUPTION_MAX;
    });
    if (died) game.die(cause);
  },

  /** Mudanças diretas na ficha (equipamento, provisões, itens). */
  editHero(fn: (h: Hero) => void) {
    withHero((h) => {
      fn(h);
    });
  },

  /** Fim da linha: registra a morte e leva o herói para o cemitério. */
  die(cause: string) {
    const s = getState();
    if (!s.hero || s.death) return;
    const h = { ...s.hero, hp: Math.min(s.hero.hp, 0) };
    const death: Death = { cause, place: s.place, day: s.day };
    graves = [
      {
        name: h.name,
        line: `${raceOf(h).name} ${classOf(h).name}`,
        level: h.level,
        cause,
        place: s.place,
        day: s.day,
        xp: h.xp,
        gold: h.gold,
      },
      ...graves,
    ].slice(0, MAX_GRAVES);
    write(GRAVES_KEY, graves);
    set({
      ...s,
      hero: h,
      death,
      ...entry(s, "Morte", `${h.name} morreu: ${cause}, em ${s.place}, no dia ${s.day}.`),
    });
  },

  /** Levanta da mesa: apaga a partida atual (o cemitério fica). */
  clear() {
    load();
    set(EMPTY);
  },
};

function lowerFirst(t: string) {
  return t.charAt(0).toLowerCase() + t.slice(1);
}
