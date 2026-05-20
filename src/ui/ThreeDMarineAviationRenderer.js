import * as THREE from 'three';

class ThreeDMarineAviationRenderer {
  constructor() {
    this.boatHullMaterial = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.1, metalness: 0.8 }); // Premium white fiber body
    this.aviationAlloyMaterial = new THREE.MeshStandardMaterial({ color: '#3A3A3A', roughness: 0.3, metalness: 0.9 }); // Brushed military titanium jet wing skins
    this.runwayNeonMaterial = new THREE.MeshStandardMaterial({ color: '#10FF50', emissive: '#056610' }); // Glowing green guide rails for airports
  }

  // 1. Render concrete flight fields and luxury helipads directly onto the landscape layout
  drawAviationStructures3D(scene, fleetControllerInstance) {
    // Generate Airport Runways
    Object.keys(fleetControllerInstance.aviationHubs).forEach(key => {
      const hub = fleetControllerInstance.aviationHubs[key];
      const runwayGeo = new THREE.PlaneGeometry(60, 400); // Massive authentic landing strips
      const runwayMat = new THREE.MeshStandardMaterial({ color: '#15171C', roughness: 0.7 });
      const runwayMesh = new THREE.Mesh(runwayGeo, runwayMat);
      
      runwayMesh.position.set(hub.x - 2500, 0.1, hub.y - 2500);
      runwayMesh.rotation.x = -Math.PI / 2;
      runwayMesh.rotation.z = hub.runwayHeading;
      scene.add(runwayMesh);
    });

    // Generate Skyscrapers Helipads high up on roofs
    fleetControllerInstance.skyscraperHelipads.forEach(pad => {
      const padGeo = new THREE.CylinderGeometry(8, 8, 0.5, 16);
      const padMat = new THREE.MeshStandardMaterial({ color: '#E53935', roughness: 0.5 }); // Industrial red landing platform
      const padMesh = new THREE.Mesh(padGeo, padMat);
      padMesh.position.set(pad.x - 2500, pad.altitude, pad.y - 2500);
      scene.add(padMesh);
    });
  }

  // 2. Synchronize complex meshes for ships, sharks and rotors during the 60fps frame loop
  renderActiveFleetModels(scene, fleetRegistry, activeMeshCache) {
    fleetRegistry.forEach(asset => {
      let cachedGroup = activeMeshCache[asset.id];

      if (!cachedGroup) {
        cachedGroup = new THREE.Group();
        
        if (asset.type === 'SPEED_BOAT' || asset.type === 'CARGO_LINER') {
          // Construct aerodynamic marine hull geometry
          const hull = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 9), this.boatHullMaterial);
          cachedGroup.add(hull);
        } 
        else if (asset.type.includes('JET')) {
          // Construct sharp swept-wing jet profiles
          const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 14, 8), this.aviationAlloyMaterial);
          fuselage.rotation.x = Math.PI / 2;
          cachedGroup.add(fuselage);
        }
        else if (asset.type === 'ROOFTOP_HELICOPTER') {
          // Construct helicopter cockpit with long spinning top rotors blades
          const body = new THREE.Mesh(new THREE.SphereGeometry(2), this.aviationAlloyMaterial);
          const rotors = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 12), this.aviationAlloyMaterial);
          rotors.position.y = 2.2;
          rotors.name = 'top_rotors_blade';
          
          cachedGroup.add(body);
          cachedGroup.add(rotors);
        }

        scene.add(cachedGroup);
        activeMeshCache[asset.id] = cachedGroup;
      }

      // Live Position Updates
      cachedGroup.position.set(asset.x - 2500, asset.altitude || 1.2, asset.y - 2500);

      // Spin helicopter rotors blades continuously if the engine is ready
      if (asset.type === 'ROOFTOP_HELICOPTER') {
        const rotorMesh = cachedGroup.getObjectByName('top_rotors_blade');
        if (rotorMesh) rotorMesh.rotation.y += 0.4; // Realistic spinning velocity
      }
    });
  }
}

const threeDMarineAviationRendererInstance = new ThreeDMarineAviationRenderer();
export default threeDMarineAviationRendererInstance;
