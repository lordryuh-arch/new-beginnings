import React, { useState, useEffect } from 'react';
import { WORLD_REGIONS, WorldRegion } from './worldMap';
import { assetUrlFromJson } from '@/lib/assetUrl';
import overworldAsset from '@/assets/world-map-globe.jpg.asset.json';
import iconWorldGlobe from '@/assets/icon-world-globe-v2.png.asset.json';
import bagBgDarkAsset from '@/assets/bag-bg-dark.jpg.asset.json';

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
  const [activeParticles, setActiveParticles] = useState<{x: number, y: number, id: number}[]>([]);
  
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setActiveParticles(prev => {
        const newPart = {
          x: Math.random() * 100,
          y: Math.random() * 100,
          id: Math.random()
        };
        return [...prev.slice(-20), newPart];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const mapUrl = assetUrlFromJson(overworldAsset);
  const teleportScrolls = items.scroll_teleport ?? 0;

  const handleEnterRegion = (region: WorldRegion) => {
    if (trainerLevel < region.requiredLevel) return;
    
    const targetMap = region.mapIds[0];
    if (targetMap === currentMap) {
      onClose();
      return;
    }

    if (teleportScrolls > 0) {
      onConsumeTeleport();
    }
    onTeleport(targetMap);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10005,
        background: 'rgba(5, 2, 10, 0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backdropFilter: 'blur(12px)',
        fontFamily: "'Press Start 2P', monospace"
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '95vw',
          height: '90vh',
          maxWidth: 1300,
          background: '#0b0510',
          border: '3px solid #f5cf6b',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 60px rgba(0,0,0,1), 0 0 20px rgba(245,207,107,0.2)',
          display: 'flex',
          flexDirection: 'column',
          imageRendering: 'pixelated'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Animated Background Particles */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
          {activeParticles.map(p => (
            <div key={p.id} style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: 2,
              height: 2,
              background: '#f5cf6b',
              opacity: 0.3,
              animation: 'floatParticle 3s linear forwards'
            }} />
          ))}
        </div>

        {/* Header */}
        <div style={{
          padding: '16px 24px',
          background: 'rgba(26, 16, 48, 0.8)',
          borderBottom: '2px solid #f5cf6b44',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src={assetUrlFromJson(iconWorldGlobe)} width={32} height={32} style={{ filter: 'drop-shadow(0 0 8px #f5cf6b)' }} />
            <div>
              <h2 style={{ color: '#f5cf6b', margin: 0, fontSize: 16, textShadow: '2px 2px #000' }}>RUBYM WORLD MAP</h2>
              <div style={{ fontSize: 8, color: '#8a7a9c', marginTop: 4 }}>DISCOVER THE ANCIENT SECRETS</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: '#3a1010',
              border: '2px solid #ff5252',
              color: '#ff5252',
              padding: '8px 16px',
              fontSize: 10,
              cursor: 'pointer',
              boxShadow: '2px 2px #000'
            }}
          >CLOSE [ESC]</button>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', position: 'relative', zIndex: 5 }}>
          {/* Map Section */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000', borderRight: '2px solid #f5cf6b44' }}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${mapUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.7,
              transition: 'transform 0.5s ease-out',
              transform: selectedRegion ? 'scale(1.1)' : 'scale(1)'
            }} />

            {/* Region Markers */}
            <div style={{ position: 'absolute', inset: 0 }}>
              {WORLD_REGIONS.map(region => {
                const isLocked = trainerLevel < region.requiredLevel;
                const isSelected = selectedRegion?.id === region.id;
                
                return (
                  <div
                    key={region.id}
                    style={{
                      position: 'absolute',
                      left: `${region.x}%`,
                      top: `${region.y}%`,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      zIndex: isSelected ? 20 : 10
                    }}
                    onMouseEnter={() => setHoverRegion(region)}
                    onMouseLeave={() => setHoverRegion(null)}
                    onClick={() => setSelectedRegion(region)}
                  >
                    {/* Living Marker */}
                    <div style={{
                      width: isSelected ? 32 : 24,
                      height: isSelected ? 32 : 24,
                      background: isLocked ? '#222' : region.color,
                      border: '3px solid #000',
                      boxShadow: isLocked ? 'none' : `0 0 20px ${region.color}cc`,
                      display: 'grid',
                      placeItems: 'center',
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      animation: isLocked ? 'none' : 'markerPulse 2s infinite'
                    }}>
                      {isLocked ? (
                         <span style={{ fontSize: 8 }}>LOCKED</span>
                      ) : (
                        <div style={{ width: 6, height: 6, background: '#fff', borderRadius: 1 }} />
                      )}
                    </div>

                    {/* Obsidian Energy Pulse */}
                    {region.obsidianPoint && !isLocked && (
                      <div style={{
                        position: 'absolute',
                        inset: -20,
                        border: `1px solid ${region.color}`,
                        borderRadius: '50%',
                        opacity: 0,
                        animation: 'energyWave 3s infinite'
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar / Info Panel */}
          <div style={{ 
            width: 350, 
            background: 'rgba(11, 5, 16, 0.95)', 
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}>
            {selectedRegion ? (
              <>
                <div style={{ borderBottom: '2px solid #f5cf6b', paddingBottom: 16 }}>
                  <div style={{ fontSize: 10, color: selectedRegion.color, marginBottom: 8 }}>{selectedRegion.element.toUpperCase()} REGION</div>
                  <h3 style={{ color: '#fff', fontSize: 18, margin: 0, textShadow: '2px 2px #000' }}>{selectedRegion.name}</h3>
                </div>

                <p style={{ color: '#8a7a9c', fontSize: 10, lineHeight: 1.6, margin: 0 }}>
                  {selectedRegion.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ padding: 12, background: '#1a1030', border: '1px solid #3d2b52' }}>
                    <div style={{ fontSize: 8, color: '#f5cf6b', marginBottom: 6 }}>REQUIREMENTS</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
                      <span style={{ color: '#fff' }}>Trainer Lv.</span>
                      <span style={{ color: trainerLevel >= selectedRegion.requiredLevel ? '#8affb0' : '#ff5252' }}>
                        {trainerLevel}/{selectedRegion.requiredLevel}
                      </span>
                    </div>
                  </div>

                  {selectedRegion.obsidianPoint && (
                    <div style={{ padding: 12, background: '#1a1030', border: '1px solid #a855f744' }}>
                      <div style={{ fontSize: 8, color: '#a855f7', marginBottom: 6 }}>OBSIDIAN MONUMENT</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
                        <span style={{ color: '#fff' }}>Power Rating</span>
                        <span style={{ color: '#a855f7' }}>{selectedRegion.obsidianPoint.power}⚡</span>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ textAlign: 'center', fontSize: 8, color: '#8a7a9c' }}>
                    {teleportScrolls > 0 
                      ? `CONSUME: 1x TELEPORT SCROLL (${teleportScrolls} LEFT)`
                      : "FREE TRAVEL: WALKING SPEED"}
                  </div>
                  <button
                    disabled={trainerLevel < selectedRegion.requiredLevel}
                    onClick={() => handleEnterRegion(selectedRegion)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: trainerLevel >= selectedRegion.requiredLevel ? selectedRegion.color : '#333',
                      color: '#000',
                      border: 'none',
                      boxShadow: trainerLevel >= selectedRegion.requiredLevel ? `0 4px 0 ${selectedRegion.color}88, 0 0 20px ${selectedRegion.color}44` : 'none',
                      fontWeight: 900,
                      cursor: trainerLevel >= selectedRegion.requiredLevel ? 'pointer' : 'not-allowed',
                      fontSize: 12,
                      fontFamily: "'Press Start 2P', monospace"
                    }}
                  >
                    ENTER REGION
                  </button>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <p style={{ color: '#4a3a5c', fontSize: 10, lineHeight: 1.8 }}>
                  SELECT A REGION ON THE MAP TO VIEW DETAILS AND TELEPORT
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Global HUD Bar */}
        <div style={{
          padding: '12px 24px',
          background: '#0b0510',
          borderTop: '2px solid #f5cf6b44',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 9,
          color: '#8a7a9c'
        }}>
          <div>CURRENT STATUS: <span style={{ color: '#f5cf6b' }}>EXPLORING</span></div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div>REGIONS: <span style={{ color: '#fff' }}>{WORLD_REGIONS.length}</span></div>
            <div>MONUMENTS: <span style={{ color: '#a855f7' }}>{WORLD_REGIONS.filter(r => r.obsidianPoint).length}</span></div>
          </div>
        </div>

        <style>{`
          @keyframes markerPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.15); }
          }
          @keyframes energyWave {
            0% { transform: scale(0.5); opacity: 0.8; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          @keyframes floatParticle {
            0% { transform: translateY(0); opacity: 0.3; }
            100% { transform: translateY(-100px); opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
};