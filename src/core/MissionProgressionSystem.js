class MissionProgressionSystem {
  constructor() {
    // Mission status definitions
    this.STATUS_LOCKED = 'LOCKED';
    this.STATUS_AVAILABLE = 'AVAILABLE';
    this.STATUS_ACTIVE = 'ACTIVE';
    this.STATUS_COMPLETED = 'COMPLETED';
  }

  // 1. Core database structure for high-stakes campaign missions mapping across zones
  initializeCampaignManifest() {
    return {
      m_scout_forest: {
        id: 'm_scout_forest',
        targetZone: 'ZONE_FOREST',
        title: 'Establish Wilderness Outpost',
        description: 'Locate and clear the abandoned radio tower in the dense forest.',
        coordinates: { x: 850, y: 1400 },
        prerequisites: [],
        status: this.STATUS_AVAILABLE,
        rewards: { xp: 500, blueprints: ['REINFORCED_CONCRETE'] }
      },
      m_hijack_convoy: {
        id: 'm_hijack_convoy',
        targetZone: 'ZONE_VILLAGE',
        title: 'Intercept Fuel Supplies',
        description: 'Ambush an AI driver transport convoy on the main highway and secure the heavy SUV.',
        coordinates: { x: 2100, y: 2500 },
        prerequisites: ['m_scout_forest'],
        status: this.STATUS_LOCKED,
        rewards: { xp: 1200, goldCoins: 2000 }
      },
      m_city_hacker: {
        id: 'm_city_hacker',
        targetZone: 'ZONE_CITY',
        title: 'Breach Downtown Grid',
        description: 'Infiltrate the high-rise concrete skyscraper central mainframe to permanently lift city fog.',
        coordinates: { x: 4200, y: 3100 },
        prerequisites: ['m_hijack_convoy'],
        status: this.STATUS_LOCKED,
        rewards: { xp: 3000, blueprints: ['MILITARY_STEEL'] }
      }
    };
  }

  // 2. Main execution engine evaluating mission state transitions and clearing dynamic world fog
  evaluateObjectiveTicks(player, activeWorldState, completedMissionId) {
    const manifest = activeWorldState.campaignManifest || this.initializeCampaignManifest();
    const targetMission = manifest[completedMissionId];

    if (!targetMission || targetMission.status !== this.STATUS_ACTIVE) {
      return { success: false, reason: 'MISSION_NOT_ACTIVE_OR_INVALID' };
    }

    // Mark mission as successfully cleared
    targetMission.status = this.STATUS_COMPLETED;

    // Process and allocate progression rewards into the player structure
    player.xp += targetMission.rewards.xp;
    if (targetMission.rewards.goldCoins) player.coins += targetMission.rewards.goldCoins;
    if (targetMission.rewards.blueprints) {
      player.blueprints = [...new Set([...player.blueprints, ...targetMission.rewards.blueprints])];
    }

    // Process downstream unlock chains across the 3-zone architecture
    this.recalculateWorldFogAndLocks(manifest, activeWorldState.fogOfWar);

    activeWorldState.campaignManifest = manifest;
    return {
      success: true,
      updatedPlayer: player,
      unlockedZones: activeWorldState.fogOfWar
    };
  }

  // 3. Dynamic unlock sequence mapping directly to atmospheric visibility values
  recalculateWorldFogAndLocks(manifest, fogOfWarState) {
    for (let key in manifest) {
      const mission = manifest[key];

      if (mission.status === this.STATUS_COMPLETED) {
        // If the regional milestone is met, permanently drop fog opacity to crystal clear
        const zoneId = mission.targetZone;
        if (fogOfWarState[zoneId] && !fogOfWarState[zoneId].isUnlocked) {
          fogOfWarState[zoneId].isUnlocked = true;
          fogOfWarState[zoneId].density = 0.0; // Dissolves the cloud overlay on the UI map smoothly
        }
      }

      // Check locked missions to see if all prerequisite chains are clear
      if (mission.status === this.STATUS_LOCKED) {
        const meetsAllPrereqs = mission.prerequisites.every(reqId => manifest[reqId].status === this.STATUS_COMPLETED);
        if (meetsAllPrereqs) {
          mission.status = this.STATUS_AVAILABLE;
        }
      }
    }
  }
}

const missionProgressionInstance = new MissionProgressionSystem();
export default missionProgressionInstance;
