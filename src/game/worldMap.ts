
import worldMapBgAsset from "@/assets/world-map.png.asset.json";
const overworldAsset = worldMapBgAsset;

export interface WorldRegion {
  id: string;
  name: string;
  x: number;
  y: number;
  minLevel: number;
  element: string;
  description: string;
  mapId: string;
}

export interface ObsidianPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  reqLevel: number;
  description: string;
}

export const WORLD_REGIONS: WorldRegion[] = [
  { id: "grasslands", name: "Gramado Inicial", x: 200, y: 300, minLevel: 1, element: "Planta", description: "Onde tudo começa.", mapId: "arena" },
  { id: "beach", name: "Praia Coral", x: 450, y: 250, minLevel: 15, element: "Água", description: "Brisa marinha e areia quente.", mapId: "praia" },
  { id: "snow", name: "Vale Verdejante de Neve", x: 150, y: 150, minLevel: 40, element: "Gelo", description: "Frio extremo e beleza gélida.", mapId: "neve" },
  { id: "desert", name: "Deserto Escaldante", x: 600, y: 400, minLevel: 50, element: "Fogo", description: "Calor insuportável e miragens.", mapId: "deserto" },
  { id: "cave", name: "Caverna Rochosa", x: 300, y: 500, minLevel: 60, element: "Pedra", description: "Escuridão e ecos profundos.", mapId: "caverna" },
  { id: "volcano", name: "Vulcão Ativo", x: 800, y: 150, minLevel: 400, element: "Fogo", description: "O coração ardente do mundo.", mapId: "vulcao_ativo" },
  { id: "abyss", name: "Abismo Gélido", x: 100, y: 700, minLevel: 1000, element: "Gelo", description: "O ponto mais profundo e frio.", mapId: "abismo_gelo" },
];

export const OBSIDIAN_POINTS: ObsidianPoint[] = [
  { id: "op1", name: "Nódulo de Obsidian Alfa", x: 350, y: 350, reqLevel: 100, description: "Energia pura concentrada." },
  { id: "op2", name: "Nódulo de Obsidian Beta", x: 700, y: 600, reqLevel: 500, description: "Pulso de escuridão profunda." },
];

export const WORLD_MAP_CONFIG = {
  bg: overworldAsset.url,
  width: 1000,
  height: 800,
};
