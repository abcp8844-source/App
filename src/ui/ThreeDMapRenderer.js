import * as THREE from 'three';
import dynamicWorldInstance from '../core/DynamicWorldEngine';

class ThreeDMapRenderer {
  constructor() {
    this.roadMaterial = new THREE.MeshStandardMaterial({
      color: '#1A1C22', // Dark asphalt color
      roughness: 0.6,
      metalness: 0.1
    });

    this.buildingMaterial = new THREE.MeshStandardMaterial({
      color: '#2A3447', // Modern blue-gray glass/concrete style
      roughness: 0.4,
      metalness: 0.5
    });

    this.foliageMaterial = new THREE.MeshStandardMaterial({
      color: '#0A2F1D', // Deep premium natural green for high-end look
      roughness: 0.9
    });
  }

  // 1. Process local 5x5 zone sectors around the player and render 3D meshes dynamically
  renderProceduralSectorMeshes(scene, playerGridX, playerGridY, activeMeshRegistry) {
    const renderRadius = 2; // Render current sector and surrounding boundary tiles
    
    for (let x = playerGridX - renderRadius; x <= playerGridX + renderRadius; x++) {
      for (let y = playerGridY - renderRadius; y <= playerGridY + renderRadius; y++) {
        const sectorKey = `sector_${x}_${y}`;
        
        // Skip building if this zone segment is already rendered on the GPU to save memory
        if (activeMeshRegistry[sectorKey]) continue;

        const sectorData = dynamicWorldInstance.generateSectorLayout(x, y);
        const sectorGroup = new THREE.Group();

        // 2. Mesh Construction Loop: Roads, Buildings, and Wilderness Structure Trees
        sectorData.grid.forEach((row, rowIndex) => {
          row.forEach((cell, cellIndex) => {
            // Calculate absolute 3D world coordinates on the 5000m master canvas
            const worldX = (x * 100) + (cellIndex * 10) - 2500;
            const worldZ = (y * 100) + (rowIndex * 10) - 2500;

            if (cell === 'ROAD') {
              // Create ultra-smooth seamless driving road segments
              const roadGeo = new THREE.PlaneGeometry(10, 10);
              const roadMesh = new THREE.Mesh(roadGeo, this.roadMaterial);
              roadMesh.rotation.x = -Math.PI / 2;
              roadMesh.position.set(worldX, 0.02, worldZ); // Micro height lift to prevent ground clipping
              sectorGroup.add(roadMesh);
            } 
            else if (cell === 'BUILDING') {
              // Generate procedural skyscrapers with varying randomized heights for premium realism
              const height = 15 + Math.random() * 35;
              const bGeo = new THREE.BoxGeometry(8, height, 8);
              const bMesh = new THREE.Mesh(bGeo, this.buildingMaterial);
              bMesh.position.set(worldX, height / 2, worldZ);
              sectorGroup.add(bMesh);
            }
            else if (cell === 'FOREST') {
              // Low-poly high-speed mobile tree generation
              const trunkGeo = new THREE.CylinderGeometry(0.4, 0.6, 3);
              const trunkMat = new THREE.MeshStandardMaterial({ color: '#4A2E13' });
              const trunk = new THREE.Mesh(trunkGeo, trunkMat);
              trunk.position.set(worldX, 1.5, worldZ);

              const leavesGeo = new THREE.ConeGeometry(3, 6, 5);
              const leaves = new THREE.Mesh(leavesGeo, this.foliageMaterial);
              leaves.position.set(worldX, 4.5, worldZ);

              const treeGroup = new THREE.Group();
              treeGroup.add(trunk);
              treeGroup.add(leaves);
              sectorGroup.add(treeGroup);
            }
          });
        });

        // Add the fully baked sector node package to the active 3D view arena
        scene.add(sectorGroup);
        activeMeshRegistry[sectorKey] = sectorGroup;
      }
    }

    // 3. Occlusion Culling: Automatically delete far away sectors to keep mobile processing smooth
    this.cullDistantSectors(scene, playerGridX, playerGridY, activeMeshRegistry, renderRadius);
  }

  cullDistantSectors(scene, playerGridX, playerGridY, activeMeshRegistry, radius) {
    Object.keys(activeMeshRegistry).forEach(key => {
      const parts = key.split('_');
      const sX = parseInt(parts[1]);
      const sY = parseInt(parts[2]);

      if (Math.abs(sX - playerGridX) > radius || Math.abs(sY - playerGridY) > radius) {
        scene.remove(activeMeshRegistry[key]);
        // Free up memory from GPU pipelines instantly
        if (activeMeshRegistry[key].geometry) activeMeshRegistry[key].geometry.dispose();
        delete activeMeshRegistry[key];
      }
    });
  }
}

const threeDMapRendererInstance = new ThreeDMapRenderer();
export default threeDMapRendererInstance;
