class MarineAviationFleetController {
  constructor() {
    // Structural layout for 2 distinct high-end airports
    this.aviationHubs = {
      DUBAI_METRO_AIRPORT: { id: 'air_dubai', name: "Dubai International Sky-Hub", x: 800, y: 800, runwayHeading: 0.5 },
      VILLAGE_REGIONAL_AIRPORT: { id: 'air_village', name: "Regional Valley Airstrip", x: 4200, y: 1200, runwayHeading: 2.1 }
    };

    // Helipads positions distributed evenly across skyscraper rooftops
    this.skyscraperHelipads = [
      { id: 'heli_tower_alpha', location: "Royal Bank Tower Roof", x: 2200, y: 2400, altitude: 45 },
      { id: 'heli_tower_bravo', location: "Neon District Hotel Apex", x: 2600, y: 2100, altitude: 52 },
      { id: 'heli_hospital', location: "Central Medical Emergency Deck", x: 1900, y: 2800, altitude: 30 }
    ];

    this.activeFleetRegistry = [];
  }

  // 1. Initialize static sea cargo docks routes, fishes, jets and active chopper nodes
  initializeMarineAndAviationGrid() {
    this.activeFleetRegistry = [
      // Large Sea Cargo Liners and Fast Boats for travel between Dubai and Countryside
      { id: 'ship_cargo_01', type: 'CARGO_LINER', x: -200, y: 2500, capacity: 50, passengerSlots: [], speed: 8 },
      { id: 'boat_express_01', type: 'SPEED_BOAT', x: -50, y: 1200, capacity: 6, passengerSlots: [], speed: 35 },
      
      // Private Fighter Jets and Commercial Planes stationed at both Airports
      { id: 'jet_private_01', type: 'LUXURY_JET', x: 850, y: 820, altitude: 0, associatedHub: 'air_dubai', state: 'PARKED' },
      { id: 'jet_fighter_02', type: 'TACTICAL_JET', x: 4220, y: 1210, altitude: 0, associatedHub: 'air_village', state: 'PARKED' },

      // High-altitude Choppers sitting atop the premium structural roof stairs
      { id: 'chopper_01', type: 'ROOFTOP_HELICOPTER', x: 2200, y: 2400, altitude: 45, state: 'READY_FOR_TAKEOFF' },
      { id: 'chopper_02', type: 'ROOFTOP_HELICOPTER', x: 2600, y: 2100, altitude: 52, state: 'READY_FOR_TAKEOFF' }
    ];

    // Seeding dynamic schooling fish populations inside water coordinates
    this.marineFaunaSchools = Array.from({ length: 40 }, (_, index) => ({
      id: `fish_school_${index}`,
      x: Math.random() * -400, // Scattered out in deep water domains
      y: Math.random() * 5000,
      depth: Math.floor(Math.random() * 12) + 2,
      species: Math.random() > 0.5 ? 'SHARK' : 'BLUE_TUNA'
    }));
  }

  // 2. High-End Seamless Interaction Bridge: Mount or Exit heavy planes/boats instantly without bugs
  executeVehicleBoardingSequence(playerNode, targetVehicleId) {
    const asset = this.activeFleetRegistry.find(v => v.id === targetVehicleId);
    if (!asset) return { success: false, context: 'TARGET_NOT_FOUND' };

    const proximityRange = Math.hypot(playerNode.x - asset.x, playerNode.y - asset.y);
    
    // Proximity trigger verification (Within 6 meters of the boat hull or cockpit)
    if (proximityRange <= 6.5) {
      playerNode.currentVehicleId = asset.id;
      playerNode.isAviationActive = asset.type.includes('JET') || asset.type.includes('HELICOPTER');
      asset.state = 'ENGAGED_BY_PLAYER';
      
      console.log(`[FleetController] Player mounted ${asset.type} [${asset.id}] cleanly. Activating flight/marine instrument dashboards.`);
      return { success: true, operationalMode: playerNode.isAviationActive ? 'FLIGHT' : 'SAILING' };
    }

    return { success: false, context: 'TOO_FAR_FROM_ASSET' };
  }
}

const marineAviationInstance = new MarineAviationFleetController();
export default marineAviationInstance;
