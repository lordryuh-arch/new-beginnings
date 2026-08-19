
import React, { useState, useMemo } from 'react';
import { WORLD_REGIONS, OBSIDIAN_POINTS, WorldRegion, ObsidianPoint } from '@/game/worldMap';
import { X, ZoomIn, ZoomOut, Maximize2, MapPin, Lock, Info, ChevronRight, Zap } from 'lucide-react';

interface WorldMapOverlayProps {
  onClose: () => void;
  currentTrainerLevel: number;
  onEnterRegion: (mapId: string) => void;
  currentMapId: string;
}

export const WorldMapOverlay: React.FC<WorldMapOverlayProps> = ({
  onClose,
  currentTrainerLevel,
  onEnterRegion,
  currentMapId,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<WorldRegion | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  const resetCamera = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      background: 'rgba(11, 5, 16, 0.95)',
      display: 'flex',
      flexDirection: 'column',
      color: '#eadfe8',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        background: 'linear-gradient(180deg, #1a0f2e, #0b0510)',
        borderBottom: '2px solid #3d2b52',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Maximize2 size={24} color="#f5cf6b" />
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, letterSpacing: 2, color: '#f5cf6b', textShadow: '0 0 10px rgba(245,207,107,0.3)' }}>
            MAPA MUNDI
          </h2>
          <div style={{ background: '#3d2b52', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: '1px solid #f5cf6b44' }}>
            Nível {currentTrainerLevel}
          </div>
        </div>
        <button 
          onClick={onClose}
          style={{ background: '#3d1010', border: '1px solid #ff525255', color: '#ff5252', borderRadius: 8, padding: 8, cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Map Container */}
        <div 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            width: '100%',
            height: '100%',
            cursor: isDragging ? 'grabbing' : 'grab',
            position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute',
            width: '200%',
            height: '200%',
            left: '-50%',
            top: '-50%',
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            background: 'radial-gradient(circle, #1a1030 0%, #0b0510 100%)',
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(107, 214, 255, 0.05), transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(255, 107, 107, 0.05), transparent 40%),
              radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.05), transparent 60%)
            `,
          }}>
            {/* Grid/Stars effect */}
            <div style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.1,
              backgroundImage: 'radial-gradient(#eadfe8 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />

            {/* Regions */}
            {WORLD_REGIONS.map((region) => {
              const isUnlocked = currentTrainerLevel >= region.requiredLevel;
              const isSelected = selectedRegion?.id === region.id;
              const isCurrent = region.mapIds.includes(currentMapId as any);

              return (
                <div
                  key={region.id}
                  onClick={() => setSelectedRegion(region)}
                  style={{
                    position: 'absolute',
                    left: `${region.x}%`,
                    top: `${region.y}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    zIndex: isSelected ? 10 : 1,
                  }}
                >
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                    background: isUnlocked 
                      ? (isCurrent ? '#f5cf6b' : 'rgba(107, 214, 255, 0.2)') 
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `2px solid ${isUnlocked ? (isCurrent ? '#f5cf6b' : '#6bd6ff') : '#3d2b52'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isUnlocked ? `0 0 20px ${isCurrent ? '#f5cf6b44' : '#6bd6ff44'}` : 'none',
                    transition: 'all 0.3s ease',
                    transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                    position: 'relative',
                  }}>
                    {isUnlocked ? (
                      isCurrent ? <MapPin size={24} color="#0b0510" /> : <Info size={24} color="#6bd6ff" />
                    ) : (
                      <Lock size={20} color="#3d2b52" />
                    )}
                    
                    {/* Elemental Energy Pulse */}
                    {isUnlocked && (
                      <div className="region-pulse" style={{
                        position: 'absolute',
                        inset: -10,
                        borderRadius: '50%',
                        border: `2px solid ${isCurrent ? '#f5cf6b22' : '#6bd6ff11'}`,
                        animation: 'pulse 2s infinite',
                      }} />
                    )}
                  </div>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 900,
                    color: isUnlocked ? '#eadfe8' : '#3d2b52',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    textAlign: 'center',
                    background: 'rgba(0,0,0,0.4)',
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}>
                    {region.name}
                  </span>
                </div>
              );
            })}

            {/* Obsidian Points */}
            {OBSIDIAN_POINTS.map((op) => {
              const isUnlocked = currentTrainerLevel >= op.unlockedAtLevel;
              return (
                <div
                  key={op.id}
                  style={{
                    position: 'absolute',
                    left: `${op.x}%`,
                    top: `${op.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 5,
                  }}
                  title={`Obsidian Point: ${op.name}`}
                >
                  <div style={{
                    width: 12,
                    height: 12,
                    background: isUnlocked ? '#c58bff' : '#1a1030',
                    border: `1px solid ${isUnlocked ? '#fff' : '#3d2b52'}`,
                    transform: 'rotate(45deg)',
                    boxShadow: isUnlocked ? '0 0 10px #c58bff' : 'none',
                    animation: isUnlocked ? 'obsidianPulse 1.5s infinite alternate' : 'none',
                  }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Region Info Panel (Side) */}
        {selectedRegion && (
          <div style={{
            position: 'absolute',
            right: 24,
            top: 24,
            bottom: 24,
            width: 320,
            background: 'linear-gradient(135deg, #1a0f2e 0%, #0b0510 100%)',
            border: '2px solid #3d2b52',
            borderRadius: 16,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
            zIndex: 100,
            animation: 'slideIn 0.3s ease-out',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#f5cf6b' }}>{selectedRegion.name}</h3>
              <button onClick={() => setSelectedRegion(null)} style={{ background: 'transparent', border: 'none', color: '#8a7a9c', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: 13, color: '#c8b8d0', lineHeight: 1.5 }}>
              {selectedRegion.description}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#8a7a9c' }}>Elemento</span>
                <span style={{ fontWeight: 700, textTransform: 'capitalize', color: '#6bd6ff' }}>{selectedRegion.element}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#8a7a9c' }}>Nível Recomendado</span>
                <span style={{ fontWeight: 700, color: currentTrainerLevel >= selectedRegion.requiredLevel ? '#8ae28a' : '#ff7a3d' }}>
                  {selectedRegion.requiredLevel}
                </span>
              </div>
            </div>

            <div style={{ flex: 1 }} />

            {currentTrainerLevel >= selectedRegion.requiredLevel ? (
              <button
                onClick={() => onEnterRegion(selectedRegion.mapIds[0])}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(180deg, #f5cf6b, #b8862a)',
                  border: 'none',
                  borderRadius: 12,
                  color: '#0b0510',
                  fontWeight: 900,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(245,207,107,0.3)',
                }}
              >
                VIAJAR <ChevronRight size={18} />
              </button>
            ) : (
              <div style={{
                width: '100%',
                padding: '12px',
                background: '#3d1010',
                border: '1px solid #ff525233',
                borderRadius: 12,
                color: '#ff5252',
                textAlign: 'center',
                fontSize: 12,
                fontWeight: 700,
              }}>
                REQUER NÍVEL {selectedRegion.requiredLevel}
              </div>
            )}
          </div>
        )}

        {/* Controls HUD */}
        <div style={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => handleZoom(0.2)} style={controlBtnStyle}><ZoomIn size={20} /></button>
            <button onClick={() => handleZoom(-0.2)} style={controlBtnStyle}><ZoomOut size={20} /></button>
            <button onClick={resetCamera} style={controlBtnStyle}><Maximize2 size={20} /></button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes obsidianPulse {
          0% { opacity: 0.6; transform: rotate(45deg) scale(0.9); }
          100% { opacity: 1; transform: rotate(45deg) scale(1.1); box-shadow: 0 0 15px #c58bff; }
        }
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}} />
    </div>
  );
};

const controlBtnStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  background: 'rgba(26, 16, 48, 0.8)',
  backdropFilter: 'blur(4px)',
  border: '1px solid #3d2b52',
  borderRadius: 12,
  color: '#eadfe8',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
};
