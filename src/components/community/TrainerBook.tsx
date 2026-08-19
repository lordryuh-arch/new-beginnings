import React from 'react';
import { BookOpen, Star, Map, Zap, Trophy } from 'lucide-react';

export function TrainerBook({ trainerData }: any) {
  return (
    <div className="bg-[#1a0f26] rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <BookOpen size={120} className="text-purple-400" />
      </div>
      
      <div className="relative z-10">
        <h2 className="text-3xl font-black mb-2 tracking-tighter italic italic tracking-tighter">LIVRO DO TREINADOR</h2>
        <p className="text-slate-400 mb-8 text-sm uppercase tracking-widest">Sua jornada, seu legado.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BookStat icon={<Zap size={18} className="text-yellow-400" />} label="Primeiro Pokémon" value="Bulbasaur" date="15/02/2026" />
          <BookStat icon={<Star size={18} className="text-purple-400" />} label="Primeiro Shiny" value="Oddish" date="12/03/2026" />
          <BookStat icon={<Trophy size={18} className="text-blue-400" />} label="Conquista Rara" value="Mestre da Rota 1" date="20/03/2026" />
          <BookStat icon={<Map size={18} className="text-green-400" />} label="Região Descoberta" value="Floresta Verdejante" date="21/04/2026" />
        </div>
        
        <button className="mt-10 w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-xs">
          Ver livro completo
        </button>
      </div>
    </div>
  );
}

function BookStat({ icon, label, value, date }: any) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-white/10 shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{label}</p>
        <p className="text-white font-bold">{value}</p>
        <p className="text-[9px] text-slate-600 mt-0.5">{date}</p>
      </div>
    </div>
  );
}
