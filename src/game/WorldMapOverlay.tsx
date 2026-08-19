import React, { useState, useMemo } from 'react';
import { WORLD_REGIONS, WorldRegion } from './worldMap';
import { assetUrlFromJson } from '@/lib/assetUrl';
import overworldAsset from '@/assets/overworld.png.asset.json';
import iconWorldGlobe from '@/assets/icon-world-globe-v2.png.asset.json';

type WorldMapOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  trainerLevel: number;
  currentMap: string;
  onTeleport: (mapId: string) => void;
  items: Record<string, number>;
  onConsumeTeleport: () => void;
};

export const WorldMapOverlay: React.FC<WorldMapOverlayProps> = ({
  isOpen,
  onClose,
  trainerLevel,
  currentMap,
  onTeleport,
  items,
  onConsumeTeleport
}) => {
  const [selectedRegion, setSelectedRegion] = useState<WorldRegion | null>(null);
  const [hoverRegion, setHoverRegion] = useState<WorldRegion | null>(null);
  
  if (!isOpen) return null;

  const mapUrl = assetUrlFromJson(overworldAsset);
  const teleportScrolls = items.scroll_teleport ?? 0;

  const handleEnterRegion = (region: WorldRegion) => {
    if (trainerLevel < region.requiredLevel) return;
    
    // Teleporta para o primeiro mapa da região
    const targetMap = region.mapIds[0];
    if (targetMap === currentMap) {
      onClose();
      return;
    }

    if (teleportScrolls > 0) {
      onConsumeTeleport();
      onTeleport(targetMap);
      onClose();
    } else {
      // Se não tiver scroll, talvez apenas feche ou mostre aviso? 
      // O prompt diz "clicar e teleportar", assumiremos que consome se tiver.
      // Se for gratuito, basta remover a verificação.
      onTeleport(targetMap);
      onClose();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10005,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backdropFilter: 'blur(8px)',
        fontFamily: 'monospace'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '95vw',
          height: '90vh',
          maxWidth: 1200,
          background: '#0b0510',
          border: '2px solid #f5cf6b',
          borderRadius: 16,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 40px rgba(245,207,107,0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '12px 20px',
          background: 'linear-gradient(180deg, #1a1030, #0b0510)',
          borderBottom: '1px solid #f5cf6b44',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={assetUrlFromJson(iconWorldGlobe)} width={24} height={24} style={{ imageRendering: 'pixelated' }} />
            <h2 style={{ color: '#f5cf6b', margin: 0, fontSize: 18, letterSpacing: 2 }}>MAPA MUNDI</h2>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #f5cf6b',
              color: '#f5cf6b',
              padding: '4px 12px',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 900
            }}
          >FECHAR [ESC]</button>
        </div>

        {/* Map Area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000' }}>
          {/* Background Map Image */}
          <div style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${mapUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            imageRendering: 'pixelated',
            opacity: 0.8
          }} />

          {/* Regions Layer */}
          <div style={{ position: 'absolute', inset: 0 }}>
            {WORLD_REGIONS.map(region => {
              const isLocked = trainerLevel < region.requiredLevel;
              const isSelected = selectedRegion?.id === region.id;
              const isHovered = hoverRegion?.id === region.id;
              
              return (
                <div
                  key={region.id}
                  style={{
                    position: 'absolute',
                    left: `${region.x}%`,
                    top: `${region.y}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    zIndex: isHovered || isSelected ? 10 : 5
                  }}
                  onMouseEnter={() => setHoverRegion(region)}
                  onMouseLeave={() => setHoverRegion(null)}
                  onClick={() => setSelectedRegion(region)}
                >
                  {/* Region Marker */}
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: isLocked ? '#444' : (isSelected ? '#f5cf6b' : '#fff'),
                    border: '2px solid #000',
                    boxShadow: isLocked ? 'none' : `0 0 15px ${isSelected ? '#f5cf6b' : '#fff'}`,
                    display: 'grid',
                    placeItems: 'center',
                    transition: 'all 0.2s'
                  }}>
                    {isLocked && <span style={{ fontSize: 12 }}>🔒</span>}
                  </div>

                  {/* Region Name Tag */}
                  {(isHovered || isSelected) && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginTop: 8,
                      background: 'rgba(11,5,16,0.9)',
                      border: '1px solid #f5cf6b',
                      padding: '4px 8px',
                      borderRadius: 4,
                      whiteSpace: 'nowrap',
                      color: isLocked ? '#888' : '#f5cf6b',
                      fontSize: 12,
                      fontWeight: 900,
                      pointerEvents: 'none'
                    }}>
                      {region.name.toUpperCase()}
                      {isLocked && ` (Lv. ${region.requiredLevel})`}
                    </div>
                  )}

                  {/* Obsidian Point Visualization */}
                  {region.obsidianPoint && !isLocked && (
                    <div style={{
                      position: 'absolute',
                      left: `${region.obsidianPoint.x - region.x}%`,
                      top: `${region.obsidianPoint.y - region.y}%`,
                      width: 12,
                      height: 12,
                      background: 'radial-gradient(circle, #a855f7, #000)',
                      borderRadius: '50%',
                      boxShadow: '0 0 10px #a855f7',
                      animation: 'teamPulse 2s infinite'
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Info Panel */}
          {selectedRegion && (
            <div style={{
              position: 'absolute',
              right: 20,
              top: 20,
              width: 280,
              background: 'linear-gradient(160deg, #1a1030 0%, #0b0510 100%)',
              border: '2px solid #f5cf6b',
              borderRadius: 12,
              padding: 16,
              boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
              zIndex: 20
            }}>
              <h3 style={{ color: '#f5cf6b', margin: '0 0 8px 0', fontSize: 16 }}>{selectedRegion.name}</h3>
              <div style={{ fontSize: 12, color: '#c8b8d0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div>ELEMENTO: <span style={{ color: '#f5cf6b' }}>{selectedRegion.element.toUpperCase()}</span></div>
                <div>NÍVEL REQ: <span style={{ color: trainerLevel >= selectedRegion.requiredLevel ? '#8affb0' : '#ff5252' }}>{selectedRegion.requiredLevel}</span></div>
                <div style={{ marginTop: 4, padding: 8, background: '#0b0510', borderRadius: 6, border: '1px solid #3d2b52' }}>
                  A região abriga mapas como: {selectedRegion.mapIds.join(', ')}.
                </div>
              </div>

              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  disabled={trainerLevel < selectedRegion.requiredLevel}
                  onClick={() => handleEnterRegion(selectedRegion)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: trainerLevel >= selectedRegion.requiredLevel ? 'linear-gradient(180deg, #7ef27a, #5ec26a)' : '#333',
                    color: '#0b0510',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 900,
                    cursor: trainerLevel >= selectedRegion.requiredLevel ? 'pointer' : 'not-allowed',
                    fontSize: 13
                  }}
                >
                  VIAJAR AGORA
                </button>
                <div style={{ textAlign: 'center', fontSize: 10, color: '#8a7a9c' }}>
                  {teleportScrolls > 0 
                    ? `Custo: 1× Pergaminho (Você tem ${teleportScrolls})`
                    : "Sem pergaminhos - Viagem lenta via pé."}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer HUD */}
        <div style={{
          padding: '10px 20px',
          background: '#0b0510',
          borderTop: '1px solid #f5cf6b44',
          fontSize: 11,
          color: '#8a7a9c',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <div>Seu Nível: <b style={{ color: '#f5cf6b' }}>{trainerLevel}</b></div>
          <div>Clique nas regiões para detalhes. Atalho: [M]</div>
        </div>
      </div>

      <style>{`
        @keyframes teamPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
