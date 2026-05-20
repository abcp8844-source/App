class NetworkSynchronizationEngine {
  constructor() {
    this.lastSyncTimestamp = Date.now();
    this.networkCompressionThreshold = 512; // Bytes limit before executing structural compression
  }

  // 1. Pack global world updates (Vehicles, base states, unlocked fog layers) into atomic state payloads
  serializeClientDeltaState(player, vehicles, baseState, worldMissions) {
    const dynamicPayload = {
      timestamp: Date.now(),
      playerId: player.id,
      playerTransform: {
        x: Math.floor(player.x),
        y: Math.floor(player.y),
        heading: player.rotation,
        isDriving: player.isDriving
      },
      baseDelta: {
        totalStructures: baseState.structures ? baseState.structures.length : 0,
        vaultSecureStatus: baseState.securityLockCode ? 'LOCKED' : 'UNSECURED'
      },
      activeVehicleUpdates: {}
    };

    // Filter and stream only hijacked or modified active AI vehicles to save uplink packet loss
    for (let id in vehicles) {
      const v = vehicles[id];
      if (v.isJacked || v.speed > 0) {
        dynamicPayload.activeVehicleUpdates[id] = {
          x: Math.floor(v.x),
          y: Math.floor(v.y),
          hp: v.health
        };
      }
    }

    return JSON.stringify(dynamicPayload);
  }

  // 2. Deserialize authoritative data packets broadcasted down from server arrays
  processIncomingServerSnapshot(rawSnapshot, currentWorldState) {
    try {
      const parsedSnapshot = typeof rawSnapshot === 'string' ? JSON.parse(rawSnapshot) : rawSnapshot;

      if (!parsedSnapshot || parsedSnapshot.timestamp < this.lastSyncTimestamp) {
        return currentWorldState; // Discard outdated jitter packets to maintain crisp synchronization
      }

      this.lastSyncTimestamp = parsedSnapshot.timestamp;

      // Authoritative vehicle override pipeline
      for (let id in parsedSnapshot.activeVehicleUpdates) {
        if (currentWorldState.vehicles[id]) {
          currentWorldState.vehicles[id].x = parsedSnapshot.activeVehicleUpdates[id].x;
          currentWorldState.vehicles[id].y = parsedSnapshot.activeVehicleUpdates[id].y;
          currentWorldState.vehicles[id].health = parsedSnapshot.activeVehicleUpdates[id].hp;
        }
      }

      return currentWorldState;
    } catch (e) {
      console.error('[NetworkSync] Decompression failure on incoming frame:', e);
      return currentWorldState;
    }
  }
}

const networkSyncInstance = new NetworkSynchronizationEngine();
export default networkSyncInstance;
