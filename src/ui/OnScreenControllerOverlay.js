import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Joystick } from 'react-native-joypad';
import gameStateInstance from '../core/GameStateManager';

const OnScreenControllerOverlay = () => {
  const [run, setRun] = useState(false);
  const [drivingControls, setDrivingControls] = useState({ throttle: false, brake: false, steer: 0 });

  // Link local state to the global game state manager
  useEffect(() => {
    gameStateInstance.setDrivingControls(drivingControls);
  }, [drivingControls]);

  const handleSteer = (direction) => {
    setDrivingControls(prev => ({ ...prev, steer: direction }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.joystickContainer}>
        <Joystick 
          onMove={e => gameStateInstance.setJoystick(e.x, e.y)}
          onStop={() => gameStateInstance.setJoystick(0, 0)}
        />
      </View>
      <View style={styles.actionsContainer}>
        <Button title="Run" onPress={() => gameStateInstance.setRun(!run)} />
        
        {/* Driving Controls */}
        <View style={styles.drivingControls}>
            <Button title="Gas" onPressIn={() => setDrivingControls(prev => ({...prev, throttle: true}))} onPressOut={() => setDrivingControls(prev => ({...prev, throttle: false}))} />
            <Button title="Brake" onPressIn={() => setDrivingControls(prev => ({...prev, brake: true}))} onPressOut={() => setDrivingControls(prev => ({...prev, brake: false}))} />
            <Button title="<" onPressIn={() => handleSteer(-1)} onPressOut={() => handleSteer(0)} />
            <Button title=">" onPressIn={() => handleSteer(1)} onPressOut={() => handleSteer(0)} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
  },
  joystickContainer: {
    alignSelf: 'flex-end',
  },
  actionsContainer: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  drivingControls: {
      flexDirection: 'row',
      marginTop: 20
  }
});

export default OnScreenControllerOverlay;
