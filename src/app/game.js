import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Joystick from '../src/components/Joystick';

const { width, height } = Dimensions.get('window');

export default function GameArena() {
  const { name } = useLocalSearchParams();
  const [playerPos, setPlayerPos] = useState({ x: width / 2, y: height / 2 });
  const moveVector = useRef({ x: 0, y: 0 });
  const speed = 4; 

  useEffect(() => {
    // 90 FPS گرافکس رینڈرنگ انجن لوپ
    let animationFrameId;
    
    const gameLoop = () => {
      if (moveVector.current.x !== 0 || moveVector.current.y !== 0) {
        setPlayerPos((prev) => ({
          x: Math.max(20, Math.min(width - 20, prev.x + moveVector.current.x * speed)),
          y: Math.max(20, Math.min(height - 20, prev.y + moveVector.current.y * speed)),
        }));
      }
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleJoystickMove = (x, y) => {
    moveVector.current = { x, y };
  };

  return (
    <View style={styles.container}>
      {/* گیم کا گرڈ بیک گراؤنڈ جو پریمیم لک دے گا */}
      <View style={styles.gridOverlay} />

      {/* الائیو پلیئرز کی تعداد اور انٹرفیس */}
      <View style={styles.hudHeader}>
        <Text style={styles.hudText}>ALIVE: 50</Text>
        <Text style={styles.hudText}>PLAYER: {name}</Text>
      </View>

      {/* اصلی کھلاڑی کا گرافک ایلیمنٹ */}
      <View style={[styles.player, { left: playerPos.x - 15, top: playerPos.y - 15 }]}>
        <View style={styles.playerDirectionPointer} />
      </View>

      {/* جوائسٹک ان پٹ کنٹرولر */}
      <Joystick onMove={handleJoystickMove} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0f12',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
    borderWidth: 1,
    borderColor: '#ffffff',
    backgroundColor: 'transparent',
  },
  hudHeader: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  hudText: {
    color: '#ff3b30',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: 'System',
  },
  player: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007aff',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#007aff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerDirectionPointer: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 2,
  },
});
