import {useState, useEffect, useRef} from 'react';
import {AppState} from 'react-native';

const useAppStateTimer = (sessionInProgress, remainingSeconds) => {
  const [backgroundTime, setBackgroundTime] = useState(0);
  const appState = useRef(AppState.currentState);
  const [adjustedRemainingSeconds, setAdjustedRemainingSeconds] =
    useState(remainingSeconds);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App returned to the foreground');

        if (sessionInProgress && remainingSeconds > 0) {
          const adjustedRemainingSeconds = remainingSeconds;
          setAdjustedRemainingSeconds(adjustedRemainingSeconds);
        }
      }

      if (nextAppState === 'background') {
        setBackgroundTime(Math.floor(Date.now() / 1000));
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [sessionInProgress, remainingSeconds, backgroundTime]);

  return adjustedRemainingSeconds;
};

export default useAppStateTimer;
