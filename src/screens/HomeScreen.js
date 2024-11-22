import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  AppState,
  TouchableOpacity, 
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import Sound from 'react-native-sound';
import BackgroundTimer from 'react-native-background-timer'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMusicSwitchContext} from '../MusicSwitchContext';
import {useSessionContext} from '../SessionContext';
import {useNavigation} from '@react-navigation/native';
import Quotes from '../components/Quotes';
import DurationSelector from '../components/DurationSelector';
import SessionProgress from '../components/SessionProgress';
import Logo from '../components/Logo';

function HomeScreen() {
  const navigation = useNavigation();
  const [sessionInProgress, setSessionInProgress] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(15);
  const {addMeditationTime, incrementSessionCount} = useSessionContext();
  const [sound, setSound] = useState(null);
  const {
    musicSwitchState,
    setMusicSwitchState,
    intervalBellsSwitchState,
    setIntervalBellsSwitchState,
    interval25Active,
    interval50Active,
    interval75Active,
    interval90Active,
    toggleAdjustmentSwitch,
    adjustmentSwitchState,
    adjustmentValue,
  } = useMusicSwitchContext();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const appState = useRef(AppState.currentState);
  const timerRef = useRef();
  const [sliderDisabled, setSliderDisabled] = useState(false);
  const soundRef = useRef(null);
  const [randomizedDuration, setRandomizedDuration] = useState(0);
  const [totalMeditationTime, setTotalMeditationTime] = useState(0);
  const [adjustedSessionDuration, setAdjustedSessionDuration] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Initialize buttonSelectedDuration default
  const [buttonSelectedDuration, setButtonSelectedDuration] = useState({
    button5Mins: 5,
    button10Mins: 10,
    button15Mins: 15,
    button20Mins: 20,
  });

  useEffect(() => {
    const loadMusicSwitchState = async () => {
      try {
        const value = await AsyncStorage.getItem('musicSwitchState');
        if (value !== null) {
          setMusicSwitchState(JSON.parse(value));
        }
      } catch (error) {
        console.error('Error loading musicSwitchState:', error);
      }
    };

    loadMusicSwitchState();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Retrieve the saved selected durations from AsyncStorage
    const retrieveSelectedDurations = async () => {
      try {
        const storedDurations = await AsyncStorage.getItem('selectedDurations');
        if (storedDurations) {
          const parsedDurations = JSON.parse(storedDurations);
          setButtonSelectedDuration(parsedDurations);
        } else {
          // Apply initial values if no stored durations are found
          setButtonSelectedDuration({
            button5Mins: 5,
            button10Mins: 10,
            button15Mins: 15,
            button20Mins: 20,
          });
        }
      } catch (error) {
        console.error('Error retrieving selected durations:', error);
      }
    };

    retrieveSelectedDurations();

    return () => {
      subscription.remove('change', handleAppStateChange);
      BackgroundTimer.stopBackgroundTimer();
    };
  }, []);

  // Save the selected durations to AsyncStorage whenever they change
  useEffect(() => {
    try {
      AsyncStorage.setItem(
        'selectedDurations',
        JSON.stringify(buttonSelectedDuration),
      );
    } catch (error) {
      console.error('Error saving selected durations:', error);
    }
  }, [buttonSelectedDuration]);

  useEffect(() => {
    const randomAdjustment = adjustmentSwitchState
      ? (Math.random() * 0.5 - 0.3) * selectedDuration
      : 0;
    const newRandomizedDuration = selectedDuration + randomAdjustment;
    setRandomizedDuration(newRandomizedDuration);
  }, [selectedDuration, adjustmentSwitchState]);

  const handleAppStateChange = nextAppState => {
    if (
      appState.current.match(/active/) &&
      nextAppState === 'active' &&
      sessionInProgress &&
      remainingSeconds > 0
    ) {
      // App is back to foreground, and the session is in progress with remaining time
      startTimer(remainingSeconds);
    }

    appState.current = nextAppState;
  };

  const playTone = () => {
    const sound = new Sound('audio_file.mp3', null, error => {
      if (error) {
        alert('Error', JSON.stringify(error));
      }
      sound.play(() => sound.release());
    });
  };

  const playIntervalBell = percentage => {
    const sound = new Sound('intervalbell.mp3', null, error => {
      if (error) {
        alert(`Interval bell ${percentage}% ALERT`, JSON.stringify(error));
      }
      sound.play(() => sound.release());
    });
  };

  const startTimer = totalSeconds => {
    setRemainingSeconds(totalSeconds);

    timerRef.current = BackgroundTimer.setInterval(() => {
      setRemainingSeconds(prevRemainingSeconds => {
        const seconds = prevRemainingSeconds - 1;
        const interval25 = Math.floor(totalSeconds * 0.25);
        const interval50 = Math.floor(totalSeconds * 0.5);
        const interval75 = Math.floor(totalSeconds * 0.75);
        const interval90 = Math.floor(totalSeconds * 0.1);

        if (
          intervalBellsSwitchState &&
          interval25Active &&
          seconds === interval25
        ) {
          playIntervalBell(25);
        } else if (
          intervalBellsSwitchState &&
          interval50Active &&
          seconds === interval50
        ) {
          playIntervalBell(50);
        } else if (
          intervalBellsSwitchState &&
          interval75Active &&
          seconds === interval75
        ) {
          playIntervalBell(75);
        } else if (
          intervalBellsSwitchState &&
          interval90Active &&
          seconds === interval90
        ) {
          playIntervalBell(90);
        }

        if (seconds === 0) {
          handleTimerEnd(totalSeconds);
          playTone();
          BackgroundTimer.clearInterval(timerRef.current);
          stopMusic();
        }
        return seconds;
      });
    }, 1000); //debug time here
  };

  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, [sound]);

  const stopSession = () => {
    console.log('stop session by user');
    setSliderDisabled(false);
    if (timerRef.current) {
      BackgroundTimer.clearInterval(timerRef.current);
    }
    stopMusic();
    setSessionInProgress(false);
  };

  const handleTimerEnd = totalSeconds => {
    console.log('handletimerend totalsecondsPASSED:', totalSeconds);
    const sessionDuration = totalSeconds / 60;
    console.log('Session Duration:handleTimerEnd  ===', sessionDuration);

    addMeditationTime(sessionDuration);
    setTotalMeditationTime(prevTotal => prevTotal + totalSeconds);
    resetTimer();
    setSliderDisabled(false);
    incrementSessionCount();
    setSessionCompleted(true);
    setSessionInProgress(false);
  };

  // Function to calculate randomized duration
  const calculateRandomizedDuration = () => {
    const randomAdjustment = adjustmentSwitchState
      ? (Math.random() * 0.5 - 0.3) * selectedDuration
      : 0;
    return selectedDuration + randomAdjustment;
  };

  const stopMusic = () => {
    const currentSound = soundRef.current;
    if (currentSound) {
      currentSound.stop();
      currentSound.release();
      soundRef.current = null;
      setIsMusicPlaying(false);
      console.log('stopMusicFunction ran');
    }
  };

  const resetTimer = () => {
    console.log('resetTimer');
    setSessionInProgress(false);
    setRemainingSeconds(0);
    stopMusic();
  };

  const handleTimerChange = value => {
    if (!sessionInProgress) {
      setSelectedDuration(value);
    }
  };

  const handleButtonLongPress = buttonKey => {
    Alert.alert(
      'Confirmation:',
      `Are you sure you want to set this button's duration to ${selectedDuration} minutes?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: async () => {
            await AsyncStorage.setItem(buttonKey, selectedDuration.toString());
            setButtonSelectedDuration(prev => ({
              ...prev,
              [buttonKey]: selectedDuration,
            }));
          },
        },
      ],
      {cancelable: false},
    );
  };

  const beginSession = () => {
    const randomizedDuration = calculateRandomizedDuration();
    console.log('randomizedduration in begin session: ', randomizedDuration);

    const totalSeconds = Math.round(randomizedDuration * 60);
    const initialMinutes = Math.floor(totalSeconds / 60);
    const initialSeconds = totalSeconds % 60;

    console.log(
      `Beginning countdown for ${initialMinutes} minutes and ${initialSeconds} seconds`,
    );
    playTone();
    resetTimer();
    setSessionInProgress(true);
    setSliderDisabled(true);
    if (musicSwitchState) {
      playMusic();
      setIsMusicPlaying(true);
    }
    console.log('beginSession total seconds: ', totalSeconds);
    startTimer(totalSeconds);
  };

  const playMusic = () => {
    if (musicSwitchState) {
      const newSound = new Sound('now.mp3', null, error => {
        if (error) {
          console.error('Error:', error);
        } else {
          newSound.play(() => {
            newSound.release();
          });
          soundRef.current = newSound;
        }
      });
    }
  };
 
  return (
    <View style={styles.container}>
      <Logo
        sliderDisabled={sessionInProgress}
        onPress={() => navigation.navigate('Options')} 
        headerText="Simply Meditation"
      />

      <Quotes />

      <SessionProgress
        sessionInProgress={sessionInProgress}
        remainingSeconds={remainingSeconds}
        selectedDuration={selectedDuration}
        onPress={sessionInProgress ? stopSession : beginSession}
      />

      <DurationSelector
        selectedDuration={selectedDuration}
        handleTimerChange={handleTimerChange}
        handleButtonLongPress={handleButtonLongPress}
        buttonSelectedDuration={buttonSelectedDuration}
        sliderDisabled={sliderDisabled}
        styles={styles}
      />
      <View style={styles.beginEndContainer}>
        {!sessionInProgress ? (
          <TouchableOpacity
            style={[styles.button, styles.beginButton]}
            onPress={beginSession}>
            <Text style={styles.colorBlack}>Begin Session</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.stopButton]}
            onPress={stopSession}>
            <Text style={styles.colorBlack2}>Stop Session</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#212121',
  },
  button: {
    margin: 10,
    padding: 10,
    width: '76%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35,
  },
  beginButton: {
    backgroundColor: '#74aff7',
    marginTop: 55,
  },
  stopButton: {
    backgroundColor: '#A7C8E7', 
    marginTop: 35,
  },
  colorBlack: {
    textAlign: 'center',
    color: '#1A1F26', 
    fontSize: 18,
  },
  colorBlack2: {
    textAlign: 'center',
    color: '#1A1F26',
    fontSize: 18,
  },
  bold: {
    fontWeight: 'bold',
  },
  beginEndContainer: {
    paddingBottom: 0,
    bottom: 0,
    width: '80%',
    alignItems: 'center',
  },
});

export default HomeScreen;
