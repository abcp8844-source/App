import React, { useState } from 'react';
import { StyleSheet, View, PanResponder } from 'react-native';

export default function Joystick({ onMove }) {
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });
  const maxRadius = 45;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const distance = Math.sqrt(gestureState.dx ** 2 + gestureState.dy ** 2);
      const angle = Math.atan2(gestureState.dy, gestureState.dx);

      let x = gestureState.dx;
      let y = gestureState.dy;

      if (distance > maxRadius) {
        x = Math.cos(angle) * maxRadius;
        y = Math.sin(angle) * maxRadius;
      }

      setTouchPos({ x, y });

      const moveX = x / maxRadius;
      const moveY = y / maxRadius;
      onMove(moveX, moveY);
    },
    onPanResponderRelease: () => {
      setTouchPos({ x: 0, y: 0 });
      onMove(0, 0);
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View 
        style={[
          styles.knob, 
          { transform: [{ translateX: touchPos.x }, { translateY: touchPos.y }] }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(20, 20, 20, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    left: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  knob: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
});
