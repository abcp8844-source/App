import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function HUDController({ health, aliveCount, inventory, dayPhase }) {
  // Dynamic color for health bar based on safety percentage
  const getHealthColor = () => {
    if (health > 50) return '#4cd964'; // Green
    if (health > 20) return '#ffcc00'; // Yellow
    return '#ff3b30'; // Red
  };

  return (
    <View style={styles.hudContainer} pointerEvents="none">
      {/* Top Bar: Match Stats & Environment State */}
      <View style={styles.topBar}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>ALIVE</Text>
          <Text style={styles.statValue}>{aliveCount}</Text>
        </View>

        <View style={[styles.phaseBox, dayPhase === 'NIGHT' ? styles.nightBg : styles.dayBg]}>
          <Text style={styles.phaseText}>{dayPhase}</Text>
        </View>
      </View>

      {/* Bottom Interface: Health Bar & Resources Inventory */}
      <View style={styles.bottomBar}>
        {/* Health System Render */}
        <View style={styles.healthWrapper}>
          <Text style={styles.hudLabel}>HP</Text>
          <View style={styles.healthBarOuter}>
            <View 
              style={[
                styles.healthBarInner, 
                { width: `${health}%`, backgroundColor: getHealthColor() }
              ]} 
            />
          </View>
        </View>

        {/* Resources Inventory Stock */}
        <View style={styles.inventoryWrapper}>
          <View style={styles.resourceItem}>
            <Text style={styles.resIcon}>🪵</Text>
            <Text style={styles.resText}>{inventory.wood}</Text>
          </View>
          <View style={styles.resourceItem}>
            <Text style={styles.resIcon}>🪨</Text>
            <Text style={styles.resText}>{inventory.stone}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hudContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 20,
    zIndex: 100,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  statBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  statLabel: {
    color: '#ff3b30',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  phaseBox: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  dayBg: {
    backgroundColor: 'rgba(230, 140, 10, 0.3)',
    borderColor: '#ffcc00',
  },
  nightBg: {
    backgroundColor: 'rgba(10, 30, 90, 0.4)',
    borderColor: '#007aff',
  },
  phaseText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  healthWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderRadius: 6,
    width: width * 0.4,
  },
  hudLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 8,
  },
  healthBarOuter: {
    flex: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  healthBarInner: {
    height: '100%',
    borderRadius: 6,
  },
  inventoryWrapper: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  resIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  resText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
