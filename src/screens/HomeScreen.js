import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
  Modal,
  Animated,
} from 'react-native';
import Sound from 'react-native-sound';
import BackgroundTimer from 'react-native-background-timer';
import LinearGradient from 'react-native-linear-gradient';
import {useMusicSwitchContext} from '../context/MusicSwitchContext';
import {useSessionContext} from '../context/SessionContext';
import Quotes from '../components/Quotes';
import DurationSelector from '../components/DurationSelector';
import SessionProgress from '../components/SessionProgress';
import Logo from '../components/Logo';
import useMusic from '../hooks/useMusic';
import useAppStateTimer from '../hooks/useAppStateTimer';

const RippleEffect = ({onComplete, count = 3, stagger = 1000}) => {
  const rippleAnims = useRef(
    [...Array(count)].map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    const animations = rippleAnims.map(anim =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    );

    if (count > 1) {
      Animated.stagger(stagger, animations).start(() => {
        onComplete && onComplete();
      });
    } else {
      animations[0].start(() => onComplete && onComplete());
    }
  }, []);

  return (
    <View style={styles.rippleWrapper} pointerEvents="none">
      {rippleAnims.map((animValue, index) => {
        const scale = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 4],
        });
        const opacity = animValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.7, 0.5, 0],
        });
        return (
          <Animated.View
            key={index}
            style={[
              styles.rippleCircle,
              {transform: [{scale}], opacity},
            ]}
          />
        );
      })}
    </View>
  );
};

function HomeScreen() {
  // State Declarations

  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(15);
  const {
    addMeditationTime,
    incrementSessionCount,
    setSessionInProgress,
    sessionInProgress,
    savedPresets,
    updatePreset,
  } = useSessionContext();

  const {
    musicSwitchState,
    setMusicSwitchState,
    intervalBellsSwitchState,
    setIntervalBellsSwitchState,
    interval25Active,
    setInterval25Active,
    interval50Active,
    setInterval50Active,
    interval75Active,
    setInterval75Active,
    interval90Active,
    setInterval90Active,
    adjustmentSwitchState,

    //paths for passing music and volume, background is in useffect
    selectedChimePath,
    setSelectedChimePath,
    savedChimeIsouPath,
    setSavedChimeIsouPath,
    volume,
    setVolume,
    volumeIsou,
    setVolumeIsou,
    selectedSongPathBg,
    setselectedSongPathBg,
    volumeBg,
    setVolumeBg,
    selectedChimeName,
    selectedChimeNameBg,
    selectedChimeNameIsou,
  } = useMusicSwitchContext();

  // State for Save Preset Modal
  const [isSaveModalVisible, setSaveModalVisible] = useState(false);
  const [editingPresetKey, setEditingPresetKey] = useState(null);
  const [newPresetName, setNewPresetName] = useState('');

  // Refs
  const timerRef = useRef();
  const adjustedRemainingSeconds = useAppStateTimer(
    sessionInProgress,
    remainingSeconds,
  );

  // Derived States, nothing set by users
  const {playMusic, stopMusic, isMusicPlaying} = useMusic(); // Refactored custom hook
  const [sliderDisabled, setSliderDisabled] = useState(false);
  const [endOfSessionQuote, setEndOfSessionQuote] = useState(null);
  const [totalMeditationTime, setTotalMeditationTime] = useState(0);
  const [showStartRipple, setShowStartRipple] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [animatedPreset, setAnimatedPreset] = useState(null);

  // Listening to app state changes (foreground and background)
  // This function is triggered when the app comes to the foreground after being in background. fixes time issue
  useEffect(() => {
    setRemainingSeconds(adjustedRemainingSeconds); // Set the updated time
  }, [adjustedRemainingSeconds]);

  // This effect handles the special end-of-session state
  useEffect(() => {
    if (showRipple) {
      setEndOfSessionQuote('Your session is complete.');
    } else {
      setEndOfSessionQuote(null);
    }
  }, [showRipple]);

  const handleAnimationComplete = () => {
    // Wait a moment after the ripple finishes, then hide it.
    setTimeout(() => setShowRipple(false), 500);
  };

  // FUNCTIONS
  //when user starts a session this is where it starts
  const beginSession = () => {
    //adjusts the time for timer if randomtime
    const randomizedDuration = calculateRandomizedDuration();
    let totalSeconds = Math.round(randomizedDuration * 60);
 
    setShowStartRipple(true);
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
    addMeditationTime(sessionDuration); // This adds to total time
    incrementSessionCount(totalSeconds); // This handles streaks and history
    setTotalMeditationTime(prevTotal => prevTotal + totalSeconds);

    stopSession();
    setSliderDisabled(false);
    setShowRipple(true);
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

  const handlePresetSelect = presetKey => {
    const preset = savedPresets[presetKey];
    if (!preset) return;

    // Apply all settings from the preset
    setSelectedDuration(preset.duration);

    // Music
    setMusicSwitchState(preset.music.enabled);
    setselectedSongPathBg(preset.music.path);
    setVolumeBg(preset.music.volume);

    // Chime
    setSelectedChimePath(preset.chime.path);
    setVolume(preset.chime.volume);

    // Intervals
    setIntervalBellsSwitchState(preset.intervals.enabled);
    setSavedChimeIsouPath(preset.intervals.path);
    setVolumeIsou(preset.intervals.volume);
    setInterval25Active(preset.intervals.percentages['25']);
    setInterval50Active(preset.intervals.percentages['50']);
    setInterval75Active(preset.intervals.percentages['75']);
    setInterval90Active(preset.intervals.percentages['90']);
  };

  const handleButtonLongPress = presetKey => {
    setEditingPresetKey(presetKey);
    setNewPresetName(savedPresets[presetKey].name);
    setSaveModalVisible(true);
  };

  const triggerShimmer = presetKey => {
    const shimmerAnimation = new Animated.Value(0);
    setAnimatedPreset({key: presetKey, animation: shimmerAnimation});

    Animated.timing(shimmerAnimation, {
      toValue: 1,
      duration: 1000, // Shimmer duration
      useNativeDriver: true,
    }).start(() => {
      // After animation, reset the state
      setAnimatedPreset(null);
    });
  };

  const handleSavePreset = () => {
    if (!editingPresetKey) return;

    const newPresetData = {
      name: newPresetName,
      duration: selectedDuration,
      chime: { path: selectedChimePath, volume: volume },
      music: { path: selectedSongPathBg, volume: volumeBg, enabled: musicSwitchState },
      intervals: {
          path: savedChimeIsouPath,
          volume: volumeIsou,
          enabled: intervalBellsSwitchState,
          percentages: {
              '25': interval25Active,
              '50': interval50Active,
              '75': interval75Active,
              '90': interval90Active,
          }
      }
    };

    updatePreset(editingPresetKey, newPresetData);
    triggerShimmer(editingPresetKey);
    setSaveModalVisible(false);
    setEditingPresetKey(null);
  };

  return (
    <View style={styles.container}>
      {showStartRipple && (
        <RippleEffect count={1} onComplete={() => setShowStartRipple(false)} />
      )}
      {showRipple && <RippleEffect onComplete={handleAnimationComplete} />}
      <Logo
        sliderDisabled={sessionInProgress}
        headerText="Simply Meditation"
        style={{marginTop: 20}}
      />
      <Quotes overrideQuote={endOfSessionQuote} />
      <SessionProgress
        sessionInProgress={sessionInProgress}
        remainingSeconds={remainingSeconds}
        selectedDuration={selectedDuration}
        onPress={sessionInProgress ? stopSession : beginSession}
      />

      <DurationSelector
        selectedDuration={selectedDuration}
        handleTimerChange={handleTimerChange}
        handlePresetSelect={handlePresetSelect}
        handleButtonLongPress={handleButtonLongPress}
        savedPresets={savedPresets}
        sliderDisabled={sliderDisabled}
        animatedPreset={animatedPreset}
      />
      <Modal
        visible={isSaveModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSaveModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Preset</Text>
            <TextInput
              style={styles.modalInput}
              value={newPresetName}
              onChangeText={setNewPresetName}
              placeholder="Preset Name"
              placeholderTextColor="#888"
            />
            <Text style={styles.modalSectionTitle}>Settings Summary:</Text>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>Duration: {selectedDuration} Minutes</Text>
              <Text style={styles.summaryText}>Chime: {selectedChimeName} ({(volume * 100).toFixed(0)}% vol)</Text>
              <Text style={styles.summaryText}>Music: {musicSwitchState ? `${selectedChimeNameBg} (${(volumeBg * 100).toFixed(0)}% vol)` : 'Off'}</Text>
              <Text style={styles.summaryText}>Intervals: {intervalBellsSwitchState ? `${selectedChimeNameIsou} (${(volumeIsou * 100).toFixed(0)}% vol)` : 'Off'}</Text>
              {intervalBellsSwitchState && (
                <Text style={styles.summaryText}>
                  At: {[
                    interval25Active && '25%',
                    interval50Active && '50%',
                    interval75Active && '75%',
                    interval90Active && '90%',
                  ].filter(Boolean).join(', ') || 'None'}
                </Text>
              )}
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setSaveModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSavePreset}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  rippleWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
    overflow: 'hidden',
  },
  rippleCircle: {
   width: width * 0.5,
    height: width * 0.5,
    borderRadius: (width * 0.5) / 2, 
    backgroundColor: 'transparent', 
    borderWidth: 2 * scale, 
    borderColor: '#74aff7', 
    position: 'absolute',
  },
  // Modal Styles
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#404040',
    borderRadius: 5,
    padding: 10,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CCCCCC',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  summaryContainer: {
    width: '100%',
    backgroundColor: '#353535',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  summaryText: {
    color: '#E0E0E0',
    fontSize: 14,
    marginBottom: 5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 5,
    padding: 12,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#555',
  },
  saveButton: {
    backgroundColor: '#74aff7',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;
