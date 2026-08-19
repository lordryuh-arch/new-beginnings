import React from 'react';
import { WorldMapOverlay } from '@/components/WorldMapOverlay';
import { WORLD_REGIONS } from '@/game/worldMap';
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute('/idle')({
  component: IdlePage,
});

function IdlePage() {
  const [showWorldMap, setShowWorldMap] = useState(false);
  const [idle, setIdle] = useState<any>({ 
    trainerLevel: 25, 
    currentMap: 'initial', 
    discoveredRegions: ['grasslands', 'fire_island', 'ice_fortress'], 
    activatedObsidianPoints: [] 
  });
  
  const pushChat = (m: string, c: string) => console.log(m, c);

  return (
    <div style={{ height: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      <div style={{ padding: 20, borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1a1a1a' }}>
        <h1 style={{ color: '#f5cf6b', margin: 0 }}>RubyM Idle - MUNDO VIVO</h1>
        <button 
          onClick={() => setShowWorldMap(true)}
          style={{ 
            padding: '10px 20px', 
            background: 'linear-gradient(135deg, #f5cf6b, #d9a441)', 
            color: '#1a0f26', 
            border: 'none',
            borderRadius: 6, 
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(245,207,107,0.4)'
          }}
        >
          🗺️ ABRIR MAPA MUNDI
        </button>
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: 40, textAlign: 'center' }}>
        <div style={{ background: '#1a0f26', padding: '30px', borderRadius: 12, border: '1px solid #f5cf6b33', maxWidth: 600 }}>
           <h2 style={{ color: '#f5cf6b' }}>Bem-vindo ao Novo Sistema de Mapas</h2>
           <p style={{ color: '#ccc', lineHeight: '1.6' }}>
             O Living World Map permite que você explore as ilhas elementais e ative os pontos de energia Obsidian.
           </p>
           <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 20 }}>
             <div style={{ background: '#2a1a3e', padding: 15, borderRadius: 8 }}>
               <div style={{ fontSize: 10, color: '#8fd0ff' }}>NÍVEL</div>
               <div style={{ fontSize: 24, fontWeight: 900 }}>{idle.trainerLevel}</div>
             </div>
             <div style={{ background: '#2a1a3e', padding: 15, borderRadius: 8 }}>
               <div style={{ fontSize: 10, color: '#8fd0ff' }}>MAPA ATUAL</div>
               <div style={{ fontSize: 18, fontWeight: 900, textTransform: 'uppercase' }}>{idle.currentMap}</div>
             </div>
           </div>
        </div>
        
        {showWorldMap && (
          <WorldMapOverlay
            onClose={() => setShowWorldMap(false)}
            trainerLevel={idle.trainerLevel ?? 1}
            discoveredRegions={idle.discoveredRegions ?? ["grasslands"]}
            activatedObsidianPoints={idle.activatedObsidianPoints ?? []}
            currentMapId={idle.currentMap}
            onEnterMap={(target) => {
              setIdle((s: any) => ({ ...s, currentMap: target }));
              setShowWorldMap(false);
            }}
            onActivateObsidian={(pointId) => {
              setIdle((s: any) => {
                const current = s.activatedObsidianPoints ?? [];
                if (current.includes(pointId)) return s;
                return { ...s, activatedObsidianPoints: [...current, pointId] };
              });
              pushChat("✦ Energia Obsidian despertada!", "cap");
            }}
          />
        )}
      </div>
    </div>
  );
}

export default IdlePage;
