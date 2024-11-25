import React, {useState, useEffect, useRef} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Alert} from 'react-native';
import Sound from 'react-native-sound';
import BackgroundTimer from 'react-native-background-timer';
import {useMusicSwitchContext} from '../MusicSwitchContext';
import {useSessionContext} from '../SessionContext';
import {useNavigation} from '@react-navigation/native';
import Quotes from '../components/Quotes';
import DurationSelector from '../components/DurationSelector';
import SessionProgress from '../components/SessionProgress';
import Logo from '../components/Logo';
import useAppStateListener from '../hooks/useAppStateListener';
import useMusic from '../hooks/useMusic';

function HomeScreen() {
  // State Declarations
  const [sessionInProgress, setSessionInProgress] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(15);
  const {addMeditationTime, incrementSessionCount} = useSessionContext();

  const {
    musicSwitchState, 
    intervalBellsSwitchState, 
    interval25Active,
    interval50Active,
    interval75Active,
    interval90Active, 
    adjustmentSwitchState, 
  } = useMusicSwitchContext();

  const {buttonDurations, setButtonSelectedDuration} = useSessionContext();

  // Refs
  const timerRef = useRef();

  // Derived States, nothing set by users but from state changes
  const {playMusic, stopMusic, isMusicPlaying} = useMusic(); //custom hook
  const [sliderDisabled, setSliderDisabled] = useState(false); //disable slider or not
  const [randomizedDuration, setRandomizedDuration] = useState(0); //musicswitchcontext
  const [totalMeditationTime, setTotalMeditationTime] = useState(0);
  const [adjustedSessionDuration, setAdjustedSessionDuration] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Navigation
  const navigation = useNavigation();

  // Listening to app state changes (foreground and background)
  // This function is triggered when the app comes to the foreground after being paused
  useAppStateListener({
    onForegroundResume: elapsedTime => {
      if (sessionInProgress && remainingSeconds > 0) {
        const adjustedRemainingSeconds = Math.max(
          remainingSeconds - elapsedTime,
          0,
        );
        if (adjustedRemainingSeconds > 0) {
          startTimer(adjustedRemainingSeconds); // Resume timer
        } else {
          stopTimer(); // Timer has expired
        }
      }
    },
    onBackgroundPause: () => {
      if (sessionInProgress) {
        console.log('App moved to the background during a session.');
      }
    },
  });

   
  //create the random adjustment timer or have 0 adjustment
  useEffect(() => {
    const randomAdjustment = adjustmentSwitchState
      ? (Math.random() * 0.5 - 0.3) * selectedDuration
      : 0;
    const newRandomizedDuration = selectedDuration + randomAdjustment;
    setRandomizedDuration(newRandomizedDuration);
  }, [selectedDuration, adjustmentSwitchState]);

  // FUNCTIONS

  //when user starts a session this is where it starts
  const beginSession = () => {
    //adjusts the time for timer if randomtime
    const randomizedDuration = calculateRandomizedDuration();
    const totalSeconds = Math.round(randomizedDuration * 60);
    playTone();
    setSessionInProgress(true);
    setSliderDisabled(true);
    if (musicSwitchState) {
      playMusic(); //from useMusic.js
    }
    startTimer(totalSeconds);
  };

  //next stage after beginSession
  const startTimer = totalSeconds => {
    setRemainingSeconds(totalSeconds);

    // Clear any existing timer
    if (timerRef.current) {
      BackgroundTimer.clearInterval(timerRef.current);
    }

    timerRef.current = BackgroundTimer.setInterval(() => {
      setRemainingSeconds(prevRemainingSeconds => {
        const seconds = prevRemainingSeconds - 1;

        // Define intervals
        const interval25 = Math.floor(totalSeconds * 0.25);
        const interval50 = Math.floor(totalSeconds * 0.5);
        const interval75 = Math.floor(totalSeconds * 0.75);
        const interval90 = Math.floor(totalSeconds * 0.1);

        // Play interval bell at specific times
        if (intervalBellsSwitchState) {
          if (interval25Active && seconds === interval25) {
            playIntervalBell(25);
          } else if (interval50Active && seconds === interval50) {
            playIntervalBell(50);
          } else if (interval75Active && seconds === interval75) {
            playIntervalBell(75);
          } else if (interval90Active && seconds === interval90) {
            playIntervalBell(90);
          }
        }

        if (seconds === 0) {
          handleTimerEnd(totalSeconds); //next stage
          playTone();
          BackgroundTimer.clearInterval(timerRef.current);
        }

        return seconds;
      });
    }, 1); // debug time here
  };

  //when we get to a natural ending of sessions we want to do some unique stuff and THEN stopSession
  const handleTimerEnd = totalSeconds => {
    const sessionDuration = totalSeconds / 60;
    addMeditationTime(sessionDuration);
    setTotalMeditationTime(prevTotal => prevTotal + totalSeconds);
    stopSession();
    setSliderDisabled(false);
    incrementSessionCount();
    setSessionCompleted(true);
  };

  //can run if user stops session or after natural session is done and handTimer is called
  const stopSession = () => {
    console.log('stop session by user');
    setSliderDisabled(false);
    if (timerRef.current) {
      BackgroundTimer.clearInterval(timerRef.current);
    }
    stopMusic();
    setSessionInProgress(false);
  };

  // Function to calculate randomized duration if needed
  // if adjustmentSwitchState is true do the math otherwise 0, no adjustment to the time
  const calculateRandomizedDuration = () =>
    selectedDuration +
    (adjustmentSwitchState
      ? (Math.random() * 0.5 - 0.3) * selectedDuration
      : 0);

  ///used in DurationSelector
  const handleTimerChange = value => {
    if (!sessionInProgress) {
      setSelectedDuration(value);
    }
  };

  const playTone = () => {
    const sound = new Sound('audio_file.mp3', null, error => {
      sound.play(() => sound.release());
    });
  };

  const playIntervalBell = percentage => {
    const sound = new Sound('intervalbell.mp3', null, error => {
      sound.play(() => sound.release());
    });
  };

  const handleButtonLongPress = buttonKey => {
    Alert.alert(
      'Confirmation:',
      `Are you sure you want to set this button's duration to ${selectedDuration} minutes?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () => {
            setButtonSelectedDuration(buttonKey, selectedDuration);
          },
        },
      ],
      {cancelable: false},
    );
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
        buttonSelectedDuration={buttonDurations}
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
