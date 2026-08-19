# World Map System Implementation Plan

## Objective
Create a premium, interactive World Map system for RubyM Idle. The map will serve as a navigation and progression layer, integrating existing maps, trainer levels, and a new "Obsidian Point" energy system.

## Proposed Changes

### 1. Data Structure & Configuration
- Define `WorldRegion` and `ObsidianPoint` types in `src/game/worldMap.ts`.
- Map all existing `IdleMapId`s to geographical regions (e.g., Grasslands, Desert, Abyss, Endgame Chain).
- Define coordinates, unlock levels (Trainer Level), and elemental identities for each region.

### 2. UI Components
- **WorldMapOverlay**: A full-screen interactive component using Canvas/SVG for high performance.
  - Interactive nodes for regions and Obsidian Points.
  - Smooth pan/zoom functionality.
  - Visual filters (All, Regions, Elements, Obsidian).
- **RegionInfoPanel**: A polished sidebar (desktop) / bottom sheet (mobile) showing region details, required levels, and discovery progress.
- **Living Effects**: Subtle animations for elemental energy, fog of war, and pulsing nodes using CSS transitions and optimized Canvas rendering.

### 3. State & Persistence
- Extend `IdleState` in `src/routes/idle.tsx` to include `worldMap`:
  - `discoveredRegions: string[]`
  - `activatedObsidianPoints: string[]`
- Integrate discovery logic: revealing new regions based on Trainer Level and game milestones.
- Ensure Supabase persistence for new map-related data.

### 4. Integration
- Add a "World Map" button to the main HUD in `src/routes/idle.tsx`.
- Connect the World Map to the existing navigation system (`setIdle` updates to change `currentMap`).
- Implement the "Obsidian Point" activation sequence with visual feedback (energy pulses, color reveal).

## Technical Details
- **Rendering**: Use a responsive `<canvas>` element for the main map background and animated energy effects, with a React-based UI layer for interactivity.
- **Performance**: Memoize map data and use `requestAnimationFrame` for smooth animations.
- **Progression**: Tie region availability to `idle.trainerLevel`.
- **Navigation**: Use a custom `useMapNavigation` hook for pan/zoom logic.

## Verification Plan
- **Build Check**: Run `bun run build` to ensure no TypeScript or syntax errors.
- **Visual Audit**: Verify the map renders correctly on desktop and mobile viewports.
- **Logic Test**: Check level-based region locking and discovery sequences in the preview.
- **Persistence Test**: Verify map state is saved and loaded correctly from localStorage/Supabase.
