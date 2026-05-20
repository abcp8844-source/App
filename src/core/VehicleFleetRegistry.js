class VehicleFleetRegistry {
  constructor() {
    // High-end automotive classification database (Modern Era 2026 Grid)
    this.fleetProfiles = {
      // --- 1. MOTORCYCLES FLEET (5+ Varied Categories) ---
      MOTO_SUPERSPORT: { name: 'Apex 1000cc', type: 'MOTORCYCLE', maxSpeed: 45, acceleration: 1.8, weight: 200, handling: 0.95, rarity: 'RARE' },
      MOTO_CRUISER:    { name: 'V-Twin Chopper', type: 'MOTORCYCLE', maxSpeed: 28, acceleration: 0.9, weight: 350, handling: 0.70, rarity: 'COMMON' },
      MOTO_DIRTBIKE:   { name: 'MudX 450', type: 'MOTORCYCLE', maxSpeed: 32, acceleration: 1.4, weight: 110, handling: 0.85, rarity: 'COMMON' },
      MOTO_SCOOTER:    { name: 'Metro E-Scoot', type: 'MOTORCYCLE', maxSpeed: 18, acceleration: 0.6, weight: 90, handling: 0.90, rarity: 'VERY_COMMON' },
      MOTO_CAFE_RACER: { name: 'Vintage Neon 70', type: 'MOTORCYCLE', maxSpeed: 25, acceleration: 1.1, weight: 160, handling: 0.80, rarity: 'COMMON' },

      // --- 2. LUXURY & SPORTS CARS ---
      CAR_SUPERSPORT:  { name: 'GTR Veloce', type: 'SPORTS_CAR', maxSpeed: 52, acceleration: 2.2, weight: 1450, handling: 0.92, rarity: 'ULTRA_RARE' },
      CAR_MUSCLE:      { name: 'Interceptor V8', type: 'MUSCLE_CAR', maxSpeed: 38, acceleration: 1.6, weight: 1700, handling: 0.65, rarity: 'RARE' },
      CAR_SEdan_MODERN:{ name: 'E-Zenith Luxury', type: 'SEDAN', maxSpeed: 32, acceleration: 1.2, weight: 1600, handling: 0.85, rarity: 'COMMON' },
      
      // --- 3. SUVs & OFF-ROAD 4x4 ---
      SUV_LUXURY:      { name: 'RangeTitan 2026', type: 'SUV', maxSpeed: 35, acceleration: 1.3, weight: 2400, handling: 0.78, rarity: 'RARE' },
      SUV_OVERLAND:    { name: 'Safari Crawler 4x4', type: 'SUV', maxSpeed: 26, acceleration: 0.9, weight: 2600, handling: 0.70, rarity: 'COMMON' },

      // --- 4. COMMERCIAL & HEAVY INDUSTRY (For Base Materials Transport) ---
      TRUCK_CARGO:     { name: 'Hauler Heavy Duty', type: 'TRUCK', maxSpeed: 20, acceleration: 0.4, weight: 8000, handling: 0.45, rarity: 'COMMON' },
      VAN_DELIVERY:    { name: 'Transit Express', type: 'VAN', maxSpeed: 24, acceleration: 0.7, weight: 3000, handling: 0.60, rarity: 'COMMON' }
    };
  }

  // 1. Get exact specifications for a specific model during runtime spawning
  getVehicleSpecs(modelId) {
    return this.fleetProfiles[modelId] || this.fleetProfiles.CAR_SEDAN_MODERN;
  }

  // 2. GTA Style dynamic traffic population based on the active zone (City vs Forest)
  getRandomModelForZone(zoneId) {
    const keys = Object.keys(this.fleetProfiles);
    
    // Filter logic to make sure sports cars spawn in the City and Dirtbikes in Forest/Village
    const appropriateKeys = keys.filter(key => {
      const profile = this.fleetProfiles[key];
      if (zoneId === 'ZONE_FOREST') return profile.type === 'MOTORCYCLE' || profile.id === 'SUV_OVERLAND';
      if (zoneId === 'ZONE_CITY') return profile.rarity !== 'VERY_COMMON';
      return true; // Village accepts all standard common traffic
    });

    const selectedKey = appropriateKeys[Math.floor(Math.random() * appropriateKeys.length)];
    return {
      modelId: selectedKey,
      specs: this.fleetProfiles[selectedKey]
    };
  }
}

const fleetRegistryInstance = new VehicleFleetRegistry();
export default fleetRegistryInstance;
