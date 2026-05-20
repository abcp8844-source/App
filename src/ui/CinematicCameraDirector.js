import * as THREE from 'three';

class CinematicCameraDirector {
  constructor() {
    this.idealOffset = new THREE.Vector3(0, 18, 28); // Position matrix behind vehicle
    this.idealLookAt = new THREE.Vector3(0, 2, 0);
    this.currentPosition = new THREE.Vector3();
    this.currentLookAt = new THREE.Vector3();
  }

  // 1. Calculate elastic camera dragging vectors using lerp matrices to smooth out camera translations
  updateDynamicViewMatrix(camera, targetTransform, currentSpeedKmh, frameDeltaTime) {
    // Dynamic field-of-view modification based on dynamic velocity metrics
    const targetedFov = 60 + (currentSpeedKmh * 0.18); 
    if (camera.fov !== targetedFov) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetedFov, 0.05);
      camera.updateProjectionMatrix();
    }

    // Adjust target distance dynamically based on vehicle slip or rapid velocity boosts
    const velocityScale = Math.min(currentSpeedKmh / 100, 1.0);
    const contextOffset = this.idealOffset.clone();
    
    // Push camera slightly further backwards at maximum throttle bursts
    contextOffset.z += (velocityScale * 8);
    contextOffset.y += (velocityScale * 2);

    // Transform camera offsets dynamically relative to vehicle heading angle
    const targetRotationMatrix = new THREE.Matrix4().makeRotationY(targetTransform.rotation);
    const absoluteCameraOffset = contextOffset.applyMatrix4(targetRotationMatrix);

    // Compute exact position absolute marker inside 3D space coordinates
    const targetTargetPos = new THREE.Vector3(
      targetTransform.x - 2500,
      2,
      targetTransform.y - 2500
    );
    const absoluteCameraPosition = targetTargetPos.clone().add(absoluteCameraOffset);

    // 2. High-Fidelity Spherical Linear Interpolation (Lerp) to damp micro jitter or sudden physics collisions
    const fluidDampFactor = 1.0 - Math.exp(-6.5 * frameDeltaTime);
    this.currentPosition.lerp(absoluteCameraPosition, fluidDampFactor);
    this.currentLookAt.lerp(targetTargetPos, fluidDampFactor);

    // Apply computed matrix keys directly to the operational viewport camera node
    camera.position.copy(this.currentPosition);
    camera.lookAt(this.currentLookAt);
  }
}

const cameraDirectorInstance = new CinematicCameraDirector();
export default cameraDirectorInstance;
