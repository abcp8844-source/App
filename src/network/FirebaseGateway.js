class FirebaseGateway {
  constructor() {
    // 1. Secure Endpoint Matrix: Automatically pulls the live database URL from your root .env file
    // Fallback URL is kept for safe development routing
    this.FIREBASE_REALTIME_DB_ENDPOINT = process.env.EXPO_PUBLIC_FIREBASE_DB_ENDPOINT || "https://royal-openworld-default-rtdb.firebaseio.com/";
  }

  /**
   * 2. AUTHORITATIVE DOWNLOAD SNAPSHOT:
   * Fetches full player profile metrics (coins, properties, progress) on cold boots instantly via direct REST API
   */
  async downloadPlayerSnapshot(uid) {
    try {
      const response = await fetch(`${this.FIREBASE_REALTIME_DB_ENDPOINT}/users/${uid}.json`);
      if (!response.ok) throw new Error("FIREBASE_CONNECTION_INTERRUPTED");
      
      const snapshotData = await response.json();
      console.log(`[FirebaseGateway] Profile downloaded successfully for UID: ${uid}`);
      return snapshotData;
    } catch (e) {
      console.error("[FirebaseGateway] Cloud read failure:", e.message);
      return null;
    }
  }

  /**
   * 3. SECURE LIGHT-WEIGHT SAVE PUSH:
   * Uses HTTP PATCH to update only modified structural assets (coins, blueprints) without rewriting the whole database tree
   */
  async commitSecureSavePacket(uid, localDataPayload) {
    try {
      const response = await fetch(`${this.FIREBASE_REALTIME_DB_ENDPOINT}/users/${uid}/vitals.json`, {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coins: localDataPayload.coins,
          ownedProperties: localDataPayload.ownedProperties,
          blueprints: localDataPayload.blueprints,
          lastSyncTime: Date.now()
        })
      });

      console.log(`[FirebaseGateway] Cloud Sync completed for UID: ${uid}. Delta payload successfully compiled.`);
      return { success: response.ok };
    } catch (e) {
      console.error("[FirebaseGateway] Cloud write failure:", e.message);
      return { success: false, error: e.message };
    }
  }
}

const firebaseGatewayInstance = new FirebaseGateway();
export default firebaseGatewayInstance;
