import React from 'react';
import { Sparkles, Shield, Zap } from 'lucide-react';

export function CollectibleCard({ pokemon, rarity, type }: any) {
  const getRarityColor = () => {
    switch(rarity.toLowerCase()) {
      case 'shiny': return 'from-yellow-400 to-orange-500';
      case 'lendario': return 'from-purple-500 to-blue-600';
      default: return 'from-slate-400 to-slate-600';
    }
  };

  return (
    <div className="relative group perspective-1000">
      <div className="relative w-full aspect-[2/3] rounded-2xl bg-[#1e142b] border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 transform-gpu group-hover:rotate-y-12 group-hover:scale-105 group-hover:shadow-purple-500/20">
        {/* Card Header */}
        <div className="p-3 flex justify-between items-center bg-white/5 border-b border-white/5">
          <span className="text-[10px] font-black text-white/50 tracking-tighter uppercase italic italic">TRAINER EDITION</span>
          <div className="flex gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
             <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Artwork Area */}
        <div className="relative h-[60%] bg-gradient-to-b from-white/5 to-transparent overflow-hidden flex items-center justify-center">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           <div className={`absolute w-40 h-40 rounded-full blur-[60px] opacity-30 bg-gradient-to-tr ${getRarityColor()}`} />
           
           <div className="relative z-10 text-center scale-150 transform-gpu group-hover:scale-[1.7] transition-transform duration-700">
             <Sparkles className="text-white/20 absolute -top-4 -right-4" size={24} />
             {/* Character placeholder */}
             <div className="w-24 h-24 flex items-center justify-center">
               <div className="w-20 h-20 rounded-full bg-purple-500/20 animate-pulse border border-purple-500/30 flex items-center justify-center">
                 <Sparkles className="text-purple-400/50" size={32} />
               </div>
             </div>
           </div>
        </div>

        {/* Card Content */}
        <div className="p-4 relative">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getRarityColor()}`} />
          <h3 className="text-xl font-black text-white italic tracking-tighter mb-1 uppercase">{pokemon}</h3>
          <div className="flex items-center gap-2 mb-4">
             <span className="text-[10px] font-bold px-2 py-0.5 bg-white/10 rounded-full text-slate-300 uppercase tracking-widest">{rarity}</span>
             <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-500/20 rounded-full text-purple-400 uppercase tracking-widest">{type}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-white/5 p-2 rounded-lg border border-white/5">
              <div className="flex items-center gap-1 mb-1">
                <Shield size={10} className="text-blue-400" />
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Defesa</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 w-[75%]" />
              </div>
            </div>
            <div className="bg-white/5 p-2 rounded-lg border border-white/5">
              <div className="flex items-center gap-1 mb-1">
                <Zap size={10} className="text-yellow-400" />
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Ataque</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 w-[85%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
