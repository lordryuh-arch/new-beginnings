export type RegionState = "LOCKED" | "DISCOVERED" | "UNLOCKED" | "COMPLETED";

export type WorldRegion = {
  id: string;
  name: string;
  description: string;
  element: "Fire" | "Water" | "Ice" | "Forest" | "Shadow" | "Earth" | "Wind";
  requiredLevel: number;
  mapIds: string[];
  x: number; 
  y: number;
  color: string;
  obsidianPoint?: {
    x: number;
    y: number;
    id: string;
    power: number;
  };
};

export const WORLD_REGIONS: WorldRegion[] = [
  {
    id: "vale_verdejante",
    name: "Vale Verdejante",
    description: "Uma floresta densa e vibrante, berço da vida selvagem.",
    element: "Forest",
    requiredLevel: 1,
    mapIds: ["arena", "terra"],
    x: 25,
    y: 35,
    color: "#4ade80",
    obsidianPoint: { id: "op_vale", x: 26, y: 34, power: 100 }
  },
  {
    id: "deserto_anubis",
    name: "Deserto de Anúbis",
    description: "Areias escaldantes que escondem segredos de uma civilização perdida.",
    element: "Earth",
    requiredLevel: 20,
    mapIds: ["deserto_purpura", "deserto"],
    x: 70,
    y: 20,
    color: "#facc15",
    obsidianPoint: { id: "op_deserto", x: 72, y: 18, power: 250 }
  },
  {
    id: "abismo_glacial",
    name: "Abismo Glacial",
    description: "Picos congelados onde apenas os mais fortes sobrevivem ao frio.",
    element: "Ice",
    requiredLevel: 40,
    mapIds: ["neve", "abismo_gelo", "vale_gelo"],
    x: 45,
    y: 15,
    color: "#60a5fa",
    obsidianPoint: { id: "op_gelo", x: 44, y: 14, power: 400 }
  },
  {
    id: "pantano_ardente",
    name: "Pântano Ardente",
    description: "Lava e pântanos tóxicos fundidos em um ecossistema perigoso.",
    element: "Fire",
    requiredLevel: 25,
    mapIds: ["venofogo", "pantano_fogo", "vale_fogo"],
    x: 60,
    y: 65,
    color: "#f87171",
    obsidianPoint: { id: "op_fogo", x: 62, y: 67, power: 300 }
  },
  {
    id: "costa_coral",
    name: "Costa Coral",
    description: "Águas cristalinas e recifes repletos de mistérios marinhos.",
    element: "Water",
    requiredLevel: 15,
    mapIds: ["praia"],
    x: 15,
    y: 60,
    color: "#2dd4bf"
  },
  {
    id: "nucleo_sombrio",
    name: "Núcleo Sombrio",
    description: "A origem de toda a corrupção Obsidian. O desafio final.",
    element: "Shadow",
    requiredLevel: 200,
    mapIds: ["abismo_sombra", "abismo_veneno", "nucleo_primordial"],
    x: 85,
    y: 80,
    color: "#a855f7",
    obsidianPoint: { id: "op_shadow", x: 86, y: 82, power: 1000 }
  }
];