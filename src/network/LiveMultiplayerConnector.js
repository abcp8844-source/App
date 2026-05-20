class LiveMultiplayerConnector {
  constructor() {
    this.wsConnection = null;
    this.connectedPlayersList = {};
  }

  // 1. Open live bidirectional internet pipeline with the authoritative master room server
  establishLiveUplink(playerUid, sessionToken, onRemoteStateReceived) {
    const socketEndpoint = `wss://relay.royalgame.cloud/room/global?uid=${playerUid}&token=${sessionToken}`;
    this.wsConnection = new WebSocket(socketEndpoint);

    this.wsConnection.onopen = () => {
      console.log("[Multiplayer] Connected to live global server grid successfully.");
    };

    // 2. High-speed incoming frame network decoder
    this.wsConnection.onmessage = (event) => {
      try {
        const networkFrame = JSON.parse(event.data);
        
        if (networkFrame.action === "PLAYER_TRANSFORM_BROADCAST") {
          // Store positions of other real players riding bikes around the map
          this.connectedPlayersList[networkFrame.senderId] = {
            x: networkFrame.x,
            y: networkFrame.y,
            heading: networkFrame.heading,
            vehicleModelId: networkFrame.vehicleModelId,
            lastSeen: Date.now()
          };
          
          // Trigger front-end WebGL rendering pipeline to draw this player on screen
          onRemoteStateReceived(this.connectedPlayersList);
        }
      } catch (err) {
        console.error("[NetworkDecoder] Error unpacking frame socket buffer:", err);
      }
    };

    this.wsConnection.onerror = (e) => {
      console.error("[Multiplayer] Packet transmission jitter or link loss detected:", e);
    };
  }

  // 3. Fast-firing update transmitter (Dispatches player coordinate delta packets at 20hz)
  streamMyTransform(playerX, playerY, heading, activeVehicleModelId) {
    if (!this.wsConnection || this.wsConnection.readyState !== WebSocket.OPEN) return;

    const microDeltaPacket = {
      action: "PLAYER_TRANSFORM_BROADCAST",
      x: Math.floor(playerX),
      y: Math.floor(playerY),
      heading: heading,
      vehicleModelId: activeVehicleModelId || null // If driving, sync the model with others
    };

    this.wsConnection.send(JSON.stringify(microDeltaPacket));
  }
}

const multiplayerConnectorInstance = new LiveMultiplayerConnector();
export default multiplayerConnectorInstance;
