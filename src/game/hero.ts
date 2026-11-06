/* O herói: montagem a partir das escolhas da criação e os valores derivados da ficha.
 * Regras em referencia/MESA_VAZIA.md (§3 e §4). */

import type { SheetData } from "@/components/game/CharacterSheet";

import {
  ARMORS,
  ATTRS,
  BACKGROUNDS,
  CLASSES,
  RACES,
  WEAPONS,
  mod,
  type ArmorId,
  type AttrKey,
  type HeroClass,
  type Race,
  type WeaponId,
} from "./data";

export type Hero = {
  name: string;
  raceId: string;
  classId: string;
  background: string;
  motivation: string;
  virtues: string[];
  flaws: string[];
  /** valores de 3 a 18, já com raça e antecedente */
  attrs: Record<AttrKey, number>;
  level: number;
  xp: number;
  hp: number;
  hpMax: number;
  corruption: number;
  gold: number;
  provisions: number;
  weapon: WeaponId;
  armor: ArmorId;
  shield: boolean;
  /** cartas extras ganhas fora da classe (o baralho completo entra no passo do combate) */
  bonusCards: string[];
  items: string[];
};

export type HeroChoices = {
  name: string;
  /** valores rolados em 3d6, antes de raça e antecedente */
  base: Record<AttrKey, number>;
  raceId: string;
  classId: string;
  background: string;
  motivation: string;
  virtues: string[];
  flaws: string[];
  /** atributo que recebe +2 quando a raça é Humano */
  humanAttr?: AttrKey | undefined;
};

export const CORRUPTION_MAX = 10;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export const raceOf = (h: Pick<Hero, "raceId">): Race =>
  RACES.find((r) => r.id === h.raceId) ?? RACES[0]!;
export const classOf = (h: Pick<Hero, "classId">): HeroClass =>
  CLASSES.find((c) => c.id === h.classId) ?? CLASSES[0]!;

/** Atributos finais: 3d6 + ajustes da raça + o +2 do humano + o antecedente, sempre entre 3 e 18. */
export function finalAttrs(
  c: Pick<HeroChoices, "base" | "raceId" | "background" | "humanAttr" | "classId">,
) {
  const out = { ...c.base };
  const race = RACES.find((r) => r.id === c.raceId);
  const bg = BACKGROUNDS.find((b) => b.name === c.background);
  for (const [k, v] of Object.entries(race?.mods ?? {})) out[k as AttrKey] += v ?? 0;
  if (race?.chooseAttr) {
    const k = c.humanAttr ?? CLASSES.find((x) => x.id === c.classId)?.main ?? "FOR";
    out[k] += 2;
  }
  for (const [k, v] of Object.entries(bg?.attrs ?? {})) out[k as AttrKey] += v ?? 0;
  for (const a of ATTRS) out[a.key] = clamp(out[a.key], 3, 18);
  return out;
}

/** Monta o herói pronto para começar a campanha. */
export function buildHero(c: HeroChoices): Hero {
  const cls = CLASSES.find((x) => x.id === c.classId) ?? CLASSES[0]!;
  const bg = BACKGROUNDS.find((b) => b.name === c.background);
  const attrs = finalAttrs(c);
  const hpMax = Math.max(
    8,
    cls.baseHp +
      3 * mod(attrs.CON) +
      (bg?.hp ?? 0) +
      (c.virtues.includes("Robusto") ? 6 : 0) -
      (c.flaws.includes("Frágil") ? 5 : 0),
  );
  return {
    name: c.name.trim() || "Sem Nome",
    raceId: c.raceId,
    classId: cls.id,
    background: c.background,
    motivation: c.motivation,
    virtues: [...c.virtues],
    flaws: [...c.flaws],
    attrs,
    level: 1,
    xp: 0,
    hp: hpMax,
    hpMax,
    corruption: (bg?.corruption ?? 0) + (c.flaws.includes("Sangue ruim") ? 2 : 0),
    gold: 15 + (bg?.gold ?? 0),
    provisions: 6 + (bg?.provisions ?? 0),
    weapon: cls.weapon,
    armor: cls.armor,
    shield: cls.shield,
    bonusCards: bg?.card ? [bg.card] : [],
    items: [],
  };
}

/* ---------------- Valores derivados ---------------- */

/** CA = armadura + escudo + DES. O escudo não conta com arma de duas mãos. */
export function armorClass(h: Hero) {
  const twoHanded = WEAPONS[h.weapon].twoHanded;
  return ARMORS[h.armor].ac + (h.shield && !twoHanded ? 1 : 0) + mod(h.attrs.DES);
}

/** Bônus de ataque por nível: Guerreiro = nível; Clérigo e Ladrão = nível ÷ 2; Mago = nível ÷ 3. */
export function attackBonus(h: Hero) {
  const l = h.level;
  if (h.classId === "guerreiro") return l;
  if (h.classId === "mago") return Math.floor(l / 3);
  return Math.floor(l / 2);
}

export type SaveKind = "veneno" | "paralisia" | "magia";
const SAVE_INDEX: Record<SaveKind, number> = { veneno: 0, paralisia: 1, magia: 2 };
const SAVE_ATTR: Record<SaveKind, AttrKey> = { veneno: "CON", paralisia: "DES", magia: "SAB" };

/** Alvo no d20 do teste de resistência; melhora 1 a cada 2 níveis. */
export function saveTarget(h: Hero, k: SaveKind) {
  return (classOf(h).saves[SAVE_INDEX[k]] ?? 15) - Math.floor((h.level - 1) / 2);
}

/** Bônus no teste de resistência: atributo + raça (anão +4 e halfling +2 contra veneno e magia). */
export function saveBonus(h: Hero, k: SaveKind) {
  let b = mod(h.attrs[SAVE_ATTR[k]]);
  if (k !== "paralisia") {
    if (h.raceId === "anao") b += 4;
    if (h.raceId === "halfling") b += 2;
  }
  return b;
}

/** Preço numa vila: Carisma dá 5% por ponto; Pechincheiro −20%; Procurado +25%; Meio-Orc +15%. */
export function priceFor(h: Hero, base: number) {
  let m = 1 - 0.05 * mod(h.attrs.CAR);
  if (h.virtues.includes("Pechincheiro")) m *= 0.8;
  if (h.flaws.includes("Procurado")) m *= 1.25;
  if (h.raceId === "meio-orc") m *= 1.15;
  return Math.max(1, Math.round(base * m));
}

/** XP ganho: humano +10%; atributo principal alto dá até +10%, baixo tira até 20%. */
export function xpMultiplier(h: Hero) {
  const main = h.attrs[classOf(h).main];
  const prime = main >= 16 ? 1.1 : main >= 13 ? 1.05 : main <= 5 ? 0.8 : main <= 8 ? 0.9 : 1;
  return prime * (h.raceId === "humano" ? 1.1 : 1);
}

/** XP necessária para o próximo nível, ou null no nível máximo do protótipo. */
export function nextLevelXp(h: Hero) {
  const t = classOf(h).xpTable;
  return h.level < t.length ? t[h.level]! : null;
}

export function weaponLabel(h: Hero) {
  const w = WEAPONS[h.weapon];
  return `${w.name} (d${w.die}${w.twoHanded ? ", duas mãos" : ""})`;
}

export function armorLabel(h: Hero) {
  const twoHanded = WEAPONS[h.weapon].twoHanded;
  return `${ARMORS[h.armor].name}${h.shield && !twoHanded ? " e escudo" : ""}`;
}

/** "Meio-Elfo Guerreiro" */
export const heroLine = (h: Hero) => `${raceOf(h).name} ${classOf(h).name}`;

/** Dados prontos para a ficha de papel. */
export function heroToSheet(h: Hero): SheetData {
  const cls = classOf(h);
  return {
    name: h.name,
    race: raceOf(h).name,
    cls: cls.name,
    background: h.background,
    motivation: h.motivation,
    level: h.level,
    xp: h.xp,
    attrs: h.attrs,
    hp: h.hp,
    hpMax: h.hpMax,
    ac: armorClass(h),
    attack: attackBonus(h),
    weapon: weaponLabel(h),
    armor: armorLabel(h),
    virtues: h.virtues,
    flaws: h.flaws,
    items: [...h.bonusCards.map((c) => `Carta: ${c}`), ...h.items],
    saves: [saveTarget(h, "veneno"), saveTarget(h, "paralisia"), saveTarget(h, "magia")],
    highlight: cls.main,
  };
}
