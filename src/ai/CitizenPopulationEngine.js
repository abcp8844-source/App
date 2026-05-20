class CitizenPopulationEngine {
  constructor() {
    this.GENDER_MALE = 'MALE';
    this.GENDER_FEMALE = 'FEMALE';
    this.maxPopulationDensity = 150; // Total walking citizens scattered dynamically
  }

  // 1. Spawns dynamic male/female bots on pedestrian lines near the real player coordinates
  populateActiveSectors(playerX, playerY) {
    const localPedestrianFleet = [];
    const namesMale = ["John", "Ali", "Carlos", "Viktor"];
    const namesFemale = ["Sarah", "Ayesha", "Elena", "Mia"];

    for (let i = 0; i < this.maxPopulationDensity; i++) {
      const isFemale = Math.random() > 0.5;
      const gender = isFemale ? this.GENDER_FEMALE : this.GENDER_MALE;
      const randomName = isFemale ? namesFemale[i % 4] : namesMale[i % 4];

      localPedestrianFleet.push({
        id: `citizen_${i}`,
        name: randomName,
        gender: gender,
        // Procedural dispersion matching city layout radius
        x: playerX + (Math.random() * 600 - 300),
        y: playerY + (Math.random() * 600 - 300),
        health: 100,
        behaviorState: 'WANDERING', // WANDERING, FLEEING, DEAD
        carriedCash: Math.floor(Math.random() * 80) + 15 // Drops 15 to 95 RC$ when neutralised
      });
    }
    return localPedestrianFleet;
  }

  // 2. High-Fi dynamic AI reaction cycle for neutral bystanders
  updateCitizenHearts(citizens, player, targetThreatCoordinates) {
    citizens.forEach(bot => {
      if (bot.health <= 0) {
        bot.behaviorState = 'DEAD';
        return;
      }

      const distToPlayer = Math.hypot(bot.x - player.x, bot.y - player.y);

      // If player is shooting or drifting wild nearby, trigger fear response vector
      if (targetThreatCoordinates || (distToPlayer < 60 && player.isShooting)) {
        bot.behaviorState = 'FLEEING';
        // Run rapidly in the opposite direction of the danger axis
        const escapeAngle = Math.atan2(bot.y - player.y, bot.x - player.x);
        bot.x += Math.cos(escapeAngle) * 4.5; // Fast sprint velocity
        bot.y += Math.sin(escapeAngle) * 4.5;
      } else {
        // Casual natural stroll routine
        bot.behaviorState = 'WANDERING';
        bot.x += (Math.random() - 0.5) * 0.5;
        bot.y += (Math.random() - 0.5) * 0.5;
      }
    });
  }
}

const citizenPopulationInstance = new CitizenPopulationEngine();
export default citizenPopulationInstance;
