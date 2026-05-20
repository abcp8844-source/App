class SoundFXPropagationEngine {
  constructor() {
    // Decibel radius defining how far acoustic waves travel through the atmosphere
    this.acousticProfiles = {
      FOOTSTEP: { baseRadius: 30, alertAI: false },
      VEHICLE_ENGINE: { baseRadius: 250, alertAI: true },
      GUNSHOT_LOUD: { baseRadius: 800, alertAI: true }
    };
  }

  // 1. Register acoustic signatures into the run-time thread to update nearby actors
  emitAcousticEvent(emitterX, emitterY, soundType, activeBots) {
    const profile = this.acousticProfiles[soundType];
    if (!profile) return [];

    const caughtInRadiusBots = [];

    // Evaluate which bots can hear this signature
    for (let id in activeBots) {
      const botVehicle = activeBots[id];
      if (botVehicle.isJacked || !botVehicle.driverId) continue;

      const distance = Math.hypot(botVehicle.x - emitterX, botVehicle.y - emitterY);
      
      if (distance <= profile.baseRadius) {
        // Calculate raw volume drop-off factor based on proximity
        const volumeFactor = 1 - (distance / profile.baseRadius);

        caughtInRadiusBots.push({
          botId: botVehicle.id,
          perceivedVolume: volumeFactor, // 1.0 is extremely close, 0.1 is faint background noise
          shouldPanic: profile.alertAI
        });
      }
    }

    return caughtInRadiusBots;
  }
}

const soundPropagationInstance = new SoundFXPropagationEngine();
export default soundPropagationInstance;
