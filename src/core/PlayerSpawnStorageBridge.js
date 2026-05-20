import localCacheInstance from '../network/LocalCacheEngine';
import realEstateInstance from './RealEstateMarketController';

class PlayerSpawnStorageBridge {
  // 1. Determine exact real-world matrix coordinate where player should enter the screen
  calculateAuthoritativeSpawnPoint(playerProfile, globalHousingRegistry) {
    const storageKey = `royal_player_secure_save_${playerProfile.id}`;
    
    // Check local mobile memory for last updated assets
    if (playerProfile.ownedProperties && playerProfile.ownedProperties.length > 0) {
      // Fetch the primary home purchased by the user (e.g., their first listed Safehouse)
      const primaryPropertyId = playerProfile.ownedProperties[0];
      const propertyDetails = globalHousingRegistry[primaryPropertyId];

      if (propertyDetails) {
        console.log(`[SpawnBridge] Real player detected inside owned estate: ${propertyDetails.title}. Launching inside safehouse.`);
        return {
          x: propertyDetails.x, 
          y: propertyDetails.y + 5, // Spawn 5 meters outside the main door/garage grid
          spawnLocationContext: 'OWNED_SAFEHOUSE',
          associatedPropertyId: primaryPropertyId
        };
      }
    }

    // Default fallback: If the player is a newcomer with $0 assets, launch them at the public bus terminal
    console.log("[SpawnBridge] New pedestrian account with zero assets. Spawning at central city public terminal.");
    return {
      x: 2500, // Exact center of our 5000m map infrastructure
      y: 2500,
      spawnLocationContext: 'PUBLIC_BUS_TERMINAL',
      associatedPropertyId: null
    };
  }
}

const spawnStorageBridgeInstance = new PlayerSpawnStorageBridge();
export default spawnStorageBridgeInstance;
