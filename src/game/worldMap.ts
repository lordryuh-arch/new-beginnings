export type IdleMapId =
  | "arena" | "terra" | "deserto_purpura" | "terry" | "n2" | "n3" | "pantano_fogo" | "venofogo" | "praia" | "neve" | "deserto" | "caverna" | "fantasma"
  | "gelius1" | "gelius2"
  | "vale_rochas" | "vale_planta" | "vale_gelo" | "vale_veneno" | "vale_fogo"
  | "vulcao_ativo" | "nucleo_primordial"
  | "abismo_gelo" | "abismo_veneno" | "abismo_raio" | "abismo_sombra" | "abismo_dragao"
  | "cadeia_ab" | "cadeia_ab1" | "cadeia_f1"
  | "evento_myth"
  | "oddish_o1" | "oddish_o2" | "oddish_o3"
  | "grass_oddish"
  | "absol_start" | "governante_hall"
  | "continent3_map1" | "continent3_map2";


export type ElementType = "grass" | "fire" | "water" | "electric" | "poison" | "ice" | "rock" | "fighting" | "flying" | "dark" | "ethereal" | "stellar";

export interface ObsidianPoint {
  id: string;
  name: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  requiredLevel: number;
  description: string;
  rewards?: { gold?: number; crystals?: number };
}

export interface WorldRegion {
  id: string;
  name: string;
  element: ElementType;
  requiredLevel: number;
  centerPos: { x: number; y: number }; // Percentage 0-100
  mapIds: IdleMapId[];
  obsidianPoints: ObsidianPoint[];
  description: string;
}

export const WORLD_REGIONS: WorldRegion[] = [
  {
    id: "grasslands",
    name: "Planícies Verdejantes",
    element: "grass",
    requiredLevel: 1,
    centerPos: { x: 30, y: 30 },
    mapIds: ["arena", "praia", "neve"],
    description: "Uma vasta área verde onde a jornada começa.",
    obsidianPoints: [
      { id: "op_grass_1", name: "Núcleo da Floresta", x: 28, y: 25, requiredLevel: 5, description: "Um antigo nó de energia pulsando sob as raízes." }
    ]
  },
  {
    id: "arid_wastes",
    name: "Desertos Áridos",
    element: "fire",
    requiredLevel: 20,
    centerPos: { x: 70, y: 30 },
    mapIds: ["deserto_purpura", "deserto", "caverna"],
    description: "Terras secas e perigosas, ricas em minerais e calor.",
    obsidianPoints: [
      { id: "op_fire_1", name: "Fenda de Lava", x: 72, y: 28, requiredLevel: 25, description: "Onde o calor da terra se manifesta como energia pura." }
    ]
  },
  {
    id: "shadow_depths",
    name: "Abismo Sombrio",
    element: "dark",
    requiredLevel: 50,
    centerPos: { x: 50, y: 70 },
    mapIds: ["fantasma", "abismo_gelo", "abismo_veneno", "abismo_raio", "abismo_sombra", "abismo_dragao"],
    description: "Onde a luz não chega e a energia Obsidian é mais forte.",
    obsidianPoints: [
      { id: "op_dark_1", name: "Olho do Abismo", x: 50, y: 75, requiredLevel: 60, description: "O ponto mais profundo de convergência de energia escura." }
    ]
  },
  {
    id: "endgame_peaks",
    name: "Picos do Destino",
    element: "stellar",
    requiredLevel: 300,
    centerPos: { x: 85, y: 80 },
    mapIds: ["vale_rochas", "vale_planta", "vale_gelo", "vale_veneno", "vale_fogo", "vulcao_ativo", "nucleo_primordial", "cadeia_ab", "cadeia_ab1", "cadeia_f1"],
    description: "O desafio final para os treinadores mais poderosos.",
    obsidianPoints: [
      { id: "op_stellar_1", name: "Nó do Infinito", x: 88, y: 85, requiredLevel: 500, description: "Energia pura vinda de além das estrelas." }
    ]
  }
];
