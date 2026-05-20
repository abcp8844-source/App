import { io } from 'socket.io-client';

// Remote high-performance game server endpoint placeholder
const GAME_SERVER_URL = 'https://server.thelastsanctuary.com'; 

class SocketManager {
  constructor() {
    this.socket = null;
    this.currentRoom = null;
  }

  // Initialize secure connection to the cloud backend
  connect(playerId, playerName, onWorldUpdate, onMatchReady) {
    this.socket = io(GAME_SERVER_URL, {
      transports: ['websocket'],
      upgrade: false,
      query: { playerId, playerName },
      forceNew: true
    });

    this.socket.on('connect', () => {
      console.log('[Network] Connected to Alpha Server.');
    });

    // When the server creates a match room with 50 entities (Players + Bots)
    this.socket.on('match_ready', (roomData) => {
      this.currentRoom = roomData.roomId;
      onMatchReady(roomData);
    });

    // Real-time tick update (Runs synced with server loop for 90 FPS feeling)
    this.socket.on('world_sync', (state) => {
      onWorldUpdate(state);
    });

    this.socket.on('disconnect', () => {
      console.log('[Network] Connection lost. Reconnecting...');
    });
  }

  // Broadcast local player movement vectors to the server
  emitMovement(x, y) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('player_input', {
        roomId: this.currentRoom,
        vector: { x, y }
      });
    }
  }

  // Action broadcast for resource gathering or combat interactions
  emitAction(actionType, targetId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('player_action', {
        roomId: this.currentRoom,
        action: actionType,
        targetId: targetId
      });
    }
  }

  // Clean disconnect when user leaves the match or app kills
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

const socketInstance = new SocketManager();
export default socketInstance;
