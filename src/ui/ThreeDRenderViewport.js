import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import gameStateInstance from '../core/GameStateManager';

export default function ThreeDRenderViewport({ joystickInput, isRunning }) {
  const requestRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  // Core mesh allocation trackers for performance optimization
  const activeVehicleMeshes = {};
  const playerMeshRef = useRef(null);

  const onContextCreate = async (gl) => {
    // 1. Initialize High-Performance WebGL Renderer on Mobile GPU
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor('#020B18'); // Space background shade matching luxury UI
    rendererRef.current = renderer;

    // 2. Scene setup with depth sorting enabled
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#020B18', 0.0025); // Volumetric environmental fog
    sceneRef.current = scene;

    // 3. Ultra-HD Cinematic Camera Perspective
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
    camera.position.set(0, 45, 30); // Tactical top-down driving angle
    cameraRef.current = camera;

    // 4. Inject Premium Lighting Pipeline Configurations
    const ambientLight = new THREE.AmbientLight('#1A2B4C', 0.8);
    scene.add(ambientLight);

    const sunDriveLight = new THREE.DirectionalLight('#FFD700', 1.5); // Warm golden afternoon sun ray
    sunDriveLight.position.set(100, 300, 100);
    sunDriveLight.castShadow = true;
    scene.add(sunDriveLight);

    // 5. Build Procedural Ground Grid infrastructure representing our 5000m World
    const worldSize = 5000;
    const groundGeometry = new THREE.PlaneGeometry(worldSize, worldSize);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: '#111622',
      roughness: 0.8,
      metalness: 0.2
    });
    const groundGridMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundGridMesh.rotation.x = -Math.PI / 2;
    scene.add(groundGridMesh);

    // Initial Core Engine Boot-up Sequence
    gameStateInstance.bootUpEngine({ id: 'royal_player_alpha' });

    // 6. Master Frame Rendering Loop running locked at 60 FPS
    const renderFrameCycle = () => {
      if (!isRunning) return;

      // Extract current dynamic updates from the Game State Manager
      const frameBuffer = gameStateInstance.processFrameTick(
        joystickInput.x,
        joystickInput.y,
        joystickInput.runPressed,
        joystickInput.interactTriggered
      );

      if (frameBuffer) {
        // Real-time synchronization of player mesh position on 3D space
        if (!playerMeshRef.current) {
          // Construct player dimensional placeholder capsule if not rendered
          const playerGeo = new THREE.BoxGeometry(2, 4, 2);
          const playerMat = new THREE.MeshStandardMaterial({ color: '#FF8C00', roughness: 0.4 });
          playerMeshRef.current = new THREE.Mesh(playerGeo, playerMat);
          scene.add(playerMeshRef.current);
        }

        // Apply updated vectors to the player 3D asset
        playerMeshRef.current.position.set(frameBuffer.player.x - 2500, 2, frameBuffer.player.y - 2500);
        playerMeshRef.current.rotation.y = frameBuffer.player.rotation;

        // Smoothly glide camera relative to player position to avoid visual jittering
        camera.position.set(
          playerMeshRef.current.position.x,
          camera.position.y,
          playerMeshRef.current.position.z + 35
        );
        camera.lookAt(playerMeshRef.current.position);

        // Render dynamic traffic fleet vectors inside the view matrix
        frameBuffer.vehicles.forEach(vehicle => {
          let vMesh = activeVehicleMeshes[vehicle.id];
          if (!vMesh) {
            const vGeo = vehicle.type === 'MOTORCYCLE' ? new THREE.BoxGeometry(1, 1.8, 3) : new THREE.BoxGeometry(2.5, 2.2, 5);
            const vMat = new THREE.MeshStandardMaterial({ color: vehicle.color || '#C0C0C0' });
            vMesh = new THREE.Mesh(vGeo, vMat);
            scene.add(vMesh);
            activeVehicleMeshes[vehicle.id] = vMesh;
          }
          vMesh.position.set(vehicle.x - 2500, 1.1, vehicle.y - 2500);
          vMesh.rotation.y = vehicle.heading;
        });
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
      requestRef.current = requestAnimationFrame(renderFrameCycle);
    };

    renderFrameCycle();
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <GLView style={styles.glSurface} onContextCreate={onContextCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020B18' },
  glSurface: { width: Dimensions.get('window').width, height: Dimensions.get('window').height }
});
