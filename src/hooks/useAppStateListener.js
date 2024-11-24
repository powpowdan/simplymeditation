import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

const useAppStateListener = ({
  onForegroundResume,
  onBackgroundPause,
}) => {
  const appState = useRef(AppState.currentState);
  const backgroundTimeRef = useRef(null); // Track the time the app goes to the background

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      const now = Date.now();

      // Handle transition to the foreground
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        onForegroundResume
      ) {
        if (backgroundTimeRef.current) {
          const elapsedTime = Math.floor((now - backgroundTimeRef.current) / 1000); // Time elapsed in seconds
          onForegroundResume(elapsedTime);
        }
      }

      // Handle transition to the background
      if (nextAppState.match(/inactive|background/)) {
        backgroundTimeRef.current = now;
        if (onBackgroundPause) {
          onBackgroundPause();
        }
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [onForegroundResume, onBackgroundPause]);
};

export default useAppStateListener;
