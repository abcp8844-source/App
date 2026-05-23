import vehiclePhysicsInstance from './VehiclePhysicsController';

class PlayerStateController {
  constructor() {
    this.walkSpeed = 3.5; // Player's on-foot speed
    this.runSpeed = 7.0;  // Player's sprinting speed
  }

  // Frame update for the player, now handling both on-foot and in-vehicle states
  updatePlayerFrame(player, joyX, joyY, run, vehicle, drivingInputs) {
    if (!player) return;

    if (player.currentVehicleId && vehicle) {
      // Player is in a vehicle, so delegate control to the vehicle physics engine
      this.updateVehicleState(player, vehicle, drivingInputs);
    } else {
      // Player is on foot, use standard movement logic
      this.updateOnFootState(player, joyX, joyY, run);
    }
  }

  // Existing logic for when the player is on foot
  updateOnFootState(player, joyX, joyY, run) {
    const speed = run ? this.runSpeed : this.walkSpeed;
    const magnitude = Math.sqrt(joyX * joyX + joyY * joyY);

    if (magnitude > 0.1) {
      player.x += (joyX / magnitude) * speed;
      player.y -= (joyY / magnitude) * speed; // Y is inverted in screen coordinates
    }
  }

  // New logic for when the player is controlling a vehicle
  updateVehicleState(player, vehicle, drivingInputs) {
    if (!vehicle || !drivingInputs) return;

    const { throttle, brake, steer } = drivingInputs;

    // 1. Apply steering input
    if (Math.abs(steer) > 0.1) {
      const turnDirection = Math.sign(steer);
      // Adjust the vehicle's heading based on steer input and current speed
      // This is a simplified model. A real one would use angular velocity.
      vehicle.heading += turnDirection * 0.03 * (vehicle.speed / vehicle.maxSpeed);
    }

    // 2. Apply throttle and brake input
    if (throttle) {
      vehicle.speed = Math.min(vehicle.maxSpeed, vehicle.speed + 0.5);
    } else if (brake) {
      vehicle.speed = Math.max(0, vehicle.speed - 0.8);
    } else {
      // Natural deceleration (friction, air resistance)
      vehicle.speed = Math.max(0, vehicle.speed - 0.2);
    }

    // 3. Update vehicle position based on new speed and heading
    // This delegates the actual movement calculation to the VehiclePhysicsController
    vehiclePhysicsInstance.applyPlayerDrive(vehicle);

    // 4. Sync player position with the vehicle
    player.x = vehicle.x;
    player.y = vehicle.y;
  }
}

const playerStateInstance = new PlayerStateController();
export default playerStateInstance;
