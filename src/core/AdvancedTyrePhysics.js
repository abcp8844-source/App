class AdvancedTyrePhysics {
  constructor() {
    this.GRAVITY = 9.81;
    this.AIR_DENSITY = 1.225;
  }

  // 1. Calculate real-world downforce and tyre slip angle for drift mechanics
  calculateGripVectors(vehicle, surfaceFriction, steeringInput) {
    // Aerodynamic Downforce: As speed increases, push the car harder onto the asphalt
    const frontalArea = vehicle.type === 'MOTORCYCLE' ? 0.6 : 2.2;
    const dragCoefficient = vehicle.type === 'SPORTS_CAR' ? 0.3 : 0.5;
    const downforce = 0.5 * this.AIR_DENSITY * Math.pow(vehicle.speed, 2) * dragCoefficient * frontalArea;

    // Total normal force compressing the suspension into the street
    const totalVerticalForce = (vehicle.weight * this.GRAVITY) + downforce;

    // Lateral slip angle matrix (Determines if tyres are gripping or sliding)
    const slipAngle = Math.abs(steeringInput) * (vehicle.speed * 0.15);
    
    let currentGripMultiplier = surfaceFriction;
    let isDrifting = false;

    // If slip threshold is breached, trigger high-fidelity drift physics
    if (slipAngle > 1.2 && vehicle.speed > 15) {
      isDrifting = true;
      // Friction drops during drift, causing the rear tires to slide organically
      currentGripMultiplier = surfaceFriction * 0.45; 
    }

    // Dynamic traction output using total compressed mass and current surface slip
    const maxTractionForce = totalVerticalForce * currentGripMultiplier;

    return {
      downforceNewton: downforce,
      isDrifting: isDrifting,
      effectiveTraction: maxTractionForce,
      bodyRollAngle: (steeringInput * vehicle.speed) * 0.05 // Visual camera lean for motorcycles
    };
  }
}

const tyrePhysicsInstance = new AdvancedTyrePhysics();
export default tyrePhysicsInstance;
