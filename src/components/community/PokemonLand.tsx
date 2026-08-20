import { useMemo } from "react";
import { Coins, Sprout, Sparkles } from "lucide-react";
import { MON_BY_ID, RARITY_STYLE, type Mon } from "@/lib/safirity/data";
import { CAP_HOURS, plotPending, ratePerHour, synergyBonus, type Plot } from "@/lib/safirity/store";
import { cn } from "@/lib/utils";

type Props = {
  plots: Plot[];
  now: number;
  ownedMons: Mon[];
  selectedMonId: string | null;
  onSelectMon: (id: string | null) => void;
  onPlant: (plotIndex: number) => void;
  onClearPlot: (plotIndex: number) => void;
  onHarvestAll: () => void;
  pending: number;
};

export function PokemonLand({
  plots,
  now,
  ownedMons,
  selectedMonId,
  onSelectMon,
  onPlant,
  onClearPlot,
  onHarvestAll,
  pending,
}: Props) {
  const rate = useMemo(() => Math.round(ratePerHour(plots)), [plots]);

  return (
    <section className="rounded-3xl border-4 border-[#0f380f] bg-[#9bbc0f] p-4 shadow-[0_0_0_4px_#306230,0_18px_40px_rgba(0,0,0,0.5)]">
      {/* Barra estilo GameBoy */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#0f380f] px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-[#9bbc0f]">
        <span className="flex items-center gap-1">
          <Sprout size={12} /> Safirity Land
        </span>
        <span className="flex items-center gap-2">
          <Coins size={12} /> {rate}/h · teto {CAP_HOURS}h
        </span>
      </div>

      {/* Grid de terrenos */}
      <div className="grid grid-cols-3 gap-2">
        {plots.map((plot, index) => {
          const mon = plot.monId ? MON_BY_ID[plot.monId] : null;
          const gain = plotPending(plots, index, now);
          const bonus = synergyBonus(plots, index);
          return (
            <button
              key={plot.id}
              type="button"
              onClick={() => (mon ? onClearPlot(index) : onPlant(index))}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-lg border-4 border-[#306230] bg-[#8bac0f] transition-transform active:scale-95",
                !mon && "hover:bg-[#a8c73a]",
              )}
              title={mon ? `${mon.name} — clique para recolher do terreno` : "Plantar pokémon selecionado"}
            >
              {/* textura de canteiro */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg,#306230 0 2px,transparent 2px 10px),repeating-linear-gradient(90deg,#306230 0 2px,transparent 2px 10px)",
                }}
              />
              {mon ? (
                <>
                  <img
                    src={mon.sprite}
                    alt={mon.name}
                    className="pixelated absolute inset-0 m-auto h-3/5 w-3/5 object-contain drop-shadow-[2px_2px_0_#0f380f]"
                    style={{ imageRendering: "pixelated" }}
                    loading="lazy"
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-[#0f380f]/85 py-0.5 font-mono text-[9px] font-bold uppercase text-[#9bbc0f]">
                    +{gain}
                  </span>
                  {bonus > 0 && (
                    <span className="absolute right-1 top-1 flex items-center gap-0.5 rounded bg-[#0f380f]/85 px-1 font-mono text-[8px] text-amber-300">
                      <Sparkles size={8} /> +{Math.round(bonus * 100)}%
                    </span>
                  )}
                </>
              ) : (
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase text-[#0f380f]/60">
                  vazio
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Colher */}
      <button
        type="button"
        onClick={onHarvestAll}
        disabled={pending <= 0}
        className="mt-3 w-full rounded-xl border-4 border-[#0f380f] bg-[#306230] py-3 font-mono text-xs font-black uppercase tracking-widest text-[#9bbc0f] transition-colors hover:bg-[#0f380f] disabled:opacity-50"
      >
        Colher {pending > 0 ? `${pending} moedas` : "— nada pronto"}
      </button>

      {/* Seleção de pokémon */}
      <div className="mt-4 rounded-xl bg-[#0f380f]/90 p-3">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#9bbc0f]">
          Escolha quem trabalha na land
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ownedMons.map((mon) => {
            const active = selectedMonId === mon.id;
            return (
              <button
                key={mon.id}
                type="button"
                onClick={() => onSelectMon(active ? null : mon.id)}
                className={cn(
                  "flex min-w-[74px] flex-col items-center gap-1 rounded-lg border-2 p-2 transition-all",
                  active ? "border-amber-300 bg-amber-300/15" : "border-[#9bbc0f]/25 hover:border-[#9bbc0f]/60",
                )}
              >
                <img
                  src={mon.sprite}
                  alt={mon.name}
                  className="h-10 w-10 object-contain"
                  style={{ imageRendering: "pixelated" }}
                  loading="lazy"
                />
                <span className="font-mono text-[9px] uppercase text-[#9bbc0f]">{mon.name}</span>
                <span className={cn("font-mono text-[8px]", RARITY_STYLE[mon.rarity].text)}>{mon.rate}/h</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
