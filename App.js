import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import gameStateInstance from './src/core/GameStateManager';
import ResourceLoader from './src/network/ResourceLoader';
import GameMainStageScreen from './src/ui/GameMainStageScreen';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [msg, setMsg] = useState('Starting...');

  useEffect(() => {
    async function init() {
      try {
        setMsg('Syncing Resources...');
        await ResourceLoader.syncResources();
        
        setMsg('Booting Engine...');
        await gameStateInstance.bootUpEngine('royal_master_player');
        
        setIsReady(true);
      } catch (err) {
        setMsg('Engine Error: Restart Required');
      }
    }
    init();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>ROYAL TRANSIT</Text>
        <ActivityIndicator size="large" color="#00D2FF" />
        <Text style={styles.status}>{msg}</Text>
      </View>
    );
  }

  return <GameMainStageScreen />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020B18', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  status: { color: '#8A99AD', marginTop: 10 }
});
