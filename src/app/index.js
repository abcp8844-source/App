import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function MainMenu() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');

  const handleStartGame = () => {
    if (playerName.trim() === '') return;
    router.push({
      pathname: '/game',
      params: { name: playerName }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>THE LAST SANCTUARY</Text>
      <Text style={styles.subtitle}>Survival • Strategy • Multiplayer</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Player Name"
        placeholderTextColor="#666"
        value={playerName}
        onChangeText={setPlayerName}
        maxLength={15}
      />

      <TouchableOpacity 
        style={[styles.button, !playerName.trim() && styles.buttonDisabled]} 
        onPress={handleStartGame}
        disabled={!playerName.trim()}
      >
        <Text style={styles.buttonText}>JOIN MATCH</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0a0a0a',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    letterSpacing: 4,
    marginBottom: 50,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#551511',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
