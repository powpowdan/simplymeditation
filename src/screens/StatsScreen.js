import React from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import {useSessionContext} from '../context/SessionContext';

function StatsScreen() {
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

  const calculateAverageDuration = () =>
    sessionCount ? totalTimeMeditated / sessionCount : 0;

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
    // justifyContent: 'center',
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
    marginTop: 40,
  },
});

export default StatsScreen;
