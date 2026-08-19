export type IdleMapId = string;


export interface WorldRegion {
  id: string;
  name: string;
  element: "fire" | "water" | "grass" | "ice" | "shadow" | "rock" | "electric" | "normal";
  mapIds: IdleMapId[];
  requiredLevel: number;
  x: number; // Percentual 0-100
  y: number; // Percentual 0-100
  description: string;
  connections: string[]; // IDs de outras regiões
}

export interface ObsidianPoint {
  id: string;
  regionId: string;
  name: string;
  x: number;
  y: number;
  unlockedAtLevel: number;
}

export const WORLD_REGIONS: WorldRegion[] = [
  {
    id: "floresta_inicial",
    name: "Floresta Verdejante",
    element: "grass",
    mapIds: ["floresta"],
    requiredLevel: 1,
    x: 25,
    y: 30,
    description: "Uma floresta densa e cheia de vida, ideal para novos treinadores.",
    connections: ["praia_sul", "caverna_leste"],
  },
  {
    id: "praia_sul",
    name: "Costa Esmeralda",
    element: "water",
    mapIds: ["praia"],
    requiredLevel: 15,
    x: 20,
    y: 60,
    description: "Águas cristalinas e pokémons aquáticos abundantes.",
    connections: ["floresta_inicial", "deserto_oeste"],
  },
  {
    id: "caverna_leste",
    name: "Montanhas Rochosas",
    element: "rock",
    mapIds: ["caverna", "vale_rochas"],
    requiredLevel: 40,
    x: 60,
    y: 25,
    description: "Cavernas profundas ricas em minérios e pokémons resistentes.",
    connections: ["floresta_inicial", "neve_norte", "pantano_sombrio"],
  },
  {
    id: "neve_norte",
    name: "Picos Gelados",
    element: "ice",
    mapIds: ["neve", "vale_gelo"],
    requiredLevel: 40,
    x: 75,
    y: 15,
    description: "Um deserto de gelo eterno onde apenas os mais fortes sobrevivem.",
    connections: ["caverna_leste"],
  },
  {
    id: "deserto_oeste",
    name: "Deserto de Fogo",
    element: "fire",
    mapIds: ["deserto", "venofogo", "vale_fogo", "vulcao_ativo"],
    requiredLevel: 50,
    x: 15,
    y: 80,
    description: "Calor insuportável e vulcões ativos definem esta região.",
    connections: ["praia_sul"],
  },
  {
    id: "pantano_sombrio",
    name: "Pântano das Sombras",
    element: "shadow",
    mapIds: ["fantasma", "vale_veneno"],
    requiredLevel: 30,
    x: 80,
    y: 70,
    description: "Uma área envolta em mistério e energia Obsidian.",
    connections: ["caverna_leste", "nucleo_final"],
  },
  {
    id: "nucleo_final",
    name: "Núcleo Primordial",
    element: "normal",
    mapIds: ["nucleo_primordial"],
    requiredLevel: 460,
    x: 50,
    y: 50,
    description: "O centro de toda a energia do mundo. O desafio final.",
    connections: ["pantano_sombrio"],
  }
];

export const OBSIDIAN_POINTS: ObsidianPoint[] = [
  { id: "op_1", regionId: "floresta_inicial", name: "Nó do Bosque", x: 28, y: 32, unlockedAtLevel: 5 },
  { id: "op_2", regionId: "caverna_leste", name: "Cristal de Rocha", x: 62, y: 28, unlockedAtLevel: 45 },
  { id: "op_3", regionId: "pantano_sombrio", name: "Núcleo de Sombras", x: 82, y: 72, unlockedAtLevel: 100 },
];
