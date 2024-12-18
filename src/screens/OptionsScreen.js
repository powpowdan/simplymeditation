import React from 'react';
import {
  View,
  Text,
  Switch,
  Button,
  Alert, 
  StyleSheet,
} from 'react-native';
import {useSessionContext} from '../context/SessionContext';
import {useMusicSwitchContext} from '../context/MusicSwitchContext';
import ChimeSelector from '../components/ChimeSelector';
import IntervalBellSelector from '../components/IntervalBellSelector';
import BackgroundMusicSelector from '../components/BackgroundMusicSelector';
 

function OptionsScreen({navigation}) {
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
  const formatTime = timeInSeconds => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.round(timeInSeconds % 60);

    return (
      [
        hours && `${hours} ${hours === 1 ? 'hour' : 'hours'}`,
        minutes && `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`,
        seconds && `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`,
      ]
        .filter(Boolean)
        .join(' and ') || '0 seconds'
    );
  };

  const handleResetStatistics = () => {
    Alert.alert(
      'Confirm Reset',
      'Are you sure you want to reset all statistics?',
      [
        {text: 'Do not reset', style: 'cancel'},
        {text: 'Reset Shortest Only', onPress: resetShortestStatistics},
        {text: 'RESET ALL', onPress: resetStatistics, style: 'destructive'},
      ],
    );
  };

  const calculateAverageDuration = () =>
    sessionCount ? totalTimeMeditated / sessionCount : 0;

  return (
    <View style={styles.container}>
      {/* Statistics Section */}
      <Text style={styles.headerText}>Statistics</Text>
      <Text style={styles.statText}>
        Total Time Meditated: {formatTime(totalTimeMeditated)}
      </Text>
      <Text style={styles.statText}>Total Sessions: {sessionCount}</Text>
      <Text style={styles.statText}>
        Average Session Duration: {formatTime(calculateAverageDuration())}
      </Text>
      <Text style={styles.statText}>
        Longest Meditation Session: {formatTime(longestTimeMeditated)}
      </Text>
      <Text style={styles.statText}>
        Shortest Meditation Session: {formatTime(shortestTimeMeditated)}
      </Text>

      {/* Options Section */}
      <Text style={styles.headerText}>Options</Text>

      <View style={styles.optionContainer}>
        <ChimeSelector/> 
      </View>

      <View>
        <Text style={styles.options}>Meditation Music</Text>
        <Switch value={musicSwitchState} onValueChange={setMusicSwitchState} /> 
        {musicSwitchState && (
        <BackgroundMusicSelector/>
        )}
      </View>
      
      <View>
        <Text style={styles.options}>Randomize timer</Text>
        <Switch
          value={adjustmentSwitchState}
          onValueChange={toggleAdjustmentSwitch}
        />
      </View>

      <View>
        <Text style={styles.bellOptions}>Interval Bells</Text>
        <Switch
          value={intervalBellsSwitchState}
          onValueChange={setIntervalBellsSwitchState}
        />
      </View> 
      {/* if true show the bell switches */}
      {intervalBellsSwitchState && (
        <View style={styles.bellContainer}> 
          <View style={styles.rowContainer}>
            {[
              {
                active: interval25Active,
                label: '25% of session',
                toggle: toggleInterval25,
              },
              {
                active: interval50Active,
                label: '50% of session',
                toggle: toggleInterval50,
              },
            ].map(({active, label, toggle}) => (
              <View style={styles.bellOption} key={label}>
                <Switch value={active} onValueChange={toggle} />
                <Text style={styles.switchText}>{label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.rowContainer}>
            {[
              {
                active: interval75Active,
                label: '75% of session',
                toggle: toggleInterval75,
              },
              {
                active: interval90Active,
                label: '90% of session',
                toggle: toggleInterval90,
              },
            ].map(({active, label, toggle}) => (
              <View style={styles.bellOption} key={label}>
                <Switch value={active} onValueChange={toggle} />
                <Text style={styles.switchText}>{label}</Text>
              </View>
            ))} 
          </View>
          <IntervalBellSelector/>
        </View>
      )}

      {/* Reset Statistics Button */}
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
    fontSize: 15, 
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
