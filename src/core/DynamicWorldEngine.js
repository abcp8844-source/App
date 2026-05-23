class DynamicWorldEngine {
  constructor() {
    this.mapSize = 5000;
    this.gridSize = 100;
    this.zones = {
      FOREST: { id: 'ZONE_FOREST', minX: 0, maxX: 1500 },
      VILLAGE: { id: 'ZONE_VILLAGE', minX: 1500, maxX: 3200 },
      CITY: { id: 'ZONE_CITY', minX: 3200, maxX: 5000 }
    };
    // Pre-calculate and cache the entire road network on initialization
    this.roadNetwork = this.generateInterconnectedStreets();
    console.log('[DynamicWorldEngine] Road network generated and cached.');
  }

  // CENTRALIZED WORLD INFRASTRUCTURE GENERATION
  generateWorldInfrastructure() {
    // This function now provides the basic, static elements of the world.
    // Dynamic, grid-based layout is handled by generateSectorLayout.
    return {
      dimensions: { width: this.mapSize, height: this.mapSize },
      fogOfWar: {
        ZONE_FOREST: { isUnlocked: true, density: 0.0 },
        ZONE_VILLAGE: { isUnlocked: false, density: 0.85 },
        ZONE_CITY: { isUnlocked: false, density: 1.0 }
      },
      roadNetwork: this.roadNetwork, // Use the cached network
      vehicles: this.initializeTrafficSystem(),
      playerBases: {},
      worldMissions: [
        { id: 'm_outpost_clear', zone: 'ZONE_VILLAGE', title: 'Clear Village Outpost', x: 2200, y: 1800, isDone: false },
        { id: 'm_city_hacker', zone: 'ZONE_CITY', title: 'Decrypt City Mainframe', x: 4100, y: 3200, isDone: false }
      ]
    };
  }
  
  // SECTOR-BASED PROCEDURAL LAYOUT GENERATION (NEW & REFACTORED)
  // Generates the detailed layout for a specific 100x100m map sector
  generateSectorLayout(sectorX, sectorY) {
    const sector = { grid: [], buildings: 0, trees: 0 };
    const worldStartX = sectorX * 100;
    const worldStartY = sectorY * 100;

    // Determine the zone based on the sector's X coordinate
    let zone = 'FOREST';
    if (worldStartX >= this.zones.CITY.minX) zone = 'CITY';
    else if (worldStartX >= this.zones.VILLAGE.minX) zone = 'VILLAGE';

    for (let y = 0; y < 10; y++) {
      const row = [];
      for (let x = 0; x < 10; x++) {
        const worldX = worldStartX + (x * 10);
        const worldY = worldStartY + (y * 10);
        let cellType = 'EMPTY'; // Default

        // Check if this cell is part of a cached road
        const onRoad = this.roadNetwork.some(road => {
          const isHorizontal = Math.abs(road.startY - road.endY) < road.width;
          if (isHorizontal) {
            return worldX >= road.startX && worldX <= road.endX &&
                   worldY >= road.startY - (road.width / 2) && worldY <= road.startY + (road.width / 2);
          } else { // Vertical road
            return worldY >= road.startY && worldY <= road.endY &&
                   worldX >= road.startX - (road.width / 2) && worldX <= road.startX + (road.width / 2);
          }
        });

        if (onRoad) {
          cellType = 'ROAD';
        } else {
          // Place buildings in the city, and forests elsewhere
          if (zone === 'CITY') {
            // Use a seeded random to make building placement consistent
            if ((sectorX * x + sectorY * y) % 5 < 2) { 
              cellType = 'BUILDING';
              sector.buildings++;
            }
          } else if (zone === 'FOREST' || zone === 'VILLAGE') {
            if (Math.random() < 0.4) {
              cellType = 'FOREST';
              sector.trees++;
            }
          }
        }
        row.push(cellType);
      }
      sector.grid.push(row);
    }
    return sector;
  }

  // GTA Style complex street and highway layout
  generateInterconnectedStreets() {
    const roads = [];
    roads.push({ id: 'main_highway_1', type: 'HIGHWAY', startX: 100, startY: 2500, endX: 4900, endY: 2500, width: 80 });
    
    for (let i = 0; i < 6; i++) {
      const offsetX = 3300 + (i * 300);
      roads.push({ id: `city_v_st_${i}`, type: 'STREET', startX: offsetX, startY: 500, endX: offsetX, endY: 4500, width: 40 });
      roads.push({ id: `city_h_st_${i}`, type: 'STREET', startX: 3300, startY: 500 + (i * 700), endX: 4900, endY: 500 + (i * 700), width: 40 });
    }

    for (let j = 0; j < 4; j++) {
      const vOffsetX = 1600 + (j * 400);
      roads.push({ id: `village_track_${j}`, type: 'DIRT_ROAD', startX: vOffsetX, startY: 1000, endX: vOffsetX + 200, endY: 4000, width: 30 });
    }

    return roads;
  }

  // Initializing AI vehicles
  initializeTrafficSystem() {
    const vehiclesList = {};
    const sampleRoads = this.roadNetwork; // Use cached network
    
    for (let i = 0; i < 120; i++) {
      const selectedRoad = sampleRoads[Math.floor(Math.random() * sampleRoads.length)];
      const vehicleId = `veh_${i}`;
      
      vehiclesList[vehicleId] = {
        id: vehicleId,
        type: Math.random() > 0.4 ? 'MOTORCYCLE' : 'SUV_4X4',
        x: selectedRoad.startX + (Math.random() * (selectedRoad.endX - selectedRoad.startX)),
        y: selectedRoad.startY + (Math.random() * (selectedRoad.endY - selectedRoad.startY)),
        speed: 0,
        maxSpeed: selectedRoad.type === 'HIGHWAY' ? 22 : 12,
        currentRoadId: selectedRoad.id,
        driverId: `bot_driver_${i}`,
        isJacked: false,
        health: 200
      };
    }
    
    return vehiclesList;
  }
}

const worldEngineInstance = new DynamicWorldEngine();
export default worldEngineInstance;
