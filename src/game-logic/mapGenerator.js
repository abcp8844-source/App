class MapGenerator {
  constructor() {
    this.mapWidth = 2000;  // Large premium arena boundaries
    this.mapHeight = 2000;
    this.gridSize = 50;    // Grid units for alignment
  }

  // Generate a completely new map state with resources and boundaries
  generateNewMap(seedConfig = {}) {
    const totalResources = seedConfig.density || 120; // Number of resource nodes
    const resources = [];
    const structures = [];

    // 1. Procedural generation loop for resource placement (Trees, Rocks)
    for (let i = 0; i < totalResources; i++) {
      const type = Math.random() > 0.4 ? 'WOOD' : 'STONE'; // 60% Wood, 40% Stone split
      
      // Keep resources slightly away from extreme boundaries
      const rx = Math.floor(Math.random() * (this.mapWidth - 200)) + 100;
      const ry = Math.floor(Math.random() * (this.mapHeight - 200)) + 100;

      resources.push({
        id: `res_${type.toLowerCase()}_${i}`,
        type: type,
        x: rx,
        y: ry,
        health: type === 'WOOD' ? 100 : 150, // Stone takes longer to mine
        amount: Math.floor(Math.random() * 20) + 10 // Drop quantity
      });
    }

    // 2. Generate strategic neutral spawn points for 50 entities (Players + Bots)
    const spawnPoints = [];
    for (let j = 0; j < 50; j++) {
      const sx = Math.floor(Math.random() * (this.mapWidth - 400)) + 200;
      const sy = Math.floor(Math.random() * (this.mapHeight - 400)) + 200;
      spawnPoints.push({ x: sx, y: sy });
    }

    return {
      dimensions: { width: this.mapWidth, height: this.mapHeight },
      resources: resources,
      structures: structures,
      spawnPoints: spawnPoints
    };
  }

  // Get grid coordinate bucket from pixel coordinates (Useful for optimization)
  getGridCell(x, y) {
    const col = Math.floor(x / this.gridSize);
    const row = Math.floor(y / this.gridSize);
    return { col, row, key: `${col}_${row}` };
  }
}

const mapInstance = new MapGenerator();
export default mapInstance;
