import { MON_BY_ID, MONS, type Post, SEED_POSTS } from "./data";

export const STORAGE_KEY = "safirity:v1";

export type Plot = {
  id: number;
  monId: string | null;
  /** timestamp da última colheita */
  since: number;
};

export type SafirityState = {
  trainer: string;
  level: number;
  xp: number;
  coins: number;
  owned: string[];
  plots: Plot[];
  posts: Post[];
  myEmotes: Record<string, string[]>; // postId -> emoteIds reagidos
  lastSeen: number;
};

export const PLOT_COUNT = 9;
export const CAP_HOURS = 8;

export function defaultState(): SafirityState {
  const now = Date.now();
  return {
    trainer: "Treinador",
    level: 1,
    xp: 0,
    coins: 150,
    owned: ["bulbasaur", "charmander", "squirtle"],
    plots: Array.from({ length: PLOT_COUNT }, (_, i) => ({
      id: i,
      monId: i === 0 ? "bulbasaur" : null,
      since: now,
    })),
    posts: SEED_POSTS,
    myEmotes: {},
    lastSeen: now,
  };
}

export function loadState(): SafirityState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<SafirityState>;
    const base = defaultState();
    return {
      ...base,
      ...parsed,
      plots: Array.isArray(parsed.plots) && parsed.plots.length === PLOT_COUNT ? parsed.plots : base.plots,
      posts: Array.isArray(parsed.posts) && parsed.posts.length > 0 ? parsed.posts : base.posts,
      myEmotes: parsed.myEmotes ?? {},
      owned: Array.isArray(parsed.owned) && parsed.owned.length > 0 ? parsed.owned : base.owned,
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: SafirityState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage cheio ou bloqueado */
  }
}

/** bônus de sinergia: plots vizinhos (linha 3x3) do mesmo tipo dão +25% */
export function synergyBonus(plots: Plot[], index: number): number {
  const mon = plots[index]?.monId ? MON_BY_ID[plots[index].monId!] : null;
  if (!mon) return 0;
  const neighbors = [index - 1, index + 1, index - 3, index + 3];
  let same = 0;
  for (const n of neighbors) {
    if (n < 0 || n >= plots.length) continue;
    if (Math.abs((n % 3) - (index % 3)) > 1) continue;
    const other = plots[n]?.monId ? MON_BY_ID[plots[n].monId!] : null;
    if (other && other.type === mon.type) same++;
  }
  return same * 0.25;
}

/** moedas acumuladas por plot, com teto de CAP_HOURS */
export function plotPending(plots: Plot[], index: number, now: number): number {
  const plot = plots[index];
  if (!plot?.monId) return 0;
  const mon = MON_BY_ID[plot.monId];
  if (!mon) return 0;
  const hours = Math.min((now - plot.since) / 3_600_000, CAP_HOURS);
  const rate = mon.rate * (1 + synergyBonus(plots, index));
  return Math.floor(hours * rate);
}

export function totalPending(plots: Plot[], now: number): number {
  return plots.reduce((sum, _, i) => sum + plotPending(plots, i, now), 0);
}

export function ratePerHour(plots: Plot[]): number {
  return plots.reduce((sum, plot, i) => {
    if (!plot.monId) return sum;
    const mon = MON_BY_ID[plot.monId];
    if (!mon) return sum;
    return sum + mon.rate * (1 + synergyBonus(plots, i));
  }, 0);
}

export function xpForLevel(level: number) {
  return 120 * level;
}

export function grantXp(state: SafirityState, amount: number): SafirityState {
  let xp = state.xp + amount;
  let level = state.level;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level++;
  }
  return { ...state, xp, level };
}

export function collectionProgress(owned: string[]) {
  return { owned: owned.length, total: MONS.length };
}
