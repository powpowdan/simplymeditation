import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
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
    <View style={styles.progressCircleWrapper}>
    <ProgressCircle
      percent={progress}
      radius={85}
      borderWidth={7} 
      color={progress > 0 ? "#74aff7" : "transparent"}
      shadowColor="#1A1A1A" 
      bgColor="#212121">
      <TouchableOpacity onPress={onPress} style={styles.circleContent}>
        {sessionInProgress ? (
          <Text style={styles.countdown}>{formattedTime}</Text>
        ) : (
          <Text style={styles.duration}>{formattedTime}</Text>
        )}
      </TouchableOpacity>
    </ProgressCircle>
    </View>
  );
};

const styles = StyleSheet.create({
  circleContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,   
  },
  countdown: {
    fontSize: 29,
    color: '#ededed', 
  },
  duration: {
    fontSize: 29,
    color: '#ededed',
    // fontWeight: 'bold',
  },
  // progressCircleWrapper: {
  //   borderWidth: .2,  
  //   borderColor: '#74aff7',  
  //   borderRadius: 90, 
  //   padding: 0,  
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
});

export default SessionProgress;
