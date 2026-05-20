import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import gameStateInstance from '../core/GameStateManager';

const { width, height } = Dimensions.get('window');

export default function OnScreenControllerOverlay({ onInputDeltaChanged }) {
  const [playerVitals, setPlayerVitals] = useState({ health: 100, energy: 100, coins: 0 });
  const [currentDrivingMetrics, setCurrentDrivingMetrics] = useState({ isDriving: false, speedKmh: 0, gear: 1 });

  // 1. High-frequency state polling interface binding directly to the Game Loop
  useEffect(() => {
    const uiDataSyncInterval = setInterval(() => {
      const activeState = gameStateInstance.getAuthoritativeFrameBuffer();
      if (activeState && activeState.player) {
        setPlayerVitals({
          health: Math.ceil(activeState.player.vitals.health),
          energy: Math.ceil(activeState.player.vitals.stamina),
          coins: activeState.player.coins
        });

        const isUserInVehicle = activeState.player.currentVehicleId !== null;
        setCurrentDrivingMetrics({
          isDriving: isUserInVehicle,
          speedKmh: isUserInVehicle ? Math.floor(activeState.player.speed * 3.6) : 0, // Convert to KM/H
          gear: isUserInVehicle ? (Math.floor(activeState.player.speed / 15) + 1) : 1
        });
      }
    }, 100); // 10hz updates for UI dashboard rendering to eliminate display lag

    return () => clearInterval(uiDataSyncInterval);
  }, []);

  // 2. Transmit interaction vectors from mobile touch panes into the core engine
  const dispatchActionSignal = (actionKey, isActive) => {
    onInputDeltaChanged(actionKey, isActive);
  };

  return (
    <View style={styles.hudMasterCanvas} pointerEvents="box-none">
      
      {/* TOP STATUS BAR: HUD Vitals Profile */}
      <View style={styles.topHudHeader}>
        <View style={styles.vitalBarContainer}>
          <Text style={styles.hudLabelText}>HP {playerVitals.health}%</Text>
          <View style={[styles.vitalFill, { width: `${playerVitals.health}%`, backgroundColor: '#FF2A4B' }]} />
        </View>

        <View style={styles.vitalBarContainer}>
          <Text style={styles.hudLabelText}>STM {playerVitals.energy}%</Text>
          <View style={[styles.vitalFill, { width: `${playerVitals.energy}%`, backgroundColor: '#00FF66' }]} />
        </View>

        <View style={styles.cryptoWalletBox}>
          <Text style={styles.goldAmountText}>RC ${playerVitals.coins.toLocaleString()}</Text>
        </View>
      </View>

      {/* CENTER RIGHT: Contextual Speedometer or Weapon Slots */}
      {currentDrivingMetrics.isDriving && (
        <View style={styles.speedometerCluster}>
          <Text style={styles.speedValue}>{currentDrivingMetrics.speedKmh}</Text>
          <Text style={styles.speedUnitText}>KM/H</Text>
          <Text style={styles.gearText}>GEAR {currentDrivingMetrics.gear}</Text>
        </View>
      )}

      {/* BOTTOM ACTION BUTTONS CONTROLLER GRID */}
      <View style={styles.bottomControlsRack}>
        {/* Left Side: Virtual Joystick Capture Pad Area */}
        <View style={styles.joystickPlaceholderContainer}>
          <Text style={styles.hudSecondaryText}>SWIPE TO STEER & RUN</Text>
        </View>

        {/* Right Side: High-End Contextual Action Triggers */}
        <View style={styles.actionButtonsCluster}>
          {!currentDrivingMetrics.isDriving ? (
            <>
              {/* Pedestrian Mechanics Controls */}
              <TouchableOpacity 
                onTouchStart={() => dispatchActionSignal('runPressed', true)}
                onTouchEnd={() => dispatchActionSignal('runPressed', false)}
                style={styles.tacticalRoundButton}>
                <Text style={styles.btnText}>SPRINT</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => dispatchActionSignal('interactTriggered', true)}
                style={[styles.tacticalRoundButton, { backgroundColor: '#FF8C00' }]}>
                <Text style={styles.btnText}>JACK BIKE</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* High-Fi Advanced Driving Mechanics Physics Pedals */}
              <TouchableOpacity 
                onTouchStart={() => dispatchActionSignal('throttlePressed', true)}
                onTouchEnd={() => dispatchActionSignal('throttlePressed', false)}
                style={[styles.tacticalRoundButton, { backgroundColor: '#00FF66' }]}>
                <Text style={styles.btnText}>GAS</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onTouchStart={() => dispatchActionSignal('driftPressed', true)}
                onTouchEnd={() => dispatchActionSignal('driftPressed', false)}
                style={[styles.tacticalRoundButton, { backgroundColor: '#FF00FF' }]}>
                <Text style={styles.btnText}>DRIFT</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => dispatchActionSignal('exitVehicle', true)}
                style={[styles.tacticalRoundButton, { backgroundColor: '#E11111' }]}>
                <Text style={styles.btnText}>EXIT</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  hudMasterCanvas: { position: 'absolute', width: width, height: height, top: 0, left: 0, justifyContent: 'space-between', padding: 20 },
  topHudHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 },
  vitalBarContainer: { width: width * 0.25, height: 22, backgroundColor: 'rgba(5, 15, 30, 0.75)', borderRadius: 4, borderWidth: 1, borderColor: '#1A2F4C', overflow: 'hidden', paddingLeft: 6, justifyContent: 'center' },
  vitalFill: { position: 'absolute', height: '100%', top: 0, left: 0, zIndex: -1 },
  hudLabelText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', fontFamily: 'monospace' },
  cryptoWalletBox: { backgroundColor: 'rgba(218, 165, 32, 0.2)', borderWidth: 1, borderColor: '#DAA520', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 },
  goldAmountText: { color: '#FFD700', fontWeight: 'bold', fontSize: 14, fontFamily: 'monospace' },
  speedometerCluster: { alignSelf: 'flex-end', marginRight: 20, backgroundColor: 'rgba(2, 11, 24, 0.8)', padding: 15, borderRadius: 50, width: 90, height: 90, borderWidth: 2, borderColor: '#00FF66', justifyContent: 'center', alignItems: 'center' },
  speedValue: { color: '#FFF', fontSize: 28
