class WildlifeAnimalEngine {
  constructor() {
    this.animalTypes = ['PET_DOG', 'FARM_COW', 'WILD_BOAR'];
    this.activeFaunaRegistry = [];
  }

  // 1. Spawns high-fidelity roaming animals exclusively inside nature biomes (Forest, Farmland, Mountains)
  spawnEcoSystemFauna(globalTerrainEngine) {
    this.activeFaunaRegistry = [];
    
    for (let i = 0; i < 80; i++) {
      // Random coordinates within countryside sectors
      const randX = Math.floor(Math.random() * 4000) + 500;
      const randY = Math.floor(Math.random() * 4000) + 500;
      
      const groundContext = globalTerrainEngine.evaluateTerrainBiome(randX, randY);

      // Only spawn animals if the location is a mountain, beach, forest, or village farm
      if (groundContext.type !== 'URBAN_BASE' && groundContext.type !== 'OCEAN_WATER') {
        let assignedSpecies = 'PET_DOG';
        if (groundContext.type === 'RURAL_FARMLAND') assignedSpecies = 'FARM_COW';
        if (groundContext.type === 'MOUNTAIN_TERRAIN') assignedSpecies = 'WILD_BOAR';

        this.activeFaunaRegistry.push({
          id: `fauna_node_${i}`,
          species: assignedSpecies,
          x: randX,
          y: randY,
          health: assignedSpecies === 'FARM_COW' ? 200 : 50, // Cows have higher endurance
          isDead: false,
          movementState: 'GRAZING', // GRAZING, STARTLED, DEAD
          headingAngle: Math.random() * Math.PI * 2
        });
      }
    }
    return this.activeFaunaRegistry;
  }

  // 2. High-Fi Damage Processing Loop: Handles animal elimination when shot by the player
  registerFaunaBulletImpact(animalId, weaponDamageInjected) {
    const targetAnimal = this.activeFaunaRegistry.find(a => a.id === animalId);
    
    if (!targetAnimal || targetAnimal.isDead) return { status: 'NO_TARGET_ALIVE' };

    targetAnimal.health -= weaponDamageInjected;
    targetAnimal.movementState = 'STARTLED'; // Run wild when hit

    if (targetAnimal.health <= 0) {
      targetAnimal.health = 0;
      targetAnimal.isDead = true;
      targetAnimal.movementState = 'DEAD'; // Permanent flatline pose on the ground
      console.log(`[WildlifeEngine] ${targetAnimal.species} was successfully eliminated. Dropping leather resource.`);
    }

    return { id: animalId, currentHealth: targetAnimal.health, deadFlag: targetAnimal.isDead };
  }

  // 3. Frame cycle updating animal walking parameters
  tickFaunaAI(playerX, playerY) {
    this.activeFaunaRegistry.forEach(animal => {
      if (animal.isDead) return;

      const distanceToPlayer = Math.hypot(animal.x - playerX, animal.y - playerY);

      if (distanceToPlayer < 40) {
        // Startled state: run away from the player's position
        animal.movementState = 'STARTLED';
        const flightAngle = Math.atan2(animal.y - playerY, animal.x - playerX);
        animal.x += Math.cos(flightAngle) * 3.0; // Fast panic run
        animal.y += Math.sin(flightAngle) * 3.0;
      } else {
        // Normal grazing or roaming stroll
        animal.movementState = 'GRAZING';
        animal.x += Math.cos(animal.headingAngle) * 0.2;
        animal.y += Math.sin(animal.headingAngle) * 0.2;

        if (Math.random() > 0.98) {
          animal.headingAngle = Math.random() * Math.PI * 2; // Change direction casually
        }
      }
    });
  }
}

const wildlifeAnimalInstance = new WildlifeAnimalEngine();
export default wildlifeAnimalInstance;
