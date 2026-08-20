import { BookOpen, Coins, Sparkles, Sprout, Trophy } from "lucide-react";
import { MONS } from "@/lib/safirity/data";
import { xpForLevel, type SafirityState } from "@/lib/safirity/store";

export function TrainerBook({ state, rate }: { state: SafirityState; rate: number }) {
  const need = xpForLevel(state.level);
  const pct = Math.min(100, Math.round((state.xp / need) * 100));

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#170e24] p-6 shadow-2xl">
      <BookOpen size={120} className="absolute right-4 top-2 text-purple-400 opacity-10" />
      <div className="relative">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Livro do Treinador</h2>
        <p className="mb-6 text-xs uppercase tracking-widest text-slate-400">Sua jornada na Safirity</p>

        <div className="mb-6">
          <div className="mb-1 flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Nível {state.level}</span>
            <span>
              {state.xp}/{need} XP
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat icon={<Coins size={16} className="text-amber-300" />} label="Moedas" value={state.coins.toLocaleString("pt-BR")} />
          <Stat icon={<Sprout size={16} className="text-emerald-300" />} label="Produção" value={`${Math.round(rate)}/h`} />
          <Stat
            icon={<Sparkles size={16} className="text-purple-300" />}
            label="Coleção"
            value={`${state.owned.length}/${MONS.length}`}
          />
          <Stat
            icon={<Trophy size={16} className="text-sky-300" />}
            label="Terrenos ativos"
            value={`${state.plots.filter((p) => p.monId).length}/${state.plots.length}`}
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-950">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
        <p className="font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
