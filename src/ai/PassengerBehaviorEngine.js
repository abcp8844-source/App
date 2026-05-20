class PassengerBehaviorEngine {
  constructor() {
    this.passengerPool = [];
  }

  // 1. Seeds dynamic citizen groups localized exactly inside transit stations platforms
  populateStationPlatforms(railwayStationsDatabase) {
    this.passengerPool = [];
    let uniqueIdCounter = 0;

    Object.keys(railwayStationsDatabase).forEach(stationKey => {
      const station = railwayStationsDatabase[stationKey];
      
      // Spawn 15 waiting commuters per platform sector
      for (let i = 0; i < 15; i++) {
        this.passengerPool.push({
          id: `commuter_${uniqueIdCounter++}`,
          associatedStationId: station.id,
          // Cluster passengers neatly within the platform deck boundaries
          x: station.x + (Math.random() * 12 - 6),
          y: station.y + (Math.random() * 25 - 12),
          z: station.isElevated ? station.altitude : 0.0,
          commuterState: 'WAITING_FOR_TRAIN', // WAITING, BOARDING, CLIMBING_STAIRS
          stairTimer: Math.random()
        });
      }
    });
    return this.passengerPool;
  }

  // 2. Simulates active vertical movement (climbing up/down beautiful high-tech sky stairs)
  updateCommuterTicks(trainPositionsArray) {
    this.passengerPool.forEach(passenger => {
      if (passenger.z > 0 && Math.random() > 0.95) {
        // Simulate a citizen occasionally walking down the luxury elevated steps to ground street level
        passenger.commuterState = 'CLIMBING_STAIRS';
        passenger.y += (Math.random() - 0.5) * 2; // Walk towards exit points
      }
    });
  }
}

const passengerBehaviorInstance = new PassengerBehaviorEngine();
export default passengerBehaviorInstance;
