import { beforeEach, describe, expect, it } from "vitest";

import { prepArticle, withArticle, type AttrKey } from "@/game/data";
import { armorClass, attackBonus, buildHero, priceFor, saveBonus, saveTarget, type HeroChoices } from "@/game/hero";
import { game, getGraves, getState } from "@/game/store";

const base: Record<AttrKey, number> = { FOR: 14, DES: 12, CON: 13, INT: 9, SAB: 10, CAR: 8 };
const choices = (over: Partial<HeroChoices> = {}): HeroChoices => ({
  name: "Brana",
  base,
  raceId: "anao",
  classId: "guerreiro",
  background: "Desertor do exército",
  motivation: "Provar que não sou covarde",
  virtues: ["Robusto"],
  flaws: ["Procurado"],
  ...over,
});

describe("buildHero", () => {
  it("aplica raça, antecedente e traços como no documento de design", () => {
    const h = buildHero(choices());
    // anão: CON +1, CAR −1; desertor: FOR +2
    expect(h.attrs).toMatchObject({ FOR: 16, CON: 14, CAR: 7 });
    // vida: 34 + 3×CON(+1) + Robusto 6
    expect(h.hpMax).toBe(43);
    expect(h.hp).toBe(h.hpMax);
    // cota de malha 14 + escudo 1 + DES 0
    expect(armorClass(h)).toBe(15);
    expect(attackBonus(h)).toBe(1);
    expect(h.bonusCards).toEqual(["Grito de Guerra"]);
    // anão: +4 contra veneno e magia
    expect(saveBonus(h, "veneno")).toBe(5);
    expect(saveTarget(h, "veneno")).toBe(12);
    // Procurado +25%, CAR 7 (−1) +5%: 8 × 1,05 × 1,25 = 10,5
    expect(priceFor(h, 8)).toBe(11);
  });

  it("dá o +2 do humano no atributo escolhido e trava os valores entre 3 e 18", () => {
    const h = buildHero(choices({ raceId: "humano", humanAttr: "CAR", base: { ...base, FOR: 18 } }));
    expect(h.attrs.CAR).toBe(10);
    expect(h.attrs.FOR).toBe(18);
  });
});

describe("frases com nomes de monstros", () => {
  it("junta preposição e artigo", () => {
    expect(prepArticle("por", "O Rei Debaixo da Lama")).toBe("pelo Rei Debaixo da Lama");
    expect(prepArticle("de", "A Mãe das Moscas")).toBe("da Mãe das Moscas");
    expect(prepArticle("por", "Carniçal")).toBe("por um carniçal");
    expect(withArticle("Enforcado")).toBe("um enforcado");
  });
});

describe("estado da partida", () => {
  beforeEach(() => {
    window.localStorage.clear();
    game.clear();
  });

  it("começa a campanha, viaja, gasta provisão e salva no navegador", () => {
    game.start(buildHero(choices()));
    const startProv = getState().hero!.provisions;
    game.travel("Trilha dos Corvos");
    const s = getState();
    expect(s.day).toBe(2);
    expect(s.place).toBe("Trilha dos Corvos");
    expect(s.hero!.provisions).toBe(startProv - 1);
    expect(s.journal.at(-1)?.tag).toBe("Viagem");
    const saved = JSON.parse(window.localStorage.getItem("mesa-vazia:partida:v1")!);
    expect(saved.place).toBe("Trilha dos Corvos");
  });

  it("sem provisões, a fome tira 4 de vida", () => {
    game.start(buildHero(choices()));
    game.editHero((h) => void (h.provisions = 0));
    const hp = getState().hero!.hp;
    game.travel("Vau do Lobo");
    expect(getState().hero!.hp).toBe(hp - 4);
  });

  it("ouro ganho também vale experiência", () => {
    game.start(buildHero(choices()));
    game.gainGold(20);
    expect(getState().hero!.xp).toBeGreaterThanOrEqual(20);
  });

  it("morte registra a causa, leva o herói ao cemitério e bloqueia novas ações", () => {
    game.start(buildHero(choices()));
    game.travel("Capela de São Ormo");
    game.hurt(999, "abatido por um carniçal");
    const s = getState();
    expect(s.death).toMatchObject({ cause: "abatido por um carniçal", place: "Capela de São Ormo" });
    expect(getGraves()[0]).toMatchObject({ name: "Brana", cause: "abatido por um carniçal" });
    game.gainGold(50);
    expect(getState().hero!.gold).toBe(s.hero!.gold);
  });

  it("com 10 de corrupção, a escuridão leva o herói", () => {
    game.start(buildHero(choices()));
    game.corrupt(10);
    expect(getState().death?.cause).toBe("consumido pela corrupção");
  });
});
