import * as THREE from 'three';

class VehicleModelLoader {
  constructor() {
    this.carPaintMaterial = new THREE.MeshStandardMaterial({
      color: '#FF1493', // Premium racing hot pink base
      roughness: 0.2,
      metalness: 0.9 // High reflection mapping matching premium HDR requirements
    });

    this.wheelMaterial = new THREE.MeshStandardMaterial({
      color: '#090A0C',
      roughness: 0.7
    });
  }

  // 1. Compile 3D asset shapes on the fly based on vehicle catalog registry index ID
  assembleVehicle3DMesh(vehicleModelId) {
    const compoundVehicleGroup = new THREE.Group();

    if (vehicleModelId.includes('MOTO')) {
      // Build sleek racing bike topology
      const bodyGeo = new THREE.BoxGeometry(0.8, 1.4, 2.5);
      const bikeMesh = new THREE.Mesh(bodyGeo, this.carPaintMaterial);
      bikeMesh.position.y = 0.8;
      compoundVehicleGroup.add(bikeMesh);

      // Front & Rear dynamic rubber tires
      const tireGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 12);
      const frontTire = new THREE.Mesh(tireGeo, this.wheelMaterial);
      frontTire.rotation.z = Math.PI / 2;
      frontTire.position.set(0, 0.5, 1.1);
      
      const rearTire = frontTire.clone();
      rearTire.position.set(0, 0.5, -1.1);

      compoundVehicleGroup.add(frontTire);
      compoundVehicleGroup.add(rearTire);
    } 
    else {
      // Build low-slung premium sports car architecture
      const chassisGeo = new THREE.BoxGeometry(2.4, 0.8, 4.8);
      const chassis = new THREE.Mesh(chassisGeo, this.carPaintMaterial);
      chassis.position.y = 0.6;

      const cabinGeo = new THREE.BoxGeometry(2.0, 0.7, 2.4);
      const cabinMat = new THREE.MeshStandardMaterial({ color: '#050B14', roughness: 0.1, metalness: 0.9 });
      const cabin = new THREE.Mesh(cabinGeo, cabinMat);
      cabin.position.set(0, 1.3, -0.4);

      compoundVehicleGroup.add(chassis);
      compoundVehicleGroup.add(cabin);

      // Four-wheel setup allocation
      const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 12);
      const wheelPositions = [
        [1.25, 0.5, 1.6],   // Front Right
        [-1.25, 0.5, 1.6],  // Front Left
        [1.25, 0.5, -1.6],  // Rear Right
        [-1.25, 0.5, -1.6]  // Rear Left
      ];

      wheelPositions.forEach(pos => {
        const wheelMesh = new THREE.Mesh(wheelGeo, this.wheelMaterial);
        wheelMesh.rotation.z = Math.PI / 2;
        wheelMesh.position.set(pos[0], pos[1], pos[2]);
        compoundVehicleGroup.add(wheelMesh);
      });
    }

    return compoundVehicleGroup;
  }
}

const vehicleModelLoaderInstance = new VehicleModelLoader();
export default vehicleModelLoaderInstance;
