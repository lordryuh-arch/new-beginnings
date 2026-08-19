import React, { useState, useMemo } from 'react';
import { WorldRegion, ObsidianPoint, WORLD_REGIONS, ElementType } from '../game/worldMap';
import { IdleMapId } from '../game/worldMap';
import { Sparkles, Lock, MapPin, ZoomIn, ZoomOut, Maximize2, X, Compass, Zap } from 'lucide-react';

interface WorldMapOverlayProps {
  onClose: () => void;
  trainerLevel: number;
  discoveredRegions: string[];
  activatedObsidianPoints: string[];
  currentMapId: IdleMapId;
  onEnterMap: (mapId: IdleMapId) => void;
  onActivateObsidian: (pointId: string) => void;
}

const ELEMENT_COLORS: Record<ElementType, string> = {
  grass: '#4ade80',
  fire: '#f87171',
  water: '#60a5fa',
  electric: '#facc15',
  poison: '#c084fc',
  ice: '#7dd3fc',
  rock: '#d1d5db',
  fighting: '#fb923c',
  flying: '#93c5fd',
  dark: '#4b5563',
  ethereal: '#a78bfa',
  stellar: '#f472b6',
};

export const WorldMapOverlay: React.FC<WorldMapOverlayProps> = ({
  onClose,
  trainerLevel,
  discoveredRegions,
  activatedObsidianPoints,
  currentMapId,
  onEnterMap,
  onActivateObsidian,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<WorldRegion | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [activeFilter, setActiveFilter] = useState<'all' | 'regions' | 'obsidian'>('all');

  const isRegionUnlocked = (region: WorldRegion) => trainerLevel >= region.requiredLevel;
  const isRegionDiscovered = (region: WorldRegion) => discoveredRegions.includes(region.id);
  const isObsidianActivated = (pointId: string) => activatedObsidianPoints.includes(pointId);

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-300">
      <div className="relative w-full h-full max-w-6xl bg-[#0b0510] border-2 border-[#f5cf6b] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(245,207,107,0.2)] flex flex-col md:flex-row">
        
        {/* Sidebar / Info Panel */}
        <div className="w-full md:w-80 h-48 md:h-full bg-[#1a1030] border-b md:border-b-0 md:border-r border-[#f5cf6b]/30 p-4 flex flex-col gap-4 overflow-y-auto z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-[#f5cf6b] font-black text-xl tracking-wider">MAPA MUNDI</h2>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-[#f5cf6b] transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-[10px] text-[#f5cf6b]/60 font-bold uppercase tracking-widest">Nível do Treinador</div>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 bg-black/40 rounded-full overflow-hidden border border-[#f5cf6b]/20">
                <div 
                  className="h-full bg-gradient-to-r from-[#f5cf6b] to-[#ffd94d]" 
                  style={{ width: `${Math.min(100, (trainerLevel / 500) * 100)}%` }}
                />
              </div>
              <span className="text-[#f5cf6b] font-black text-sm">Lv.{trainerLevel}</span>
            </div>
          </div>

          <div className="space-y-4 mt-2">
            {selectedRegion ? (
              <div className="animate-in slide-in-from-left duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ELEMENT_COLORS[selectedRegion.element] }} />
                  <h3 className="text-white font-black text-lg uppercase tracking-tight">{selectedRegion.name}</h3>
                </div>
                
                <p className="text-sm text-gray-400 leading-relaxed mb-4">{selectedRegion.description}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-black/40 p-2 rounded border border-white/5">
                    <div className="text-[9px] text-gray-500 uppercase font-bold">Elemento</div>
                    <div className="text-xs font-bold capitalize" style={{ color: ELEMENT_COLORS[selectedRegion.element] }}>{selectedRegion.element}</div>
                  </div>
                  <div className="bg-black/40 p-2 rounded border border-white/5">
                    <div className="text-[9px] text-gray-500 uppercase font-bold">Req. Nível</div>
                    <div className="text-xs font-bold text-white">Lv.{selectedRegion.requiredLevel}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] text-[#f5cf6b] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Zap size={10} /> Pontos Obsidian ({selectedRegion.obsidianPoints.filter(p => isObsidianActivated(p.id)).length}/{selectedRegion.obsidianPoints.length})
                  </h4>
                  {selectedRegion.obsidianPoints.map(point => (
                    <button 
                      key={point.id}
                      onClick={() => onActivateObsidian(point.id)}
                      disabled={isObsidianActivated(point.id) || trainerLevel < point.requiredLevel}
                      className={`w-full p-2 rounded border text-left transition-all ${
                        isObsidianActivated(point.id) 
                          ? 'bg-purple-900/20 border-purple-500/30 text-purple-300' 
                          : trainerLevel >= point.requiredLevel 
                            ? 'bg-black/40 border-white/10 text-white hover:border-[#f5cf6b]/50' 
                            : 'bg-black/20 border-white/5 text-gray-600 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center justify-between">
                        {point.name}
                        {isObsidianActivated(point.id) && <Sparkles size={10} />}
                      </div>
                      <div className="text-[9px] opacity-70">Lv.{point.requiredLevel}</div>
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => onEnterMap(selectedRegion.mapIds[0])}
                  disabled={!isRegionUnlocked(selectedRegion)}
                  className={`w-full mt-6 py-3 rounded-lg font-black text-sm tracking-widest uppercase transition-all shadow-lg ${
                    isRegionUnlocked(selectedRegion)
                      ? 'bg-gradient-to-r from-[#f5cf6b] to-[#ffd94d] text-[#0b0510] hover:scale-[1.02] active:scale-95 shadow-[#f5cf6b]/20'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  {isRegionUnlocked(selectedRegion) ? 'ENTRAR NA REGIÃO' : `BLOQUEADO (LV.${selectedRegion.requiredLevel})`}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 space-y-4 opacity-60">
                <Compass size={48} className="animate-pulse" />
                <p className="text-xs font-medium uppercase tracking-widest leading-relaxed">Selecione uma região no mapa para ver detalhes da exploração</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-[#0d0915] overflow-hidden group cursor-grab active:cursor-grabbing">
          {/* Animated Background Gradients (Living World) */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,#4ade80_0%,transparent_50%)]" />
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,#f87171_0%,transparent_50%)]" />
            <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_80%,#60a5fa_0%,transparent_50%)]" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,#c084fc_0%,transparent_50%)]" />
          </div>

          {/* Map Grid/Texture */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')]" />

          {/* Interactive Layer */}
          <div 
            className="absolute inset-0 transition-transform duration-500 ease-out flex items-center justify-center"
            style={{ transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)` }}
          >
            <div className="relative w-[800px] h-[600px]">
              {/* Region Nodes */}
              {WORLD_REGIONS.map(region => {
                const unlocked = isRegionUnlocked(region);
                const active = selectedRegion?.id === region.id;
                
                return (
                  <div
                    key={region.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${region.centerPos.x}%`, top: `${region.centerPos.y}%` }}
                  >
                    <button
                      onClick={() => setSelectedRegion(region)}
                      className={`relative w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center group/node ${
                        active 
                          ? 'border-[#f5cf6b] bg-[#f5cf6b]/20 scale-125 z-20 shadow-[0_0_20px_rgba(245,207,107,0.5)]' 
                          : 'border-white/20 bg-black/40 hover:border-white/50 hover:scale-110 z-10'
                      } ${!unlocked && 'grayscale'}`}
                    >
                      {/* Pulse Effect for Unlocked */}
                      {unlocked && (
                        <div 
                          className="absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none" 
                          style={{ backgroundColor: ELEMENT_COLORS[region.element] }} 
                        />
                      )}
                      
                      {unlocked ? (
                        <MapPin size={24} style={{ color: ELEMENT_COLORS[region.element] }} />
                      ) : (
                        <Lock size={18} className="text-gray-500" />
                      )}

                      {/* Region Label */}
                      <div className={`absolute top-full mt-2 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[10px] font-black uppercase tracking-tighter whitespace-nowrap transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover/node:opacity-100'}`}>
                        {region.name}
                      </div>
                    </button>

                    {/* Obsidian Points for this region */}
                    {unlocked && region.obsidianPoints.map(point => {
                      const activated = isObsidianActivated(point.id);
                      return (
                        <div
                          key={point.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2"
                          style={{ 
                            left: `${(point.x - region.centerPos.x) * 4}px`, 
                            top: `${(point.y - region.centerPos.y) * 4}px` 
                          }}
                        >
                          <div 
                            className={`w-3 h-3 rounded-full border border-purple-500/50 transition-all duration-500 ${
                              activated 
                                ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-pulse scale-125' 
                                : 'bg-black/80 hover:bg-purple-900/50'
                            }`}
                            title={point.name}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map HUD Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
            <button onClick={() => handleZoom(0.25)} className="p-3 bg-[#1a1030]/80 border border-[#f5cf6b]/30 rounded-full text-[#f5cf6b] hover:bg-[#f5cf6b] hover:text-[#0b0510] transition-all shadow-lg active:scale-95">
              <ZoomIn size={20} />
            </button>
            <button onClick={() => handleZoom(-0.25)} className="p-3 bg-[#1a1030]/80 border border-[#f5cf6b]/30 rounded-full text-[#f5cf6b] hover:bg-[#f5cf6b] hover:text-[#0b0510] transition-all shadow-lg active:scale-95">
              <ZoomOut size={20} />
            </button>
            <button onClick={resetView} className="p-3 bg-[#1a1030]/80 border border-[#f5cf6b]/30 rounded-full text-[#f5cf6b] hover:bg-[#f5cf6b] hover:text-[#0b0510] transition-all shadow-lg active:scale-95">
              <Maximize2 size={20} />
            </button>
          </div>

          {/* Overlay Vingette */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
        </div>
      </div>
    </div>
  );
};
