import { Audio } from 'expo-av';

class SoundFXDynamicEngine {
  constructor() {
    this.activeAudioPool = {};
    this.soundAssetsLibrary = {};
    this.isAudioEngineMuted = false;
  }

  /**
   * 1. PRE-LOAD GLOBAL SOUND CHANNELS
   * Maps memory registry addresses and prepares asynchronous background ducks.
   */
  async preheatGlobalSoundRegistry() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
      });

      this.soundAssetsLibrary = {
        FOOTSTEPS_CONCRETE: require('../../assets/sounds/footsteps_walk.mp3'),
        BIKE_IDLE: require('../../assets/sounds/bike_engine_idle.mp3'),
        BIKE_ACCELERATE: require('../../assets/sounds/bike_gear_rev.mp3'),
        TIRE_SCREECH_DRIFT: require('../../assets/sounds/tire_slip_drift.mp3'),
        STEAM_LOCOMOTIVE: require('../../assets/sounds/steam_train_chug.mp3'),
        METRO_ELECTRIC: require('../../assets/sounds/metro_subway_loop.mp3'),
        CHOPPER_ROTORS: require('../../assets/sounds/helicopter_blades.mp3'),
        JET_PROPULSION: require('../../assets/sounds/fighter_jet_flyby.mp3')
      };
      
      console.log("[AudioEngine] All infrastructure sound nodes mapped seamlessly.");
    } catch (err) {
      console.error("[AudioEngine] Failed to assign audio channels:", err);
    }
  }

  /**
   * 2. EUCLIDEAN DISTANCE MATRIX CALCULATOR
   * Computes inverse linear decay values between two moving vector states.
   */
  calculateSpatialVolume(playerX, playerY, sourceX, sourceY, maxAudibleRadius = 250) {
    const distance = Math.hypot(sourceX - playerX, sourceY - playerY);
    if (distance >= maxAudibleRadius) return 0.0;
    
    const rawVolume = 1.0 - (distance / maxAudibleRadius);
    return Math.max(0.0, Math.min(rawVolume, 1.0));
  }

  /**
   * 3. THE LIVE BIKE ENGINE SOUND LOGIC
   * Dynamically alters frequency modulations and pitch values relative to velocity thresholds.
   */
  async updatePlayerVehicleAudio(bikeSpeed, isDrifting, isAccelerating) {
    const bikeSoundInstance = this.activeAudioPool['PLAYER_BIKE'];
    if (!bikeSoundInstance) return;

    try {
      if (bikeSpeed === 0) {
        await bikeSoundInstance.setVolumeAsync(0.4);
        await bikeSoundInstance.setRateAsync(1.0, true);
      } else {
        const targetPitch = 1.0 + (bikeSpeed * 0.05);
        const targetVolume = isAccelerating ? 1.0 : 0.7;
        
        await bikeSoundInstance.setVolumeAsync(targetVolume);
        await bikeSoundInstance.setRateAsync(Math.min(targetPitch, 2.5), true);
      }

      const driftSoundInstance = this.activeAudioPool['TIRE_DRIFT'];
      if (driftSoundInstance) {
        if (isDrifting && bikeSpeed > 15) {
          await driftSoundInstance.setVolumeAsync(0.8);
        } else {
          await driftSoundInstance.setVolumeAsync(0.0);
        }
      }
    } catch (e) {
      // Frame skip bypass
    }
  }

  /**
   * 4. LIVE WORLD TRANSIT AUDIO SYNC
   * Couples environmental engine ticks with independent multi-threaded sound updates.
   */
  async synchronizeEnvironmentalAudio(playerX, playerY, liveTransitData, activeFleetRegistry) {
    try {
      const steamVol = this.calculateSpatialVolume(playerX, playerY, liveTransitData.steamTrain.x, liveTransitData.steamTrain.y, 400);
      if (this.activeAudioPool['STEAM_TRAIN']) await this.activeAudioPool['STEAM_TRAIN'].setVolumeAsync(steamVol);

      const metroVol = this.calculateSpatialVolume(playerX, playerY, liveTransitData.metroTrain.x, liveTransitData.metroTrain.y, 200);
      if (this.activeAudioPool['METRO_TRAIN']) await this.activeAudioPool['METRO_TRAIN'].setVolumeAsync(metroVol);

      activeFleetRegistry.forEach(async (asset) => {
        if (asset.type === 'ROOFTOP_HELICOPTER') {
          const chopperVol = this.calculateSpatialVolume(playerX, playerY, asset.x, asset.y, 300);
          const audioKey = `CHOPPER_${asset.id}`;
          if (this.activeAudioPool[audioKey]) await this.activeAudioPool[audioKey].setVolumeAsync(chopperVol);
        }
      });
    } catch (err) {
      // Standard execution guard
    }
  }

  /**
   * 5. CHARACTER FOOTSTEPS INTERFACE
   * Toggles low-amplitude impact pulses during terrestrial motion tracking loops.
   */
  async triggerPlayerFootstep(isMovingOnGround) {
    const footstep = this.activeAudioPool['FOOTSTEPS'];
    if (!footstep) return;

    if (isMovingOnGround) {
      await footstep.setVolumeAsync(0.5);
    } else {
      await footstep.setVolumeAsync(0.0);
    }
  }
}

const soundFXEngineInstance = new SoundFXDynamicEngine();
export default soundFXEngineInstance;
