import * as THREE from 'three';
import dynamicWorldInstance from '../core/DynamicWorldEngine';

class ThreeDMapRenderer {
  constructor(scene) {
    this.roadMaterial = new THREE.MeshStandardMaterial({ color: '#2A2C30', roughness: 0.8 });
    this.buildingMaterial = new THREE.MeshStandardMaterial({ color: '#4A5468', metalness: 0.2, roughness: 0.5 });
    this.foliageMaterial = new THREE.MeshStandardMaterial({ color: '#0A2F1D', roughness: 0.9 });
    this.trunkMaterial = new THREE.MeshStandardMaterial({ color: '#4A2E13', roughness: 0.9 });

    this.roadGeo = new THREE.PlaneGeometry(10, 10);
    this.bGeo = new THREE.BoxGeometry(8, 1, 8);
    this.trunkGeo = new THREE.CylinderGeometry(0.4, 0.6, 3);
    this.leavesGeo = new THREE.ConeGeometry(3, 6, 5);

    // Lighting setup for realism
    this.setupLighting(scene);
    console.log('[3DMapRenderer] Renderer initialized with realistic materials and lighting.');
  }

  setupLighting(scene) {
    // Soft white ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    // Directional light for shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    scene.add(directionalLight);
  }

  renderProceduralSectorMeshes(scene, playerGridX, playerGridY, activeMeshRegistry) {
    const renderRadius = 2;
    
    for (let x = playerGridX - renderRadius; x <= playerGridX + renderRadius; x++) {
      for (let y = playerGridY - renderRadius; y <= playerGridY + renderRadius; y++) {
        const sectorKey = `sector_${x}_${y}`;
        if (activeMeshRegistry[sectorKey]) continue;

        const sectorData = dynamicWorldInstance.generateSectorLayout(x, y);
        if (!sectorData) continue;
        
        const sectorGroup = new THREE.Group();

        sectorData.grid.forEach((row, rowIndex) => {
          row.forEach((cell, cellIndex) => {
            const worldX = (x * 100) + (cellIndex * 10) - 2500;
            const worldZ = (y * 100) + (rowIndex * 10) - 2500;
            let mesh;

            switch (cell) {
              case 'ROAD':
                mesh = new THREE.Mesh(this.roadGeo, this.roadMaterial);
                mesh.rotation.x = -Math.PI / 2;
                mesh.position.set(worldX, 0.02, worldZ);
                mesh.receiveShadow = true;
                sectorGroup.add(mesh);
                break;
              case 'BUILDING':
                const height = 15 + Math.random() * 35;
                mesh = new THREE.Mesh(this.bGeo, this.buildingMaterial);
                mesh.scale.y = height;
                mesh.position.set(worldX, height / 2, worldZ);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                sectorGroup.add(mesh);
                break;
              case 'FOREST':
                const treeGroup = new THREE.Group();
                const trunk = new THREE.Mesh(this.trunkGeo, this.trunkMaterial);
                trunk.position.set(worldX, 1.5, worldZ);
                trunk.castShadow = true;
                const leaves = new THREE.Mesh(this.leavesGeo, this.foliageMaterial);
                leaves.position.set(worldX, 4.5, worldZ);
                leaves.castShadow = true;
                treeGroup.add(trunk, leaves);
                sectorGroup.add(treeGroup);
                break;
            }
          });
        });

        scene.add(sectorGroup);
        activeMeshRegistry[sectorKey] = sectorGroup;
      }
    }

    this.cullDistantSectors(scene, playerGridX, playerGridY, activeMeshRegistry, renderRadius);
  }

  cullDistantSectors(scene, playerGridX, playerGridY, activeMeshRegistry, radius) {
    Object.keys(activeMeshRegistry).forEach(key => {
      const parts = key.split('_');
      const sX = parseInt(parts[1]);
      const sY = parseInt(parts[2]);

      if (Math.abs(sX - playerGridX) > radius || Math.abs(sY - playerGridY) > radius) {
        const object = activeMeshRegistry[key];
        scene.remove(object);
        object.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
        delete activeMeshRegistry[key];
      }
    });
  }
}

export default ThreeDMapRenderer;
