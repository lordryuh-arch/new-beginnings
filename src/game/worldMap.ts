
export type WorldRegion = {
  id: string;
  name: string;
  element: "Fire" | "Water" | "Ice" | "Forest" | "Shadow" | "Earth" | "Wind";
  requiredLevel: number;
  mapIds: string[];
  x: number; // Percentual 0-100
  y: number; // Percentual 0-100
  obsidianPoint?: {
    x: number;
    y: number;
    id: string;
  };
};

export const WORLD_REGIONS: WorldRegion[] = [
  {
    id: "vale_verdejante",
    name: "Vale Verdejante",
    element: "Forest",
    requiredLevel: 1,
    mapIds: ["arena", "terra"],
    x: 25,
    y: 35,
    obsidianPoint: { id: "op_vale", x: 26, y: 34 }
  },
  {
    id: "deserto_anubis",
    name: "Deserto de Anúbis",
    element: "Earth",
    requiredLevel: 20,
    mapIds: ["deserto_purpura", "deserto"],
    x: 70,
    y: 20,
    obsidianPoint: { id: "op_deserto", x: 72, y: 18 }
  },
  {
    id: "abismo_glacial",
    name: "Abismo Glacial",
    element: "Ice",
    requiredLevel: 40,
    mapIds: ["neve", "abismo_gelo", "vale_gelo"],
    x: 45,
    y: 15,
    obsidianPoint: { id: "op_gelo", x: 44, y: 14 }
  },
  {
    id: "pantano_ardente",
    name: "Pântano Ardente",
    element: "Fire",
    requiredLevel: 25,
    mapIds: ["venofogo", "pantano_fogo", "vale_fogo"],
    x: 60,
    y: 65,
    obsidianPoint: { id: "op_fogo", x: 62, y: 67 }
  },
  {
    id: "costa_coral",
    name: "Costa Coral",
    element: "Water",
    requiredLevel: 15,
    mapIds: ["praia"],
    x: 15,
    y: 60
  },
  {
    id: "nucleo_sombrio",
    name: "Núcleo Sombrio",
    element: "Shadow",
    requiredLevel: 200,
    mapIds: ["abismo_sombra", "abismo_veneno", "nucleo_primordial"],
    x: 85,
    y: 80,
    obsidianPoint: { id: "op_shadow", x: 86, y: 82 }
  }
];
