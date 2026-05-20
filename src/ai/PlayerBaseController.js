class PlayerBaseController {
  constructor() {
    this.snapGridSize = 50; // High precision grid system for custom modular houses
    this.maxBaseRadius = 300; // Total perimeter a single player can claim for their territory
    
    // HDR Shader Material Properties for high-end rendering pipelines
    this.materialSpecs = {
      REINFORCED_CONCRETE: { woodCost: 100, stoneCost: 200, ironCost: 50, maxHealth: 5000, metallic: 0.1, roughness: 0.7 },
      MILITARY_STEEL: { woodCost: 50, stoneCost: 150, ironCost: 250, maxHealth: 12000, metallic: 0.9, roughness: 0.2 }
    };
  }

  // 1. Initialize or claim a personalized Safehouse zone on the massive map
  createNewBase(playerId, centerX, centerY) {
    return {
      ownerId: playerId,
      baseCenter: { x: centerX, y: centerY },
      radius: this.maxBaseRadius,
      securityLockCode: null, // Custom passcode set by player to secure loot
      isAntiRaidActive: false,
      structures: [],
      vaultStorage: {
        goldCoins: 0,
        rareParts: 0,
        weapons: []
      }
    };
  }

  // 2. Advanced Building Validation with HDR Material Assignment
  structurePlacementEngine(player, baseState, targetX, targetY, structureType) {
    const specs = this.materialSpecs[structureType];
    if (!specs) return { success: false, reason: 'INVALID_MATERIAL_SPEC' };

    // Distance calculation to ensure player builds only within their claimed territory
    const distanceToCenter = Math.hypot(targetX - baseState.baseCenter.x, targetY - baseState.baseCenter.y);
    if (distanceToCenter > baseState.radius) {
      return { success: false, reason: 'OUTSIDE_SAFEHOUSE_TERRITORY' };
    }

    // Checking dynamic inventory allocation
    if (player.inventory.stone < specs.stoneCost || player.inventory.iron < specs.ironCost) {
      return { success: false, reason: 'INSUFFICIENT_PREMIUM_RESOURCES' };
    }

    // Snapping logic to align walls perfectly without gaps (Prevents visual clipping in HDR)
    const alignedX = Math.floor(targetX / this.snapGridSize) * this.snapGridSize;
    const alignedY = Math.floor(targetY / this.snapGridSize) * this.snapGridSize;

    // Deduct cost from player inventory
    player.inventory.stone -= specs.stoneCost;
    player.inventory.iron -= specs.ironCost;

    const newStructureBlock = {
      id: `struct_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: structureType,
      x: alignedX,
      y: alignedY,
      currentHealth: specs.maxHealth,
      maxHealth: specs.maxHealth,
      hdrShaderParams: {
        metallicValue: specs.metallic,
        roughnessValue: specs.roughness
      }
    };

    baseState.structures.push(newStructureBlock);
    return { success: true, placedBlock: newStructureBlock, updatedPlayerInventory: player.inventory };
  }

  // 3. Vault Protection & Anti-Cheat Hijack Engine for Player Loot
  secureVaultAccess(baseState, inputCode, playerId) {
    if (baseState.ownerId === playerId) {
      return { accessGranted: true, message: 'Welcome Back Commander' };
    }

    if (baseState.securityLockCode && baseState.securityLockCode === inputCode) {
      return { accessGranted: true, message: 'Access Overridden Successfully' };
    }

    return { accessGranted: false, message: 'SECURITY_ALERT: Unauthorized Access Attempt logged' };
  }
}

const baseControllerInstance = new PlayerBaseController();
export default baseControllerInstance;
