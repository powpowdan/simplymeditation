import React, {useState, useRef, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Alert, Dimensions} from 'react-native';
import Sound from 'react-native-sound';
import BackgroundTimer from 'react-native-background-timer';
import {useMusicSwitchContext} from '../context/MusicSwitchContext';
import {useSessionContext} from '../context/SessionContext';
import Quotes from '../components/Quotes';
import DurationSelector from '../components/DurationSelector';
import SessionProgress from '../components/SessionProgress';
import Logo from '../components/Logo';
import useMusic from '../hooks/useMusic';
import useAppStateTimer from '../hooks/useAppStateTimer';

function HomeScreen() {
  // State Declarations

  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(15);
  const {
    addMeditationTime,
    incrementSessionCount,
    setSessionInProgress,
    sessionInProgress,
  } = useSessionContext();

  const {
    musicSwitchState,
    intervalBellsSwitchState,
    interval25Active,
    interval50Active,
    interval75Active,
    interval90Active,
    adjustmentSwitchState,

    //paths for passing music and volume, background is in useffect
    selectedChimePath,
    savedChimeIsouPath,
    volume,
    volumeIsou,
  } = useMusicSwitchContext();

  const {buttonDurations, setButtonSelectedDuration} = useSessionContext();

  // Refs
  const timerRef = useRef();
  const adjustedRemainingSeconds = useAppStateTimer(
    sessionInProgress,
    remainingSeconds,
  );

  // Derived States, nothing set by users
  const {playMusic, stopMusic, isMusicPlaying} = useMusic(); //custom hook
  const [sliderDisabled, setSliderDisabled] = useState(false); //disable slider or not
  const [totalMeditationTime, setTotalMeditationTime] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Listening to app state changes (foreground and background)
  // This function is triggered when the app comes to the foreground after being in background. fixes time issue
  useEffect(() => {
    setRemainingSeconds(adjustedRemainingSeconds); // Set the updated time
  }, [adjustedRemainingSeconds]);

  // FUNCTIONS
  //when user starts a session this is where it starts
  const beginSession = () => {
    //adjusts the time for timer if randomtime
    const randomizedDuration = calculateRandomizedDuration();
    const totalSeconds = Math.round(randomizedDuration * 60);
    playTone(selectedChimePath);
    setSessionInProgress(true);
    setSliderDisabled(true);
    if (musicSwitchState) {
      playMusic(); //from useMusic.js
    }
    startTimer(totalSeconds);
  };

  //next stage after beginSession
  const startTimer = totalSeconds => {
    //timer drift fix: just setinterval drifts because of systemload/js thread processing.
    // date.now gets current system time and tracking the elapsed time calculates to how much realworld time has passed
    //instead of just -1 from the state every interval tick we calc newremainingseconds based on elapsed time, only updating state when it has actually changed
    const startTime = Date.now();
    setRemainingSeconds(totalSeconds);

    // Clear any existing timer
    if (timerRef.current) {
      BackgroundTimer.clearInterval(timerRef.current.interval);
    }

    timerRef.current = {
      interval: BackgroundTimer.setInterval(() => {
        //timer drift fix below
        const elapsed = Math.floor((Date.now() - startTime) / 1000); // Elapsed time
        const newRemainingSeconds = totalSeconds - elapsed; // Update remaining seconds

        // Only update if the new remaining seconds value has changed
        if (newRemainingSeconds !== remainingSeconds) {
          setRemainingSeconds(newRemainingSeconds);
        }

        // Define intervals based on the original total duration (not recalculated)
        const intervals = [
          {active: interval75Active, target: Math.floor(totalSeconds * 0.25)},
          {active: interval50Active, target: Math.floor(totalSeconds * 0.5)},
          {active: interval25Active, target: Math.floor(totalSeconds * 0.75)},
          {active: interval90Active, target: Math.floor(totalSeconds * 0.1)},
        ];

        // Play interval bell if conditions are met
        if (intervalBellsSwitchState) {
          intervals.forEach(({active, target}) => {
            if (active && newRemainingSeconds === target) {
              playIntervalBell();
            }
          });
        } 

        // When timer reaches 0, stop it and handle the end of the session
        if (newRemainingSeconds <= 0) {
          playTone(selectedChimePath);
          handleTimerEnd(totalSeconds);
          BackgroundTimer.clearInterval(timerRef.current.interval);
        }
      }, 1000), // debug time
    };
 
    BackgroundTimer.start();
  };

  //when we get to a natural ending of sessions we want to do some unique stuff and THEN stopSession
  const handleTimerEnd = totalSeconds => {
    const sessionDuration = totalSeconds / 60;
    addMeditationTime(sessionDuration);
    incrementSessionCount();
    setTotalMeditationTime(prevTotal => prevTotal + totalSeconds);

    stopSession();
    setSliderDisabled(false);
    setSessionCompleted(true);
  };

  //can run if user stops session or after natural session is done and handTimer is called
  const stopSession = () => {
    setSliderDisabled(false);
    if (timerRef.current)
      BackgroundTimer.clearInterval(timerRef.current.interval);
    BackgroundTimer.stop();
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

  //this function is here and in chime selector, can always make it a seperate shared utility
  //now in selector has preview window of time
  const playTone = fileName => {
    const sound = new Sound(fileName, null, error => {
      if (error) {
        console.error('Sound error:', error);
        return;
      }
      sound.setVolume(volume);
      sound.play(() => sound.release());
    });
  };

  //this could also be in the shared utility.
  const playIntervalBell = () => {
    const sound = new Sound(savedChimeIsouPath, null, error => {
      console.log('savedChimeIsouPath' + savedChimeIsouPath);
      if (error) {
        console.error('Sound error:', error);
        return;
      }
      sound.setVolume(volumeIsou);
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
        headerText="Simply Meditation"
        style={{marginTop: 20}}
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

const { width, height } = Dimensions.get('window');
const baseWidth = 411; // Pixel 4 XL baseline
const scale = width / baseWidth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#212121',
  },
  button: {
    margin: 10 * scale,
    padding: 10 * scale,
    width: '76%',
    borderRadius: 8 * scale,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35 * scale,
  },
  beginButton: {
    backgroundColor: '#74aff7',
    marginTop: 25 * scale,
  },
  stopButton: {
    backgroundColor: '#A7C8E7',
    marginTop: 15 * scale,
  },
  colorBlack: {
    textAlign: 'center',
    color: '#1A1F26',
    fontSize: 18 * scale,
  },
  colorBlack2: {
    textAlign: 'center',
    color: '#1A1F26',
    fontSize: 18 * scale,
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
