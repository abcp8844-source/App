class FirebaseGateway {
  constructor() {
    this.FIREBASE_REALTIME_DB_ENDPOINT = "https://royal-openworld-default-rtdb.firebaseio.com/";
  }

  // Fetch authoritative user profile on cold boots
  async downloadPlayerSnapshot(uid) {
    try {
      const response = await fetch(`${this.FIREBASE_REALTIME_DB_ENDPOINT}/users/${uid}.json`);
      if (!response.ok) throw new Error("FIREBASE_CONNECTION_INTERRUPTED");
      
      const snapshotData = await response.json();
      return snapshotData;
    } catch (e) {
      console.error("[FirebaseGateway] Read failure:", e.message);
      return null;
    }
  }

  // Secure light-weight save push (Only updates when structural assets are traded or purchased)
  async commitSecureSavePacket(uid, localDataPayload) {
    try {
      const response = await fetch(`${this.FIREBASE_REALTIME_DB_ENDPOINT}/users/${uid}/vitals.json`, {
        method: 'PATCH', // PATCH only replaces specified lines instead of rewriting the whole database
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coins: localDataPayload.coins,
          ownedProperties: localDataPayload.ownedProperties,
          blueprints: localDataPayload.blueprints,
          lastSyncTime: Date.now()
        })
      });

      return { success: response.ok };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

const firebaseGatewayInstance = new FirebaseGateway();
export default firebaseGatewayInstance;
