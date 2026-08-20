import { Coins, Lock, Shield, Zap } from "lucide-react";
import { RARITY_STYLE, type Mon } from "@/lib/safirity/data";
import { cn } from "@/lib/utils";

type Props = {
  mon: Mon;
  owned: boolean;
  canAfford?: boolean;
  onAdopt?: (monId: string) => void;
};

export function CollectibleCard({ mon, owned, canAfford = false, onAdopt }: Props) {
  const rarity = RARITY_STYLE[mon.rarity];

  return (
    <div className={cn("group relative overflow-hidden rounded-2xl border bg-[#150d21] shadow-xl", rarity.ring)}>
      <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-3 py-2">
        <span className="text-[10px] font-black uppercase italic tracking-tighter text-white/50">Safirity Card</span>
        <span className={cn("text-[10px] font-black uppercase tracking-widest", rarity.text)}>{rarity.label}</span>
      </div>

      <div className={cn("relative flex h-36 items-center justify-center bg-gradient-to-b", rarity.glow)}>
        <img
          src={mon.sprite}
          alt={mon.name}
          className={cn(
            "h-24 w-24 object-contain transition-transform duration-500 group-hover:scale-110",
            !owned && "opacity-40 grayscale",
          )}
          style={{ imageRendering: "pixelated" }}
          loading="lazy"
        />
        {!owned && <Lock className="absolute right-2 top-2 text-white/40" size={16} />}
      </div>

      <div className="p-4">
        <h3 className="mb-1 text-lg font-black uppercase italic tracking-tighter text-white">{mon.name}</h3>
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-purple-300">
            {mon.type}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-300">
            <Coins size={10} /> {mon.rate}/h
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Stat icon={<Shield size={10} className="text-sky-400" />} label="Defesa" pct={Math.min(95, mon.rate)} color="bg-sky-400" />
          <Stat icon={<Zap size={10} className="text-amber-400" />} label="Ataque" pct={Math.min(95, mon.rate + 15)} color="bg-amber-400" />
        </div>

        {owned ? (
          <p className="mt-3 text-center text-[10px] font-black uppercase tracking-widest text-emerald-400">
            No seu time
          </p>
        ) : (
          <button
            type="button"
            onClick={() => onAdopt?.(mon.id)}
            disabled={!canAfford}
            className="mt-3 w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-2 text-[11px] font-black uppercase tracking-widest text-white transition-opacity disabled:opacity-40"
          >
            Adotar · {mon.cost}
          </button>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, pct, color }: { icon: React.ReactNode; label: string; pct: number; color: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/5 p-2">
      <div className="mb-1 flex items-center gap-1">
        {icon}
        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div className={cn("h-full", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
