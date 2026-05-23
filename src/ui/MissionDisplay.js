import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import gameStateInstance from '../core/GameStateManager';

const MissionDisplay = () => {
  const [activeMission, setActiveMission] = useState(null);

  useEffect(() => {
    const handleStateUpdate = (newState) => {
      if (newState.activeMissionId) {
        const mission = newState.worldMissions.find(m => m.id === newState.activeMissionId);
        setActiveMission(mission);
      } else {
        setActiveMission(null);
      }
    };

    gameStateInstance.subscribe(handleStateUpdate);

    return () => {
      // Cleanup subscription if component unmounts
      // (Simplified implementation)
    };
  }, []);

  if (!activeMission) {
    return null; // Don't render anything if no mission is active
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{activeMission.title}</Text>
      {activeMission.objectives.map((obj, index) => (
        <Text 
          key={index} 
          style={[
            styles.objective,
            obj.status === 'COMPLETE' ? styles.completed : {}
          ]}>
          {`- ${obj.description}`}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
    width: 250,
  },
  title: {
    color: '#FFD700', // Gold color for title
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
  },
  objective: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#888', // Grey out completed objectives
  },
});

export default MissionDisplay;
