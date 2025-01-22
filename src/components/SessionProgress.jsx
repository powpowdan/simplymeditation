import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';

const SessionProgress = ({
  sessionInProgress,
  remainingSeconds,
  selectedDuration,
  onPress,
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const animationFrameRef = useRef(null);
  const initialProgressRef = useRef(0);
  const hasInitialized = useRef(false);

  const targetProgress = sessionInProgress
    ? (remainingSeconds / (selectedDuration * 60)) * 100
    : 0;

  useEffect(() => {
    // dont animate on app opening
    if (!hasInitialized.current) {
      setAnimatedProgress(targetProgress);
      hasInitialized.current = true;
      return;
    }

    // Smooth animation logic
    const duration = 1000; 
    const startTime = performance.now();
    initialProgressRef.current = animatedProgress;

    // Animation function
    const animate = (timestamp) => {
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / duration, 1);  // Ensure it doesn't exceed 1 (end of animation)
      const newProgress = initialProgressRef.current + (targetProgress - initialProgressRef.current) * t;
      setAnimatedProgress(newProgress);

      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    // Start the animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup animation frame on component unmount or update
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [targetProgress]);  // re-run animation when targetProgress changes

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
        percent={animatedProgress}
        radius={85}
        borderWidth={7}
        color={animatedProgress > 0 ? '#74aff7' : 'transparent'}
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
  },
  progressCircleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SessionProgress;
