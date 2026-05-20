import React, { useState, useRef } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import ThreeDRenderViewport from './ThreeDRenderViewport';
import OnScreenControllerOverlay from './OnScreenControllerOverlay';

export default function GameMainStageScreen() {
  const [isGameRunning, setIsGameRunning] = useState(true);
  
  // 1. Unified state vector storing real-time touch inputs from the overlay screen
  const [joystickInput, setJoystickInput] = useState({
    x: 0,
    y: 0,
    runPressed: false,
    interactTriggered: false,
    throttlePressed: false,
    driftPressed: false,
    exitVehicle: false
  });

  // 2. Callback bridge that handles input modifications coming from the HUD layer instantly
  const handleInputDeltaChanged = (actionKey, isActive) => {
    setJoystickInput(prevInput => {
      const updatedInput = { ...prevInput, [actionKey]: isActive };

      // High-speed positional interpolation logic for virtual joystick movement conversion
      if (actionKey === 'throttlePressed' && isActive) {
        updatedInput.y = 1.0; // Simulate full analog stick forward force for sports bikes
      } else if (actionKey === 'throttlePressed' && !isActive) {
        updatedInput.y = 0; // Throttle released, engage natural engine braking
      }

      // Handle custom directional dampening for sharp drifts
      if (actionKey === 'driftPressed' && isActive) {
        updatedInput.runPressed = true; // Inject physics drift factor multiplier flag
      } else if (actionKey === 'driftPressed' && !isActive) {
        updatedInput.runPressed = false;
      }

      return updatedInput;
    });
  };

  return (
    <View style={styles.stageFrameContainer}>
      {/* Hide mobile device status bar lines to provide 100% immersive fullscreen gaming */}
      <StatusBar hidden={true} />

      {/* BACKGROUND LAYER: High-Performance 60FPS WebGL 3D Graphic Canvas Viewport */}
      <ThreeDRenderViewport 
        joystickInput={joystickInput} 
        isRunning={isGameRunning} 
      />

      {/* FOREGROUND LAYER: Premium Neon Tactical HUD Control Overlay (Pedals, Vitals, Speedometer) */}
      <OnScreenControllerOverlay 
        onInputDeltaChanged={handleInputDeltaChanged} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stageFrameContainer: {
    flex: 1,
    backgroundColor: '#020B18', // Matches premium deep space base system aesthetics
    overflow: 'hidden'
  }
});
