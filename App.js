import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import gameStateInstance from './src/core/GameStateManager';
import localCacheInstance from './src/network/LocalCacheEngine';
import marineAviationInstance from './src/core/MarineAviationFleetController';
import transitRailwayInstance from './src/core/TransitRailwayEngine';
import GameMainStageScreen from './src/ui/GameMainStageScreen';

/**
 * PROJECT OFfICIAL APP ENTRY: ROYAL TRANSIT: HORIZON
 * Target Store Core Keywords Optimized: Open World, Transit Simulator, Action Drive, Survival Battle Grid
 */
export default function App() {
  const [isEngineFullyBaked, setIsEngineFullyBaked] = useState(false);
  const [loadingStatusText, setLoadingStatusText] = useState('Initializing Royal Engine...');

  useEffect(() => {
    async function bootUpRoyalTransitUniverse() {
      try {
        // 1. Wake up the Mobile Local Storage Secure Cache Engine
        setLoadingStatusText('Syncing Local Secure Cache Runtime...');
        await localCacheInstance.initializeCacheWorkspace();

        // 2. Initialize Marine & Aviation Fleet Clusters (Airports, Helipads, Cargo Ships, Sharks)
        setLoadingStatusText('Constructing Dubai & Valley Aviation Hubs...');
        marineAviationInstance.initializeMarineAndAviationGrid();

        // 3. Spool up the Dual Transit Railway Networks (Steam Locomotive & Elevated Metro)
        setLoadingStatusText('Laying Overhead Metro Tracks & Cross-Country Splines...');
        // Pre-heating the transit framework vectors
        transitRailwayInstance.computeTrainFrameTicks(1.0);

        // 4. Fire up the Master Authoritative Game State Engine Core Loop
        setLoadingStatusText('Booting Up 60FPS Game Loop Logic...');
        gameStateInstance.bootUpEngine({ id: 'royal_master_player' });

        // Everything is verified and 100% loaded without exceptions
        setIsEngineFullyBaked(true);
      } catch (error) {
        console.error('[RoyalEngine Crash] Failed to securely boot app core components:', error);
        setLoadingStatusText('Critical Engine Boot Error. Please Restart.');
      }
    }

    bootUpRoyalTransitUniverse();
  }, []);

  // Show a premium cinematic dark loading dashboard before rendering 3D viewports
  if (!isEngineFullyBaked) {
    return (
      <View style={styles.loadingSplasherScreen}>
        <View style={styles.brandingCluster}>
          <Text style={styles.titleGrandText}>ROYAL TRANSIT</Text>
          <Text style={styles.subtitleSubText}>H O R I Z O N</Text>
        </View>
        
        <ActivityIndicator size="large" color="#00D2FF" style={styles.spinnerIcon} />
        <Text style={styles.statusLiveText}>{loadingStatusText}</Text>
        
        <Text style={styles.footerKeywordsTag}>
          OpenWorld • Trains • Aviation • Action Simulator
        </Text>
      </View>
    );
  }

  // Once baked, mount the master 3D graphic overlay stage seamlessly
  return <GameMainStageScreen />;
}

const styles = StyleSheet.create({
  loadingSplasherScreen: {
    flex: 1,
    backgroundColor: '#020B18', // Matches our luxury neon deep-space theme
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  brandingCluster: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleGrandText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 2,
    fontFamily: 'monospace',
    textShadowColor: 'rgba(0, 210, 255, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  subtitleSubText: {
    color: '#00D2FF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 8,
    marginTop: 5,
  },
  spinnerIcon: {
    marginBottom: 20,
  },
  statusLiveText: {
    color: '#8A99AD',
    fontSize: 12,
    fontFamily: 'sans-serif-light',
    textAlign: 'center',
  },
  footerKeywordsTag: {
    position: 'absolute',
    bottom: 30,
    color: '#223854',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
