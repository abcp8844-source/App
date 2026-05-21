import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import gameStateInstance from './src/core/GameStateManager';
import localCacheInstance from './src/network/LocalCacheEngine';
import marineAviationInstance from './src/core/MarineAviationFleetController';
import transitRailwayInstance from './src/core/TransitRailwayEngine';
import GameMainStageScreen from './src/ui/GameMainStageScreen';

export default function App() {
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [status, setStatus] = useState('Starting...');

  useEffect(() => {
    async function init() {
      try {
        setStatus('Syncing Cache...');
        await localCacheInstance.initializeCacheWorkspace();

        setStatus('Aviation Grid...');
        marineAviationInstance.initializeMarineAndAviationGrid();

        setStatus('Railway System...');
        transitRailwayInstance.computeTrainFrameTicks(1.0);

        setStatus('Master Engine...');
        await gameStateInstance.bootUpEngine({ id: 'royal_master_player' });

        setIsEngineReady(true);
      } catch (err) {
        console.error(err);
        setStatus('Engine Error: Restart Required');
      }
    }
    init();
  }, []);

  if (!isEngineReady) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>ROYAL TRANSIT</Text>
        <ActivityIndicator size="large" color="#00D2FF" />
        <Text style={styles.status}>{status}</Text>
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
 
