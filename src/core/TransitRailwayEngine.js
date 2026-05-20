class TransitRailwayEngine {
  constructor() {
    this.steamTrainProgress = 0.0; // Interpolation factor (0.0 to 1.0) along cross-country loop
    this.metroTrainProgress = 0.0; // Interpolation factor for overhead urban city line
    this.trainSpeedSteam = 0.0005; // Cinematic slow heavy locomotive speed
    this.trainSpeedMetro = 0.0015; // High-speed modern electric bullet pace
    
    // Stations infrastructure database
    this.railwayStations = {
      STEAM_CENTRAL:  { id: 'st_central', name: "Central Grand Terminal", x: 2500, y: 2200, isElevated: false },
      STEAM_COUNTRYSIDE: { id: 'st_country', name: "Green Valley Village Halt", x: 4100, y: 4200, isElevated: false },
      METRO_DOWNTOWN: { id: 'met_down', name: "Neon District Sky-Link", x: 2000, y: 2000, isElevated: true, altitude: 16 },
      METRO_FINANCIAL: { id: 'met_fin', name: "Royal Towers High-Platform", x: 2800, y: 2800, isElevated: true, altitude: 18 }
    };
  }

  // 1. Core Physics Processing Loop: Advances both trains along their dedicated track coordinates
  computeTrainFrameTicks(deltaTime) {
    // A. Steam Locomotive: Giant Cross-Country Loop spanning through rural farm biomes
    this.steamTrainProgress += this.trainSpeedSteam * deltaTime;
    if (this.steamTrainProgress > 1.0) this.steamTrainProgress = 0.0;

    // B. Elevated Modern Metro: High-speed continuous closed loop tightly inside city boundaries
    this.metroTrainProgress += this.trainSpeedMetro * deltaTime;
    if (this.metroTrainProgress > 1.0) this.metroTrainProgress = 0.0;

    // 2. Math Vector Calculations to derive exact X/Y positioning in the 5000m grid
    const liveSteamCoordinates = this.calculateSteamTrackSpline(this.steamTrainProgress);
    const liveMetroCoordinates = this.calculateMetroTrackSpline(this.metroTrainProgress);

    return {
      steamTrain: {
        x: liveSteamCoordinates.x,
        y: liveSteamCoordinates.y,
        z: 0.5, // Runs firmly on standard ground gravel ballast
        heading: liveSteamCoordinates.heading,
        type: 'STEAM_LOCOMOTIVE'
      },
      metroTrain: {
        x: liveMetroCoordinates.x,
        y: liveMetroCoordinates.y,
        z: liveMetroCoordinates.z, // Overhead altitude clearance tracking
        heading: liveMetroCoordinates.heading,
        type: 'MODERN_ELEVATED_METRO'
      }
    };
  }

  // 3. Track Spline Generator for Steam Engine (City Terminal to Mountain/Village Borders)
  calculateSteamTrackSpline(progress) {
    const angle = progress * Math.PI * 2;
    // Massive wide oval track covering the diagonal map axis from center to rural zones
    const x = 2500 + Math.cos(angle) * 1600;
    const y = 2500 + Math.sin(angle * 2) * 1200; // Figure-8 style sweep for long cross-country routes
    const heading = angle + Math.PI / 2;
    return { x, y, heading };
  }

  // 4. Track Spline Generator for Modern Sky Metro (Stays strictly within dense urban core)
  calculateMetroTrackSpline(progress) {
    const angle = progress * Math.PI * 2;
    // Perfect tight elevated square circle hovering exactly above metropolitan skyscrapers
    const x = 2500 + Math.cos(angle) * 600;
    const y = 2500 + Math.sin(angle) * 600;
    const z = 16.5; // Locked suspended deck height above standard car traffic channels
    const heading = angle + Math.PI / 2;
    return { x, y, z, heading };
  }
}

const transitRailwayInstance = new TransitRailwayEngine();
export default transitRailwayInstance;
