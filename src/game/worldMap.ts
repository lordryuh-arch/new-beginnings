
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

// Mapa Mundi V3 - Posicionamento baseado na nova imagem épica
export const WORLD_REGIONS: WorldRegion[] = [
  // Canto Superior Esquerdo (Neve/Gelo)
  { id: "snow", name: "Vale Verdejante de Neve", x: 150, y: 180, minLevel: 40, element: "Gelo", description: "Frio extremo e beleza gélida.", mapId: "neve" },
  { id: "abyss", name: "Abismo Gélido", x: 180, y: 250, minLevel: 1000, element: "Gelo", description: "O ponto mais profundo e frio.", mapId: "abismo_gelo" },
  
  // Região Central Superior (Bosques/Floresta)
  { id: "grasslands", name: "Gramado Inicial", x: 450, y: 220, minLevel: 1, element: "Planta", description: "Onde tudo começa.", mapId: "arena" },
  { id: "praia_coral", name: "Praia Coral", x: 550, y: 350, minLevel: 15, element: "Água", description: "Brisa marinha e areia quente.", mapId: "praia" },
  
  // Lado Esquerdo Inferior (Lava/Fogo)
  { id: "vale_fogo", name: "Vale Ígneo", x: 150, y: 650, minLevel: 330, element: "Fogo", description: "Calor e lava.", mapId: "vale_fogo" },
  { id: "vulcao", name: "Vulcão Ativo", x: 220, y: 750, minLevel: 400, element: "Fogo", description: "O coração ardente do mundo.", mapId: "vulcao_ativo" },
  
  // Região Central Inferior (Ilhas Tropicais)
  { id: "ilha_oddish", name: "Odisséia Oddish", x: 480, y: 780, minLevel: 1, element: "Planta", description: "Ilhas misteriosas.", mapId: "oddish_o1" },
  
  // Lado Direito Inferior (Montanhas/Rochas)
  { id: "cave", name: "Caverna Rochosa", x: 750, y: 700, minLevel: 60, element: "Pedra", description: "Escuridão e ecos profundos.", mapId: "caverna" },
  { id: "vale_rochas", name: "Vale das Rochas", x: 820, y: 620, minLevel: 50, element: "Pedra", description: "Picos rochosos.", mapId: "vale_rochas" },

  // Canto Superior Direito (Sombrio/Endgame)
  { id: "pantano_fogo", name: "Pântano em Chamas", x: 780, y: 180, minLevel: 700, element: "Fogo/Veneno", description: "Onde o perigo espreita.", mapId: "pantano_fogo" },
  { id: "absol_hall", name: "Salão do Governante", x: 850, y: 120, minLevel: 1, element: "Lendário", description: "O domínio final.", mapId: "governante_hall" },
  
  // Lado Direito Central (Deserto)
  { id: "desert", name: "Deserto Escaldante", x: 820, y: 450, minLevel: 50, element: "Fogo", description: "Calor insuportável.", mapId: "deserto" },
];

export const OBSIDIAN_POINTS: ObsidianPoint[] = [
  { id: "op1", name: "Nódulo de Obsidian Alfa", x: 420, y: 480, reqLevel: 100, description: "Energia pura concentrada." },
  { id: "op2", name: "Nódulo de Obsidian Beta", x: 700, y: 300, reqLevel: 500, description: "Pulso de escuridão profunda." },
  { id: "op3", name: "Vórtice Abissal", x: 920, y: 880, reqLevel: 2500, description: "O fim de tudo." },
];

export const WORLD_MAP_CONFIG = {
  bg: overworldAsset.url,
  width: 1000,
  height: 800,
};
