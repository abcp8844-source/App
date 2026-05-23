class MarineAviationFleetController {
  constructor() {
    // Central registry for all non-civilian, non-guard marine and air units
    this.activeFleetRegistry = {};
    this.navigationGrid = { water: [], air: [] };
    this.isInitialized = false;
  }

  // 1. Setup patrol routes for automated military-grade units
  initializeMarineAndAviationGrid() {
    if (this.isInitialized) return;

    // Define strategic water and air patrol routes across the map
    // A coastal patrol route for high-speed boats
    this.navigationGrid.water.push({ id: 'coast_patrol_1', startX: 200, startY: 4800, endX: 4800, endY: 4800, width: 200 });
    // An air patrol route for helicopters over the main city
    this.navigationGrid.air.push({ id: 'city_air_patrol_1', startX: 3300, startY: 1000, endX: 4800, endY: 1000, altitude: 150 });

    // Spawn initial fleet units
    this.spawnInitialFleet();
    
    this.isInitialized = true;
    console.log('[MarineAviation] Fleet controller initialized.');
  }

  // 2. Spawn the initial set of boats and helicopters
  spawnInitialFleet() {
    // Spawn a patrol boat
    const boatPath = this.navigationGrid.water[0];
    this.activeFleetRegistry['boat_1'] = {
      id: 'boat_1',
      type: 'PATROL_BOAT',
      x: boatPath.startX, y: boatPath.startY,
      speed: 5, // Units per frame
      pathId: boatPath.id,
      direction: 1 // 1 for forward, -1 for backward
    };

    // Spawn a helicopter
    const heliPath = this.navigationGrid.air[0];
    this.activeFleetRegistry['heli_1'] = {
      id: 'heli_1',
      type: 'HELICOPTER',
      x: heliPath.startX, y: heliPath.startY,
      z: heliPath.altitude, // Altitude
      speed: 10, // Units per frame
      pathId: heliPath.id,
      direction: 1
    };
  }

  // 3. Update positions of all active fleet units every frame
  updateFleetAndAviationFlow() {
    if (!this.isInitialized) return;

    for (const unitId in this.activeFleetRegistry) {
      const unit = this.activeFleetRegistry[unitId];
      let path;

      if (unit.type === 'PATROL_BOAT') {
        path = this.navigationGrid.water.find(p => p.id === unit.pathId);
      } else if (unit.type === 'HELICOPTER') {
        path = this.navigationGrid.air.find(p => p.id === unit.pathId);
      }

      if (!path) continue;

      // Move the unit along the X-axis of its path
      unit.x += unit.speed * unit.direction;

      // Check for path boundaries and reverse direction
      if (unit.direction === 1 && unit.x >= path.endX) {
        unit.direction = -1;
      } else if (unit.direction === -1 && unit.x <= path.startX) {
        unit.direction = 1;
      }
    }
  }
}

const marineAviationInstance = new MarineAviationFleetController();
export default marineAviationInstance;
