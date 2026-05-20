import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import saveInstance from '../network/saveSystem';

const { width, height } = Dimensions.get('window');

export default function UIManager({ matchStatus, playerScore, playerId, onRestart }) {
  const router = useRouter();

  if (matchStatus === 'PLAYING') return null; // Game is active, hide overlay

  // Automatically trigger cloud save when match ends
  const handleMatchEndSave = async () => {
    const rewardData = {
      xp: matchStatus === 'VICTORY' ? 500 : 100,
      coins: playerScore * 10
    };
    await saveInstance.syncMatchResultToServer(playerId, rewardData);
    await saveInstance.cachePlayerDataLocally({ uid: playerId, ...rewardData });
  };

  React.useEffect(() => {
    if (matchStatus === 'VICTORY' || matchStatus === 'GAME_OVER') {
      handleMatchEndSave();
    }
  }, [matchStatus]);

  return (
    <View style={styles.overlayContainer}>
      <View style={[styles.modalBox, matchStatus === 'VICTORY' ? styles.victoryBorder : styles.gameOverBorder]}>
        
        <Text style={[styles.statusTitle, matchStatus === 'VICTORY' ? styles.victoryText : styles.gameOverText]}>
          {matchStatus === 'VICTORY' ? 'VICTORY ROYALE' : 'DEFEATED'}
        </Text>

        <Text style={styles.summaryLabel}>MATCH SUMMARY</Text>
        
        <View style={styles.scoreRow}>
          <Text style={styles.scoreTitle}>Score:</Text>
          <Text style={styles.scoreValue}>{playerScore} Points</Text>
        </View>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreTitle}>Gold Earned:</Text>
          <Text style={styles.scoreValue}>+{playerScore * 10} 🪙</Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.primaryButton} onPress={onRestart}>
          <Text style={styles.buttonText}>PLAY AGAIN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace('/')}>
          <Text style={styles.secondaryButtonText}>MAIN MENU</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 5, 5, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  modalBox: {
    width: width * 0.8,
    backgroundColor: '#0d0f12',
    borderWidth: 2,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  victoryBorder: { borderColor: '#ffcc00' },
  gameOverBorder: { borderColor: '#ff3b30' },
  statusTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 20,
    textAlign: 'center',
  },
  victoryText: {
    color: '#ffcc00',
    textShadowColor: 'rgba(255, 204, 0, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  gameOverText: {
    color: '#ff3b30',
    textShadowColor: 'rgba(255, 59, 48, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  summaryLabel: {
    color: '#666',
    fontSize: 12,
    letterSpacing: 3,
    marginBottom: 15,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    paddingBottom: 5,
  },
  scoreTitle: { color: '#aaa', fontSize: 16 },
  scoreValue: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  primaryButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 30,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  secondaryButton: {
    width: '100%',
    height: 48,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
    marginTop: 10,
  },
  secondaryButtonText: { color: '#aaa', fontSize: 14, fontWeight: 'bold' },
});
