import React, { useEffect } from 'react';
import { View, Text, Switch, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useSessionContext } from '../SessionContext'; 
import { useMusicSwitchContext } from '../MusicSwitchContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

function OptionsScreen({ navigation }) {
  const {
    musicSwitchState,
    setMusicSwitchState,
    intervalBellsSwitchState,
    setIntervalBellsSwitchState,
    interval25Active,
    toggleInterval25,
    interval50Active,
    toggleInterval50,
    interval75Active,
    toggleInterval75,
    interval90Active,
    toggleInterval90,
    adjustmentSwitchState,
    toggleAdjustmentSwitch,
    adjustmentValue,
    setAdjustmentValue,
  } = useMusicSwitchContext();

  const {
    totalTimeMeditated,
    sessionCount,
    resetStatistics,
    resetShortestStatistics,
    longestTimeMeditated,
    shortestTimeMeditated,
  } = useSessionContext();

  // Utility function for formatting time
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.round(timeInSeconds % 60);

    return [
      hours && `${hours} ${hours === 1 ? 'hour' : 'hours'}`,
      minutes && `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`,
      seconds && `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`,
    ]
      .filter(Boolean)
      .join(' and ') || '0 seconds';
  };

  // Utility function to load and save switch states
  const loadState = async (key, setter) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) setter(JSON.parse(value));
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
    }
  };

  const saveState = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      console.log(`${key} saved`);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  const handleGoToHome = () => {
    navigation.navigate('MeditationTimer');
  };

  const handleResetStatistics = () => {
    Alert.alert('Confirm Reset', 'Are you sure you want to reset all statistics?', [
      { text: 'Do not reset', style: 'cancel' },
      { text: 'Reset Shortest Only', onPress: resetShortestStatistics },
      { text: 'RESET ALL', onPress: resetStatistics, style: 'destructive' },
    ]);
  };

  const calculateAverageDuration = () => sessionCount ? totalTimeMeditated / sessionCount : 0;

  // Load initial states
  useEffect(() => {
    loadState('musicSwitchState', setMusicSwitchState);
    loadState('intervalBellsSwitchState', setIntervalBellsSwitchState);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Statistics</Text>
      <Text style={styles.statText}>Total Time Meditated: {formatTime(totalTimeMeditated)}</Text>
      <Text style={styles.statText}>Total Sessions: {sessionCount}</Text>
      <Text style={styles.statText}>Average Session Duration: {formatTime(calculateAverageDuration())}</Text>
      <Text style={styles.statText}>Longest Meditation Session: {formatTime(longestTimeMeditated)}</Text>
      <Text style={styles.statText}>Shortest Meditation Session: {formatTime(shortestTimeMeditated)}</Text>

      <Text style={styles.headerText}>Options</Text>
      <TouchableOpacity>
        <Text style={styles.options}>Monk chanting</Text>
      </TouchableOpacity>
      <Switch value={musicSwitchState} onValueChange={(value) => { setMusicSwitchState(value); saveState('musicSwitchState', value); }} />

      <Text style={styles.options}>Randomize timer</Text>
      <Switch value={adjustmentSwitchState} onValueChange={toggleAdjustmentSwitch} />

      <Text style={styles.bellOptions}>Interval Bells</Text>
      <Switch value={intervalBellsSwitchState} onValueChange={(value) => { setIntervalBellsSwitchState(value); saveState('intervalBellsSwitchState', value); }} />

      {intervalBellsSwitchState && (
        <View style={styles.bellContainer}>
          <View style={styles.rowContainer}>
            {[
              { value: interval75Active, label: '25% of session', toggle: toggleInterval75 },
              { value: interval50Active, label: '50% of session', toggle: toggleInterval50 },
            ].map(({ value, label, toggle }) => (
              <View style={styles.bellOption} key={label}>
                <Switch value={value} onValueChange={(newValue) => { toggle(newValue); saveState(`${label}State`, newValue); }} />
                <Text style={styles.switchText}>{label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.rowContainer}>
            {[
              { value: interval25Active, label: '75% of session', toggle: toggleInterval25 },
              { value: interval90Active, label: '90% of session', toggle: toggleInterval90 },
            ].map(({ value, label, toggle }) => (
              <View style={styles.bellOption} key={label}>
                <Switch value={value} onValueChange={(newValue) => { toggle(newValue); saveState(`${label}State`, newValue); }} />
                <Text style={styles.switchText}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.resetButtonContainer}>
        <Button title="Reset Statistics" onPress={handleResetStatistics} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121',
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    color: '#74aff7',
    paddingTop: 50,
    paddingBottom: 10,
    textAlign: 'center',
  },
  statText: {
    marginTop: 10,
  },
  options: {
    paddingTop: 20,
    marginBottom: 10,
  },
  bellOptions: {
    paddingTop: 20,
    marginBottom: 10,
  },
  bellContainer: {
    marginTop: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bellOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    color: '#ffffff',
    marginLeft: 10,
  },
  resetButtonContainer: {
    marginTop: 20,
  },
});

export default OptionsScreen; 
