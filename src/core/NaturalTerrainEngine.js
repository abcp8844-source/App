class NaturalTerrainEngine {
  constructor() {
    this.WORLD_SIZE = 5000;
    this.BEACH_WIDTH = 150; // 150 meters of sand before open water triggers
  }

  // 1. Core Terrain Matrix Evaluation based on absolute map coordinates
  evaluateTerrainBiome(x, y) {
    // If player is at the extreme borders of the 5000m map, render ocean water
    if (x < this.BEACH_WIDTH || x > (this.WORLD_SIZE - this.BEACH_WIDTH) ||
        y < this.BEACH_WIDTH || y > (this.WORLD_SIZE - this.BEACH_WIDTH)) {
      return { type: 'OCEAN_WATER', friction: 0.1, elevation: -5 };
    }

    // Just before the open ocean, inject a beautiful sandy beach strip
    if (x < (this.BEACH_WIDTH + 80) || x > (this.WORLD_SIZE - this.BEACH_WIDTH - 80) ||
        y < (this.BEACH_WIDTH + 80) || y > (this.WORLD_SIZE - this.BEACH_WIDTH - 80)) {
      return { type: 'SANDY_BEACH', friction: 0.5, elevation: 0.5 };
    }

    // North-West region of the map is procedural high-altitude mountains
    if (x < 1500 && y < 1500) {
      // Calculate dynamic hill altitude peaks using coordinate multiplication
      const mountainHeight = Math.sin(x * 0.01) * Math.cos(y * 0.01) * 45 + 20;
      return { 
        type: 'MOUNTAIN_TERRAIN', 
        friction: 0.65, 
        elevation: mountainHeight,
        hasDirtRoads: (x % 300 < 40) // Procedural winding dirt paths through the valleys
      };
    }

    // South-East region is dedicated to rural farming homesteads and crop fields
    if (x > 3200 && y > 3200) {
      return { type: 'RURAL_FARMLAND', friction: 0.7, elevation: 2, cropType: (x + y) % 2 === 0 ? 'WHEAT' : 'CORN' };
    }

    // Default center basin is standard city concrete asphalt ground
    return { type: 'URBAN_BASE', friction: 0.9, elevation: 0 };
  }
}

const terrainEngineInstance = new NaturalTerrainEngine();
export default terrainEngineInstance;
