class DynamicWorldEngine {
  constructor() {
    // Massive map scale (5000x5000 units) to ensure long travel time (approx 30 mins)
    this.mapSize = 5000; 
    this.gridSize = 100; // Optimization grid for tracking high-density street networks
    
    this.zones = {
      FOREST: { id: 'ZONE_FOREST', minX: 0, maxX: 1500 },
      VILLAGE: { id: 'ZONE_VILLAGE', minX: 1500, maxX: 3200 },
      CITY: { id: 'ZONE_CITY', minX: 3200, maxX: 5000 }
    };
  }

  generateWorldInfrastructure() {
    return {
      dimensions: { width: this.mapSize, height: this.mapSize },
      fogOfWar: {
        ZONE_FOREST: { isUnlocked: true, density: 0.0 },
        ZONE_VILLAGE: { isUnlocked: false, density: 0.85 },
        ZONE_CITY: { isUnlocked: false, density: 1.0 }
      },
      roadNetwork: this.generateInterconnectedStreets(),
      vehicles: this.initializeTrafficSystem(),
      playerBases: {},
      worldMissions: [
        { id: 'm_outpost_clear', zone: 'ZONE_VILLAGE', title: 'Clear Village Outpost', x: 2200, y: 1800, isDone: false },
        { id: 'm_city_hacker', zone: 'ZONE_CITY', title: 'Decrypt City Mainframe', x: 4100, y: 3200, isDone: false }
      ]
    };
  }

  // GTA Style complex street and highway layout passing through neighborhoods
  generateInterconnectedStreets() {
    const roads = [];
    
    // Main Spine Highway connecting Forest -> Village -> City Main Square
    roads.push({ id: 'main_highway_1', type: 'HIGHWAY', startX: 100, startY: 2500, endX: 4900, endY: 2500, width: 80 });
    
    // City Grid System (Street and Sector interconnectivity)
    for (let i = 0; i < 6; i++) {
      const offsetX = 3300 + (i * 300);
      // Vertical grid roads (Alleys and Streets)
      roads.push({ id: `city_v_st_${i}`, type: 'STREET', startX: offsetX, startY: 500, endX: offsetX, endY: 4500, width: 40 });
      // Horizontal grid roads
      roads.push({ id: `city_h_st_${i}`, type: 'STREET', startX: 3300, startY: 500 + (i * 700), endX: 4900, endY: 500 + (i * 700), width: 40 });
    }

    // Village Neighborhood Dirt Tracks
    for (let j = 0; j < 4; j++) {
      const vOffsetX = 1600 + (j * 400);
      roads.push({ id: `village_track_${j}`, type: 'DIRT_ROAD', startX: vOffsetX, startY: 1000, endX: vOffsetX + 200, endY: 4000, width: 30 });
    }

    return roads;
  }

  // Initializing AI vehicles deployed across the road grids
  initializeTrafficSystem() {
    const vehiclesList = {};
    const sampleRoads = this.generateInterconnectedStreets();
    
    // Deploying 120 synchronized vehicles across the map grids
    for (let i = 0; i < 120; i++) {
      const selectedRoad = sampleRoads[Math.floor(Math.random() * sampleRoads.length)];
      const vehicleId = `veh_${i}`;
      
      vehiclesList[vehicleId] = {
        id: vehicleId,
        type: Math.random() > 0.4 ? 'MOTORCYCLE' : 'SUV_4X4',
        x: selectedRoad.startX + (Math.random() * 200),
        y: selectedRoad.startY,
        speed: 0,
        maxSpeed: selectedRoad.type === 'HIGHWAY' ? 22 : 12,
        currentRoadId: selectedRoad.id,
        driverId: `bot_driver_${i}`, // Controlled by Bot AI Traffic loop
        isJacked: false,
        health: 200
      };
    }
    
    return vehiclesList;
  }
}

const worldEngineInstance = new DynamicWorldEngine();
export default worldEngineInstance;
