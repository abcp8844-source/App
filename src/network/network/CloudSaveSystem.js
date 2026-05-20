class CloudSaveSystem {
  constructor() {
    this.CLOUD_STORAGE_URL = "https://db.royalgame.cloud/v1/sync";
  }

  // 1. Pack full local game state variables and upload to server nodes
  async pushLocalDeltaToCloud(playerAuthToken, currentFrameState) {
    if (!playerAuthToken) return { success: false, reason: 'UNAUTHORIZED_SYNC_BLOCKED' };

    const cleanStatePayload = {
      timestamp: Date.now(),
      vitals: currentFrameState.player.vitals,
      wallet: {
        coins: currentFrameState.player.coins,
        xp: currentFrameState.player.xp
      },
      inventory: currentFrameState.player.inventory,
      assets: {
        ownedProperties: currentFrameState.player.ownedProperties || [],
        blueprints: currentFrameState.player.blueprints || []
      },
      lastCoordinates: {
        x: Math.floor(currentFrameState.player.x),
        y: Math.floor(currentFrameState.player.y)
      }
    };

    try {
      const response = await fetch(`${this.CLOUD_STORAGE_URL}/save`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${playerAuthToken}`
        },
        body: JSON.stringify(cleanStatePayload)
      });

      if (!response.ok) throw new Error('CLOUD_WRITE_ABORTED');
      return { success: true, timestamp: Date.now() };
    } catch (error) {
      console.error("[CloudSave] Transaction Failure:", error.message);
      return { success: false, reason: error.message };
    }
  }

  // 2. Fetch authoritative save state from storage server when player launches game
  async pullPlayerCloudSave(playerAuthToken) {
    try {
      const response = await fetch(`${this.CLOUD_STORAGE_URL}/load`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${playerAuthToken}` }
      });

      if (!response.ok) throw new Error('NO_SAVE_FOUND_ON_CLOUD');
      const data = await response.json();
      return { success: true, savedState: data.profileState };
    } catch (error) {
      return { success: false, reason: error.message };
    }
  }
}

const cloudSaveInstance = new CloudSaveSystem();
export default cloudSaveInstance;
