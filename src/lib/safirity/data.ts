import pikachu from "@/assets/pikachu.gif";
import charizard from "@/assets/charizard.gif";
import mewtwo from "@/assets/mewtwo.gif";
import dragonite from "@/assets/dragonite.gif";
import bulbasaur from "@/assets/bulbasaur.gif";
import charmander from "@/assets/charmander.gif";
import squirtle from "@/assets/squirtle.gif";
import mew from "@/assets/mew.gif";
import jigglypuff from "@/assets/jigglypuff.gif";
import butterfree from "@/assets/butterfree.gif";

export type Rarity = "comum" | "raro" | "epico" | "lendario";

export type Mon = {
  id: string;
  name: string;
  sprite: string;
  type: string;
  rarity: Rarity;
  /** moedas por hora quando plantado na land */
  rate: number;
  /** custo em moedas para adotar */
  cost: number;
};

export const MONS: Mon[] = [
  { id: "bulbasaur", name: "Bulbasaur", sprite: bulbasaur, type: "Planta", rarity: "comum", rate: 12, cost: 0 },
  { id: "charmander", name: "Charmander", sprite: charmander, type: "Fogo", rarity: "comum", rate: 12, cost: 0 },
  { id: "squirtle", name: "Squirtle", sprite: squirtle, type: "Água", rarity: "comum", rate: 12, cost: 0 },
  { id: "pikachu", name: "Pikachu", sprite: pikachu, type: "Elétrico", rarity: "raro", rate: 26, cost: 250 },
  { id: "jigglypuff", name: "Jigglypuff", sprite: jigglypuff, type: "Fada", rarity: "comum", rate: 16, cost: 120 },
  { id: "butterfree", name: "Butterfree", sprite: butterfree, type: "Inseto", rarity: "raro", rate: 22, cost: 200 },
  { id: "dragonite", name: "Dragonite", sprite: dragonite, type: "Dragão", rarity: "epico", rate: 55, cost: 900 },
  { id: "charizard", name: "Charizard", sprite: charizard, type: "Fogo", rarity: "epico", rate: 60, cost: 1100 },
  { id: "mewtwo", name: "Mewtwo", sprite: mewtwo, type: "Psíquico", rarity: "lendario", rate: 130, cost: 3200 },
  { id: "mew", name: "Mew", sprite: mew, type: "Psíquico", rarity: "lendario", rate: 120, cost: 2800 },
];

export const MON_BY_ID: Record<string, Mon> = Object.fromEntries(MONS.map((m) => [m.id, m]));

export const RARITY_STYLE: Record<Rarity, { ring: string; text: string; glow: string; label: string }> = {
  comum: { ring: "border-slate-500/40", text: "text-slate-300", glow: "from-slate-400/20 to-slate-600/20", label: "Comum" },
  raro: { ring: "border-sky-400/50", text: "text-sky-300", glow: "from-sky-400/25 to-blue-600/25", label: "Raro" },
  epico: { ring: "border-fuchsia-400/50", text: "text-fuchsia-300", glow: "from-fuchsia-400/25 to-purple-600/25", label: "Épico" },
  lendario: { ring: "border-amber-300/60", text: "text-amber-300", glow: "from-amber-300/30 to-orange-600/30", label: "Lendário" },
};

/** Emotes de pokémon usados nas reações do feed */
export type Emote = { id: string; label: string; sprite: string };

export const EMOTES: Emote[] = [
  { id: "pika", label: "Pika!", sprite: pikachu },
  { id: "fire", label: "Fogo!", sprite: charmander },
  { id: "cute", label: "Fofo!", sprite: jigglypuff },
  { id: "wow", label: "Uau!", sprite: mew },
  { id: "epic", label: "Épico!", sprite: charizard },
];

export type Post = {
  id: string;
  trainer: string;
  level: number;
  time: string;
  content: string;
  monId?: string;
  badge?: string;
  emotes: Record<string, number>;
  comments: number;
};

export const SEED_POSTS: Post[] = [
  {
    id: "p1",
    trainer: "RedFlame",
    level: 42,
    time: "há 2h",
    content: "Meu Charizard fechou o turno da fazenda de Safira com +1.400 moedas! 🔥",
    monId: "charizard",
    badge: "Colheita Épica",
    emotes: { epic: 42, fire: 18 },
    comments: 12,
  },
  {
    id: "p2",
    trainer: "LunaMoon",
    level: 35,
    time: "há 4h",
    content: "Dica: coloque tipos iguais em plots vizinhos para ganhar bônus de sinergia na land.",
    monId: "pikachu",
    badge: "Dica da Comunidade",
    emotes: { pika: 30, wow: 9 },
    comments: 7,
  },
  {
    id: "p3",
    trainer: "SafiraKid",
    level: 12,
    time: "há 6h",
    content: "Adotei meu primeiro Jigglypuff hoje. A land ficou muito mais fofa 💜",
    monId: "jigglypuff",
    emotes: { cute: 51 },
    comments: 21,
  },
];

export const CLUBS = [
  { name: "Clube dos Shinys", members: "23.8K", color: "text-amber-300" },
  { name: "Clube dos Fazendeiros", members: "18.5K", color: "text-emerald-300" },
  { name: "Clube dos Artistas", members: "12.4K", color: "text-pink-300" },
];
