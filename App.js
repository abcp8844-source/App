import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import GameView from './src/ui/GameView';
import OnScreenControllerOverlay from './src/ui/OnScreenControllerOverlay';
import PlayerProfile from './src/ui/PlayerProfile';
import MissionDisplay from './src/ui/MissionDisplay';

export default function App() {
  return (
    <View style={styles.container}>
      <GameView />
      <OnScreenControllerOverlay />
      <PlayerProfile />
      <MissionDisplay />
      <StatusBar hidden />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
