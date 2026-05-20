class VehicleMovementEngine {
  constructor() {
    // Environmental friction multipliers affecting acceleration curves
    this.surfaceFriction = {
      HIGHWAY: 1.0,    // Pure performance output
      STREET: 0.85,    // Standard inner-city handling
      DIRT_ROAD: 0.55, // Loose village mud causing drift physics
      OFF_ROAD: 0.35   // Dense forest terrain reducing top-end velocity
    };
  }

  // 1. Compute physics translations when a human player steps on the accelerator
  applyDriveThrust(activeVehicle, currentSurfaceType, joystickIntensity, brakePressed) {
    const friction = this.surfaceFriction[currentSurfaceType] || 0.35;
    const accelerationRate = activeVehicle.type === 'MOTORCYCLE' ? 1.4 : 0.8;
    const handlingTurnSpeed = activeVehicle.type === 'MOTORCYCLE' ? 0.08 : 0.04;

    // Handle braking deceleration mechanics
    if (brakePressed) {
      activeVehicle.speed *= 0.88; // Sharp decay factor
      if (activeVehicle.speed < 0.2) activeVehicle.speed = 0;
      return activeVehicle;
    }

    // Apply incremental surface-aware acceleration equations
    if (joystickIntensity > 0) {
      const targetMaxSpeed = activeVehicle.maxSpeed * friction;
      if (activeVehicle.speed < targetMaxSpeed) {
        activeVehicle.speed += accelerationRate * friction;
      } else {
        activeVehicle.speed -= 0.3; // Natural air resistance engine drag
      }
    } else {
      activeVehicle.speed *= 0.95; // Passive engine braking deceleration when letting go of controls
    }

    return activeVehicle;
  }

  // 2. Vector update computing trajectory heading based on steering inputs
  processSteeringInput(activeVehicle, steeringJoystickX) {
    if (activeVehicle.speed === 0) return activeVehicle; // Prevent turning while completely static

    const turnFactor = activeVehicle.type === 'MOTORCYCLE' ? 0.08 : 0.05;
    
    // Scale turning capability by velocity to replicate drift slippage at high speeds
    const effectiveTurn = steeringJoystickX * turnFactor * (1 - (activeVehicle.speed / 50));
    activeVehicle.rotation += effectiveTurn;

    // Convert angle to directional X/Y velocity vectors
    activeVehicle.x += Math.cos(activeVehicle.rotation) * activeVehicle.speed;
    activeVehicle.y += Math.sin(activeVehicle.rotation) * activeVehicle.speed;

    return activeVehicle;
  }
}

const vehicleMovementInstance = new VehicleMovementEngine();
export default vehicleMovementInstance;
