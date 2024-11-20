import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import ProgressCircle from 'react-native-progress-circle';

const SessionProgress = ({
  sessionInProgress,
  remainingSeconds,
  selectedDuration,
  onPress,
}) => {
  const progress = sessionInProgress
    ? (remainingSeconds / (selectedDuration * 60)) * 100
    : 0;

  const formattedTime = sessionInProgress
    ? `${Math.floor(remainingSeconds / 60)
        .toString()
        .padStart(2, '0')}:${(remainingSeconds % 60)
        .toString()
        .padStart(2, '0')}`
    : `${selectedDuration.toString().padStart(2, '0')}:00`;

  return (
    <ProgressCircle
      percent={progress}
      radius={80}
      borderWidth={10}
      color="#74aff7"
      shadowColor="#101010"
      bgColor="#212121">
      <TouchableOpacity onPress={onPress} style={styles.circleContent}>
        {sessionInProgress ? (
          <Text style={styles.countdown}>{formattedTime}</Text>
        ) : (
          <Text style={styles.duration}>{formattedTime}</Text>
        )}
      </TouchableOpacity>
    </ProgressCircle>
  );
};

const styles = StyleSheet.create({
  circleContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  countdown: {
    fontSize: 20,
    color: '#ededed',
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 29,
    color: '#ededed',
    fontWeight: 'bold',
  },
});

export default SessionProgress;
