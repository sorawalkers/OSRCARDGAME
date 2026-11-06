import bispo from "@/assets/monsters/bispo-sem-rosto.jpg";
import rei from "@/assets/monsters/rei-da-lama.jpg";
import carnical from "@/assets/monsters/carnical.jpg";
import enforcado from "@/assets/monsters/enforcado.jpg";
import lobo from "@/assets/monsters/lobo-da-nevoa.jpg";
import flagelante from "@/assets/monsters/flagelante.jpg";

/* ---------------- Regras base ---------------- */

export type AttrKey = "FOR" | "DES" | "CON" | "INT" | "SAB" | "CAR";

export const ATTRS: { key: AttrKey; name: string; use: string }[] = [
  { key: "FOR", name: "Força", use: "Acerto e dano corpo a corpo" },
  { key: "DES", name: "Destreza", use: "CA, furtividade, reflexos, fuga" },
  { key: "CON", name: "Constituição", use: "Vida, dado de vida, veneno" },
  { key: "INT", name: "Inteligência", use: "Magias do mago" },
  { key: "SAB", name: "Sabedoria", use: "Orações, percepção, magia" },
  { key: "CAR", name: "Carisma", use: "Conversa, persuasão, preços" },
];

export function mod(score: number) {
  if (score <= 3) return -3;
  if (score <= 5) return -2;
  if (score <= 8) return -1;
  if (score <= 12) return 0;
  if (score <= 15) return 1;
  if (score <= 17) return 2;
  return 3;
}

export const fmtMod = (n: number) => (n >= 0 ? `+${n}` : `${n}`);

export const roll = (sides: number) => 1 + Math.floor(Math.random() * sides);
export const roll3d6 = () => roll(6) + roll(6) + roll(6);

export type Race = {
  id: string;
  name: string;
  adjust: string;
  trait: string;
  mods: Partial<Record<AttrKey, number>>;
  noMage?: boolean;
};

export const RACES: Race[] = [
  { id: "humano", name: "Humano", adjust: "+2 no atributo escolhido", trait: "Ambição: +10% de XP", mods: {} },
  { id: "anao", name: "Anão", adjust: "CON +1 · CAR −1", trait: "+4 contra veneno e magia", mods: { CON: 1, CAR: -1 }, noMage: true },
  { id: "elfo", name: "Elfo", adjust: "DES +1 · CON −1", trait: "Vê 1 passo a mais no mapa; imune à paralisia", mods: { DES: 1, CON: -1 } },
  { id: "halfling", name: "Halfling", adjust: "FOR −1 · DES +1", trait: "+2 CA contra fortes; nunca é surpreendido", mods: { FOR: -1, DES: 1 }, noMage: true },
  { id: "meio-elfo", name: "Meio-Elfo", adjust: "nenhum", trait: "+2 em Carisma fora de combate", mods: {} },
  { id: "meio-orc", name: "Meio-Orc", adjust: "FOR +1 · CON +1 · CAR −2", trait: "+1 de dano por golpe; preços 15% maiores", mods: { FOR: 1, CON: 1, CAR: -2 } },
];

export type HeroClass = {
  id: string;
  name: string;
  main: AttrKey;
  baseHp: number;
  hitDie: string;
  gear: string;
  ability: string;
  saves: [number, number, number];
};

export const CLASSES: HeroClass[] = [
  { id: "guerreiro", name: "Guerreiro", main: "FOR", baseHp: 34, hitDie: "d10", gear: "Espada longa (d8), cota de malha e escudo", ability: "+1 de ataque por nível; usa tudo", saves: [12, 14, 16] },
  { id: "clerigo", name: "Clérigo", main: "SAB", baseHp: 30, hitDie: "d8", gear: "Maça (d6), cota de malha e escudo", ability: "Expulsar Mortos-Vivos; orações que se esgotam", saves: [11, 14, 15] },
  { id: "ladrao", name: "Ladrão", main: "DES", baseHp: 26, hitDie: "d6", gear: "Espada curta (d6), gibão de couro", ability: "Ataque furtivo ×2; começa lutas oculto", saves: [13, 13, 15] },
  { id: "mago", name: "Mago", main: "INT", baseHp: 20, hitDie: "d4", gear: "Adaga (d4), sem armadura", ability: "Grimório: magias fortes que se esgotam", saves: [13, 13, 14] },
];

export const BACKGROUNDS = [
  { name: "Filho de coveiro", bonus: "+2 SAB · pá velha" },
  { name: "Ex-inquisidor", bonus: "+2 FOR · 20 ouro" },
  { name: "Sobrevivente da peste", bonus: "+2 CON · +4 vida" },
  { name: "Desertor do exército", bonus: "+2 FOR · carta Golpe Sujo" },
  { name: "Ladra de relicários", bonus: "+2 DES · 30 ouro" },
  { name: "Herdeira falida", bonus: "+2 CAR · 40 ouro" },
  { name: "Marcado pela lua", bonus: "+2 INT · +2 corrupção" },
  { name: "Curandeira de aldeia", bonus: "+2 SAB · 3 ervas" },
  { name: "Caçador de recompensas", bonus: "+2 DES · carta Rastrear" },
  { name: "Monge expulso", bonus: "+2 CON · carta Meditação" },
  { name: "Aprendiz de alquimista", bonus: "+2 INT · 2 frascos" },
  { name: "Menestrel sem plateia", bonus: "+2 CAR · alaúde" },
];

export const VIRTUES = [
  { name: "Mãos firmes", cost: 1 },
  { name: "Língua afiada", cost: 1 },
  { name: "Robusto", cost: 1 },
  { name: "Pé na estrada", cost: 1 },
  { name: "Sono leve", cost: 1 },
  { name: "Pechincheiro", cost: 1 },
  { name: "Veterano", cost: 2 },
  { name: "Nascido com sorte", cost: 2 },
];

export const FLAWS = ["Manco", "Pesadelos", "Glutão", "Procurado", "Frágil", "Sangue ruim"];

export const MOTIVATIONS = [
  "Levar as cinzas da mãe até o mar",
  "Encontrar quem enforcou meu irmão",
  "Pagar uma dívida com um morto",
  "Quebrar a maldição do meu nome",
  "Achar o sino que parou de tocar",
  "Fugir de um deus que me quer de volta",
  "Provar que não sou covarde",
  "Morrer longe de casa, mas não à toa",
];

export const NAMES = ["Aldric", "Morwen", "Tobias Vey", "Isolde", "Garrick", "Brana", "Edmund Crane", "Sela", "Hob", "Marthe"];

/* ---------------- Mundo ---------------- */

export const REGIONS = [
  "Charneca dos Enforcados",
  "Pântano de Velmire",
  "Campos de Cinza",
  "Floresta Sem Pássaros",
  "Vale do Sino Partido",
  "Minas de Ossomar",
];

export type Intent = "atacar" | "proteger" | "enfraquecer" | "envenenar" | "amaldicoar" | "fortalecer" | "curar";

export type Monster = {
  id: string;
  name: string;
  epithet: string;
  kind: "normal" | "forte" | "chefe";
  hp: number;
  defense: number;
  hit: number;
  damage: string;
  image?: string;
  lore: string;
  habitat: string;
  intents: Intent[];
  deathLine: string;
};

export const MONSTERS: Monster[] = [
  {
    id: "carnical", name: "Carniçal", epithet: "Comedor de Mortos", kind: "normal",
    hp: 18, defense: 11, hit: 3, damage: "1d6", image: carnical,
    habitat: "Cemitérios, ruínas", intents: ["atacar", "enfraquecer", "atacar"],
    lore: "Fareja a tumba recém-fechada. Suas garras deixam a carne dormente, e quem cai paralisado vira jantar.",
    deathLine: "Ele se dobra sobre os ossos que roía e não levanta mais.",
  },
  {
    id: "enforcado", name: "Enforcado", epithet: "O Que Ainda Respira", kind: "normal",
    hp: 22, defense: 10, hit: 2, damage: "1d8", image: enforcado,
    habitat: "Charneca, forcas", intents: ["atacar", "amaldicoar", "atacar"],
    lore: "A corda não terminou o serviço. Ele caminha procurando o carrasco, e qualquer pescoço serve.",
    deathLine: "A corda enfim aperta. Ele fica em silêncio, pendurado no nada.",
  },
  {
    id: "lobo", name: "Lobo da Névoa", epithet: "Fome com Dentes", kind: "forte",
    hp: 30, defense: 12, hit: 4, damage: "1d10", image: lobo,
    habitat: "Floresta Sem Pássaros", intents: ["atacar", "fortalecer", "atacar"],
    lore: "Caça em matilhas de um só. Some na névoa e volta pelo lado que você não está olhando.",
    deathLine: "O corpo se desfaz em névoa, e só os dentes ficam na lama.",
  },
  {
    id: "flagelante", name: "Flagelante", epithet: "Penitente de Pregos", kind: "normal",
    hp: 20, defense: 11, hit: 3, damage: "1d6+1", image: flagelante,
    habitat: "Estradas, procissões", intents: ["atacar", "proteger", "envenenar"],
    lore: "Açoita a si mesmo até sangrar e acha que você é o pecado que falta expiar.",
    deathLine: "Ele cai de joelhos, rezando, e o flagelo escorrega da mão.",
  },
  {
    id: "mae-das-moscas", name: "A Mãe das Moscas", epithet: "Coração da Charneca", kind: "chefe",
    hp: 60, defense: 13, hit: 5, damage: "2d6",
    habitat: "Charneca dos Enforcados", intents: ["envenenar", "atacar", "fortalecer", "atacar"],
    lore: "O zumbido chega antes dela. Cada mosca é um filho, e cada filho tem fome do que é vivo.",
    deathLine: "O enxame se dispersa no vento, e o silêncio pesa mais que o zumbido.",
  },
  {
    id: "bispo", name: "O Bispo Sem Rosto", epithet: "Coração do Vale", kind: "chefe",
    hp: 70, defense: 14, hit: 5, damage: "2d6", image: bispo,
    habitat: "Vale do Sino Partido", intents: ["amaldicoar", "atacar", "curar", "atacar"],
    lore: "Rezou tanto que Deus apagou seu rosto. Agora ele ouve confissões e cobra em carne.",
    deathLine: "A mitra rola pelo chão. Debaixo dela não havia ninguém.",
  },
  {
    id: "rei-lama", name: "O Rei Debaixo da Lama", epithet: "Coração de Velmire", kind: "chefe",
    hp: 80, defense: 12, hit: 6, damage: "2d8", image: rei,
    habitat: "Pântano de Velmire", intents: ["atacar", "proteger", "enfraquecer", "atacar"],
    lore: "Todo afogado do pântano é seu súdito. A coroa enferrujou na cabeça, e ele não lembra o próprio nome.",
    deathLine: "Ele afunda devagar, levando a coroa e os súditos para o fundo.",
  },
];

export const INTENT_LABEL: Record<Intent, { label: string; tone: "blood" | "bone" | "violet" | "rot" | "ember" }> = {
  atacar: { label: "Atacar", tone: "blood" },
  proteger: { label: "Proteger-se", tone: "bone" },
  enfraquecer: { label: "Enfraquecer", tone: "violet" },
  envenenar: { label: "Envenenar", tone: "rot" },
  amaldicoar: { label: "Amaldiçoar", tone: "violet" },
  fortalecer: { label: "Fortalecer-se", tone: "ember" },
  curar: { label: "Curar-se", tone: "rot" },
};

/* ---------------- Cartas ---------------- */

export type Card = {
  id: string;
  name: string;
  type: "Ataque" | "Defesa" | "Truque" | "Magia" | "Oração";
  attr?: AttrKey;
  dc?: string;
  cost?: string;
  success: string;
  fail?: string;
  exhaust?: boolean;
  damage?: number;
  block?: number;
  heal?: number;
};

export const DECK: Card[] = [
  { id: "golpe", name: "Golpe de Espada", type: "Ataque", attr: "FOR", dc: "Defesa", success: "d8 + FOR de dano", fail: "Erra. Abre a guarda.", damage: 7 },
  { id: "estocada", name: "Estocada Dupla", type: "Ataque", attr: "DES", dc: "Defesa", success: "Dois golpes de d4", fail: "Um golpe de 1", damage: 5 },
  { id: "escudo", name: "Erguer Escudo", type: "Defesa", success: "Bloqueia 6. +2 CA neste turno.", block: 6 },
  { id: "foco", name: "Respirar Fundo", type: "Truque", success: "Foco: +3 na próxima rolagem" },
  { id: "sujo", name: "Golpe Sujo", type: "Ataque", attr: "DES", dc: "12", success: "4 de dano e Fraqueza", fail: "Ele percebe. Nada.", damage: 4 },
  { id: "oracao", name: "Oração de Cura", type: "Oração", attr: "SAB", dc: "10", success: "Cura 2d6", fail: "Cura 2", heal: 7, exhaust: true },
  { id: "sono", name: "Sono", type: "Magia", attr: "INT", dc: "Resist.", success: "O inimigo perde o turno", fail: "Ele cambaleia, mas resiste", exhaust: true },
];

/* ---------------- Herói de exemplo ---------------- */

export const SAMPLE_HERO = {
  name: "Morwen Vey",
  race: "Meio-Elfo",
  cls: "Guerreiro",
  background: "Desertor do exército",
  motivation: "Levar as cinzas da mãe até o mar",
  level: 2,
  xp: 112,
  xpNext: 150,
  hp: 31,
  hpMax: 40,
  corruption: 2,
  ac: 15,
  gold: 47,
  provisions: 5,
  day: 3,
  attack: 2,
  attrs: { FOR: 15, DES: 12, CON: 14, INT: 9, SAB: 11, CAR: 13 } as Record<AttrKey, number>,
  weapon: "Espada longa (d8)",
  armor: "Cota de malha + escudo",
  virtues: ["Veterano"],
  flaws: ["Pesadelos"],
  items: ["Cinzas numa urna de barro", "Corda (15 m)", "Tocha ×3", "Erva-de-sangue ×2"],
};

export const JOURNAL = [
  { day: 1, time: "Manhã", text: "Parti do acampamento na borda da Charneca. O vento cheirava a corda molhada.", tag: "Partida" },
  { day: 1, time: "Tarde", text: "O enforcado que ainda respira. Cortei a corda. Ele me agradeceu tentando me matar. Venci.", tag: "Cena" },
  { day: 2, time: "Noite", text: "Vila de Pedra-Funda, cercada por lobos. Dormi na estalagem por 5 ouro.", tag: "Vila" },
  { day: 2, time: "Noite", text: "Hesper, a ferreira cega, pediu que eu trouxesse o martelo do filho, perdido na ruína ao norte.", tag: "Pedido" },
  { day: 3, time: "Manhã", text: "Subi ao nível 2. Aprendi Estocada Dupla.", tag: "Nível" },
];
