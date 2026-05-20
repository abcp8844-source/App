class RealEstateMarketController {
  constructor() {
    // Base valuation registry across the 3 main map biomes
    this.zonePriceTiers = {
      ZONE_FOREST:  { basePrice: 15000, taxRate: 0.02, tierName: 'Wilderness Cabin' },
      ZONE_VILLAGE: { basePrice: 45000, taxRate: 0.04, tierName: 'Rural Homestead' },
      ZONE_CITY:    { basePrice: 250000, taxRate: 0.08, tierName: 'Downtown Penthouse' }
    };
  }

  // 1. Pre-populate 10,000 unique purchasable property slots across the 5000m grid
  generateGlobalHousingRegistry() {
    const propertyDirectory = {};
    const zones = ['ZONE_FOREST', 'ZONE_VILLAGE', 'ZONE_CITY'];

    for (let i = 0; i < 10000; i++) {
      const propertyId = `prop_slot_${i}`;
      const assignedZone = zones[i % zones.length];
      const tier = this.zonePriceTiers[assignedZone];

      // Procedural dispersion matching street layouts to avoid congestion clusters
      let posX = Math.floor(Math.random() * 4800) + 100;
      let posY = Math.floor(Math.random() * 4800) + 100;

      propertyDirectory[propertyId] = {
        id: propertyId,
        zone: assignedZone,
        title: `${tier.tierName} #${i + 1}`,
        x: posX,
        y: posY,
        marketValue: tier.basePrice + Math.floor(Math.random() * 5000), // Dynamic pricing
        currentOwnerId: null, // NULL means available on the open public market
        isForSale: true,
        vaultCapacity: assignedZone === 'ZONE_CITY' ? 500000 : 50000
      };
    }
    return propertyDirectory;
  }

  // 2. Premium Real Estate transactional loop (Buy/Sell Engine)
  processPropertyPurchase(player, property, globalHousingRegistry) {
    if (!property.isForSale) {
      return { success: false, reason: 'PROPERTY_NOT_ON_MARKET' };
    }

    if (player.coins < property.marketValue) {
      return { success: false, reason: 'INSUFFICIENT_FUNDS_IN_VAULT' };
    }

    // Process Transaction
    player.coins -= property.marketValue;
    property.currentOwnerId = player.id;
    property.isForSale = false;

    // Register property to player's asset list
    if (!player.ownedProperties) player.ownedProperties = [];
    player.ownedProperties.push(property.id);

    return {
      success: true,
      updatedPlayer: player,
      propertyState: property
    };
  }

  // 3. Sell system allowing players to flip properties back into the market for cash
  listPropertyForResale(player, propertyId, listingPrice, globalHousingRegistry) {
    const property = globalHousingRegistry[propertyId];
    
    if (!property || property.currentOwnerId !== player.id) {
      return { success: false, reason: 'UNAUTHORIZED_ASSET_ACCESS' };
    }

    property.marketValue = listingPrice;
    property.isForSale = true;

    return { success: true, message: 'Listed successfully on global player market exchange' };
  }
}

const realEstateInstance = new RealEstateMarketController();
export default realEstateInstance;
