import * as THREE from 'three';

class ThreeDNatureRenderer {
  constructor() {
    this.sandMaterial = new THREE.MeshStandardMaterial({ color: '#D2B48C', roughness: 0.9 }); // Fine golden beach sand
    this.waterMaterial = new THREE.MeshStandardMaterial({ color: '#0F4C81', roughness: 0.2, metalness: 0.8, transparent: true, opacity: 0.85 }); // Clear blue ocean water
    this.mountainMaterial = new THREE.MeshStandardMaterial({ color: '#3A3F47', roughness: 0.95 }); // Jagged dark rock cliff texturing
    this.cropMaterial = new THREE.MeshStandardMaterial({ color: '#CC9933', roughness: 0.9 }); // Golden ripe farm crops
  }

  // 1. Render real-time environmental nature grids around the dynamic player view
  injectNatureMeshesIntoScene(scene, terrainContextData, worldX, worldZ, elementId, activeMeshCache) {
    if (activeMeshCache[elementId]) return; // Skip if already loaded into GPU memory

    const natureGroup = new THREE.Group();

    if (terrainContextData.type === 'OCEAN_WATER') {
      const waterGeo = new THREE.PlaneGeometry(10, 10);
      const waterMesh = new THREE.Mesh(waterGeo, this.waterMaterial);
      waterMesh.rotation.x = -Math.PI / 2;
      waterMesh.position.set(worldX, -0.5, worldZ); // Set below sand level
      natureGroup.add(waterMesh);
    }
    else if (terrainContextData.type === 'SANDY_BEACH') {
      const sandGeo = new THREE.PlaneGeometry(10, 10);
      const sandMesh = new THREE.Mesh(sandGeo, this.sandMaterial);
      sandMesh.rotation.x = -Math.PI / 2;
      sandMesh.position.set(worldX, 0.05, worldZ);
      natureGroup.add(sandMesh);
    }
    else if (terrainContextData.type === 'MOUNTAIN_TERRAIN') {
      // Build a steep vertical cliff pillar representing mountain heights
      const mGeo = new THREE.CylinderGeometry(2, 7, terrainContextData.elevation, 5);
      const mMesh = new THREE.Mesh(mGeo, this.mountainMaterial);
      mMesh.position.set(worldX, terrainContextData.elevation / 2, worldZ);
      natureGroup.add(mMesh);
    }
    else if (terrainContextData.type === 'RURAL_FARMLAND') {
      // Render farm crop rows (fields)
      const fieldGeo = new THREE.BoxGeometry(9, 0.4, 9);
      const fieldMesh = new THREE.Mesh(fieldGeo, this.cropMaterial);
      fieldMesh.position.set(worldX, 0.2, worldZ);
      natureGroup.add(fieldMesh);
    }

    scene.add(natureGroup);
    activeMeshCache[elementId] = natureGroup;
  }

  // 2. Render animal meshes and instantly trigger flat death position if killed
  synchronizeFauna3D(scene, dynamicFaunaRegistry, activeFaunaMeshCache) {
    dynamicFaunaRegistry.forEach(animal => {
      let animalGroup = activeFaunaMeshCache[animal.id];

      // If the animal mesh doesn't exist on screen yet, build it on the fly
      if (!animalGroup) {
        animalGroup = new THREE.Group();
        const bodyGeo = animal.species === 'FARM_COW' ? new THREE.BoxGeometry(2, 1.8, 3.5) : new THREE.BoxGeometry(0.8, 0.9, 1.5);
        const colorHex = animal.species === 'FARM_COW' ? '#FFFFFF' : (animal.species === 'PET_DOG' ? '#8B4513' : '#424242');
        const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.8 });
        
        const mainMesh = new THREE.Mesh(bodyGeo, bodyMat);
        animalGroup.add(mainMesh);
        scene.add(animalGroup);
        activeFaunaMeshCache[animal.id] = animalGroup;
      }

      // Live Position Synchronization
      animalGroup.position.set(animal.x - 2500, animal.isDead ? 0.3 : 1.0, animal.y - 2500);
      animalGroup.rotation.y = animal.headingAngle;

      // Real-Time Death Logic Check: If killed, flip the 3D model on its side instantly
      if (animal.isDead) {
        animalGroup.rotation.z = Math.PI / 2; // Flat roll over on the floor to look 100% realistic
      }
    });
  }
}

const threeDNatureRendererInstance = new ThreeDNatureRenderer();
export default threeDNatureRendererInstance;
