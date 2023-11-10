import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef } from 'react';
import { View,Switch, AppState, TouchableOpacity, Image, Text, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
Sound.setCategory('Playback');
import BackgroundTimer from 'react-native-background-timer';
import ProgressCircle from 'react-native-progress-circle';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'; 
import { SafeAreaView } from 'react-native-safe-area-context'; // Update the import
import GoToStatsImage from './android/app/src/img/QQ4.png';   
import { MusicSwitchProvider } from './MusicSwitchContext';
import { SessionProvider } from './SessionContext';
import SessionList from './SessionList'; 
import { useSessionContext } from './SessionContext'; 
import { useMusicSwitchContext } from './MusicSwitchContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable'; 


function OptionsScreen({ navigation}) {
  
  // Get the totalTimeMeditated from the context using the useSessionContext hook
  console.log('OptionsScreen re-rendered. musicSwitchState:', musicSwitchState);
  const { totalTimeMeditated } = useSessionContext();
  const { musicSwitchState, setMusicSwitchState } = useMusicSwitchContext(); 
  const handleGoToHome = () => {
    navigation.navigate('MeditationTimer');
  };

  useEffect(() => {
    // Load the switch state from AsyncStorage when the component mounts
    loadSwitchState();
  }, []);

  const loadSwitchState = async () => {
    try { 
      const value = await AsyncStorage.getItem('musicSwitchState');
      if (value !== null) {
        // Parse the value from AsyncStorage (it's stored as a string)
        setMusicSwitchState(JSON.parse(value));
      }
    } catch (error) {
      console.error('Error loading switch state:', error);
    }
  };

  const saveSwitchState = async (value) => {
    try {
      // Save the switch state to AsyncStorage as a string
      await AsyncStorage.setItem('musicSwitchState', JSON.stringify(value));
      console.log('saved');
    } catch (error) {
      console.error('Error saving switch state:', error);
    }
  };

  const handleMusicSwitchChange = (value) => {
    // Update the switch state and save it to AsyncStorage when it changes
    setMusicSwitchState(value); 
    saveSwitchState(value);
  };

  return (
    <View style={styles.container2}> 
      <Text style={styles.headerText2}>Stats</Text>
      <Text>Total Time Meditated: {totalTimeMeditated} minutes</Text>
      {/* <Text>Day Streak: TODO</Text> */}

      <Text style={styles.headerText2}>Options</Text> 
      {/* <TouchableOpacity><Text style={styles.options}>Change bell sound for session</Text></TouchableOpacity> */}
      <TouchableOpacity><Text style={styles.options}>Monk chanting</Text></TouchableOpacity> 
      <Switch value={musicSwitchState} onValueChange={handleMusicSwitchChange} />
      {/* <TouchableOpacity><Text style={styles.options}>Randomized meditation alarm switch</Text></TouchableOpacity>  */}
       
       
      {/* <TouchableOpacity
        style={{ marginTop: 20, backgroundColor: '#74aff7', padding: 10, borderRadius: 8 }}
        onPress={handleGoToHome}>
        <Text style={{ color: '#ededed', fontSize: 18 }}>Go to Meditation Timer</Text>
      </TouchableOpacity> */}
    </View> 
  );
}

function HomeScreen() {
  
  const navigation = useNavigation();
  const [sessionInProgress, setSessionInProgress] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0); 
  const [selectedDuration, setSelectedDuration] = useState(15);
  const { addMeditationTime } = useSessionContext();
  const [sound, setSound] = useState(null);
  const { musicSwitchState, setMusicSwitchState } = useMusicSwitchContext();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const appState = useRef(AppState.currentState);
  const timerRef = useRef();
  const timerDurations = [5, 10, 15, 20]; 
  const [sliderDisabled, setSliderDisabled] = useState(false);
  
  // Initialize buttonSelectedDuration with useState
  const [buttonSelectedDuration, setButtonSelectedDuration] = useState({
    button5Mins: 5,
    button10Mins: 10,
    button15Mins: 15,
    button20Mins: 20, 
  });

  const sentences = [
  "Be the change that you wish to see in the world",
  "Peace is not found in the world but in the quiet spaces within",
  "The future depends on what you do today", 
  "The quieter you become, the more you can hear", 
  "When you realize nothing is lacking, the whole world belongs to you", 
  "To the mind that is still, the whole universe surrenders", 
  "The only real failure in life is not to be true to the best one knows", 
  "Meditation makes you accident-prone to enlightenment", 
  "Greatness is not just what one does, but also what one refuses to do", 
  "You should sit in meditation for twenty minutes every day — unless you’re too busy. Then you should sit for an hour", 
  "Continuous improvement is better than delayed perfection", 
  "Simplicity, patience, compassion. These three are your greatest treasures", 
  "The wise man is one who, knows, what he does not know", 
  "When I let go of what I am, I become what I might be", 
  "Knowing others is wisdom, knowing yourself is Enlightenment", 
  "Continuous improvement is better than delayed perfection", 
  "Do you have the patience to wait until your mud settles and the water is clear?",
  "He who is contented is rich",
  "Your work is to discover your world and then with all your heart give yourself to it",
  "The soul always knows what to do to heal itself. The challenge is to silence the mind",
  "The moment you accept what troubles you've been given, the door will open",
  "To enjoy the rainbow, first enjoy the rain",
  "You can't have a rainbow without a little rain",
  "Life will give you whatever experience is most helpful for the evolution of your consciousness",
  "Acknowledging the good that you already have in your life is the foundation for all abundance",
  "The moment you start watching the thinker, a higher level of consciousness becomes activated",
  "Worry pretends to be necessary but serves no useful purpose", 
  "Force always moves against something, whereas power does not move against something but moves toward something",
  "Force can only be used against something already manifest; power can be used at any time because it is the source of all manifestation",

];

// Generate a random index different from the current and last sentence indexes
const getRandomSentenceIndex = () => { 
  const availableIndexes = sentences
    .map((_, index) => index) 
    .filter((index) => index !== currentSentenceIndex && index !== lastSentenceIndex); 
  if (availableIndexes.length > 0) {
    return availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
  }  
  // When all indexes are used, return a random index except the current sentence
  return sentences
    .map((_, index) => index)
    .filter((index) => index !== currentSentenceIndex)[Math.floor(Math.random() * (sentences.length - 1))];
}; 

 
const [currentSentenceIndex, setCurrentSentenceIndex] = useState(getRandomSentenceIndex());
  const [lastSentenceIndex, setLastSentenceIndex] = useState(-1);
  const [animation, setAnimation] = useState('fadeIn');
  const [sentenceVisible, setSentenceVisible] = useState(true);
  const [fadeout, setFadeout] = useState(false);

  

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimation('fadeOut');
      setFadeout(true);

      // Add a delay to switch to the next sentence
      setTimeout(() => {
        let newIndex;
        do {
          newIndex = getRandomSentenceIndex();
        } while (newIndex === currentSentenceIndex || newIndex === lastSentenceIndex);
        setCurrentSentenceIndex(newIndex);
        setLastSentenceIndex(currentSentenceIndex);
        setAnimation('fadeIn');
        setFadeout(false);
      }, 1000); // Adjust this delay as needed for smoother transitions
    }, 10000); // 5-second interval for updating sentences

    return () => clearInterval(timer);
  }, [currentSentenceIndex, lastSentenceIndex]);



const currentSentence = sentences[currentSentenceIndex];
  
  useEffect(() => { 
    loadMusicSwitchState();
  }, []);

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
  
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

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
      AsyncStorage.setItem('selectedDurations', JSON.stringify(buttonSelectedDuration));
    } catch (error) {
      console.error('Error saving selected durations:', error);
    }
  }, [buttonSelectedDuration]);

  const handleAppStateChange = (nextAppState) => {
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

   
   const handleGoToHome = () => {
    navigation.navigate('Home');
  };

  const playTone = () => {
    const sound = new Sound('audio_file.mp3', null, (error) => {
      if (error) {
        alert('Error', JSON.stringify(error));
      }
      sound.play(() => sound.release());
    });
  };

  const startTimer = (duration) => {
    setRemainingSeconds(duration);
    timerRef.current = BackgroundTimer.setInterval(() => {
      setRemainingSeconds((prevRemainingSeconds) => {
        const seconds = prevRemainingSeconds - 1;

        if (seconds === 0) {
          stopSession();
          playTone();
          BackgroundTimer.clearInterval(timerRef.current);
           // Save the session duration in minutes
           addMeditationTime(selectedDuration);
           //STOP MUSIC HERE?
        }

        return seconds;
      });
    }, 1000);
  };

  const stopSession = () => {
    console.log("stop session");
    resetTimer();
    setSliderDisabled(false);
    if (timerRef.current) {
      BackgroundTimer.clearInterval(timerRef.current);
    } 
    
  };

  const resetTimer = () => {
    console.log("resetTimer");
    setSessionInProgress(false);
    setRemainingSeconds(0);
    if (sound) {
      sound.stop();
      sound.release();
      setSound(null); 
      console.log("stopsound"); 
    }
  };

  const handleTimerChange = (value) => {
    if (!sessionInProgress) {
      setSelectedDuration(value);
    }
  }; 

  const handleButtonLongPress = (buttonKey) => {
    Alert.alert(
      'Confirmation:',
      `Are you sure you want to set this button's duration to ${selectedDuration} minutes?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => { 
            await AsyncStorage.setItem(buttonKey, selectedDuration.toString());
            setButtonSelectedDuration((prev) => ({
              ...prev,
              [buttonKey]: selectedDuration,
            }));
          },
        },
      ],
      { cancelable: false }
    );
  };

  

 const beginSession = () => {
    playTone();
    resetTimer();  
    setSessionInProgress(true);
    setSliderDisabled(true);
      if (musicSwitchState) {
    playMusic();
    setIsMusicPlaying(true);
  }
    startTimer(selectedDuration * 60); 
  }; 
 

  const playMusic = () => { 
    if (musicSwitchState) {
      const newSound = new Sound('now.mp3', null, (error) => {
        if (error) {
          console.error('Error:', error);
        } else {
          newSound.play(() => { 
            newSound.release(); 
          });
          setSound(newSound);
        } 
      });
    }   
  }; 

 
  return (
    <View style={styles.container}>
    
    {/* <TouchableOpacity disabled={sliderDisabled} onPress={() => navigation.navigate('Home')} style={{ position: 'absolute', top: 0, right: 16 }}>
     <Text style={{color: '#74aff7', fontSize: 10}}>Options</Text>   
        </TouchableOpacity>    */}
     
   <TouchableOpacity disabled={sliderDisabled} onPress={() => navigation.navigate('Home')}>
        <Image source={GoToStatsImage} style={styles.goToStatsImage} />
      </TouchableOpacity>   
      <View style={{ alignItems: 'center' }}>
      <Text style={styles.headerText}>Simply Meditation</Text> 
      {/* <Text>Music Switch State: {musicSwitchState ? 'ON' : 'OFF'}</Text>  */}    


      {sentenceVisible && (
        <Animatable.Text
          style={styles.instructions}
          animation={animation} 
          duration={1000} // Adjust the duration for smoother transitions
        >
          {currentSentence}
        </Animatable.Text>
      )}



      
        <ProgressCircle 
          percent={sessionInProgress ? (remainingSeconds / (selectedDuration * 60)) * 100 : 0}
          radius={80}
          borderWidth={10}
          color="#74aff7"
          shadowColor="#101010" 
          bgColor="#212121" 
        >
          <TouchableOpacity
            onPress={sessionInProgress ? stopSession : beginSession}
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
          > 
            {sessionInProgress ? (
              <Text style={styles.countdown}>
                {Math.floor(remainingSeconds / 60).toString().padStart(2, '0')}:
                {(remainingSeconds % 60).toString().padStart(2, '0')}
              </Text>
            ) : (
              <Text style={styles.duration}>
                {selectedDuration.toString().padStart(2, '0')}:00
              </Text>
            )}
          </TouchableOpacity>
        </ProgressCircle>
      </View>

      <Text style={styles.slidertext}>
         Choose your session length
      </Text>
      <View style={styles.sliderContainer}>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={60}
        step={1}
        value={selectedDuration}
        onValueChange={handleTimerChange}
        minimumTrackTintColor="#97d2f7"
        maximumTrackTintColor="white" 
        thumbTintColor="#97d2f7" 
        thumbStyle={styles.sliderThumb} 
        trackStyle={styles.sliderTrack}
        disabled={sliderDisabled}
      />
      </View> 
      <View style={[styles.timerButtonsContainer, { marginTop: -27}]}>
        <TouchableOpacity
          style={[styles.button, styles.timerButton]}
          onLongPress={() => handleButtonLongPress('button5Mins')}
          onPress={() => handleTimerChange(buttonSelectedDuration.button5Mins)} 
        >
          <Text style={styles.colorBlack}>{buttonSelectedDuration.button5Mins} Mins</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.timerButton]}
          onLongPress={() => handleButtonLongPress('button10Mins')}
          onPress={() => handleTimerChange(buttonSelectedDuration.button10Mins)} 
        >
          <Text style={styles.colorBlack}>{buttonSelectedDuration.button10Mins} Mins</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.timerButtonsContainer, { marginTop: -27}]}>
        <TouchableOpacity
          style={[styles.button, styles.timerButton]}
          onLongPress={() => handleButtonLongPress('button15Mins')}
          onPress={() => handleTimerChange(buttonSelectedDuration.button15Mins)} 
        >
          <Text style={styles.colorBlack}>{buttonSelectedDuration.button15Mins} Mins</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.timerButton]}
          onLongPress={() => handleButtonLongPress('button20Mins')}
          onPress={() => handleTimerChange(buttonSelectedDuration.button20Mins)} 
        >
          <Text style={styles.colorBlack}>{buttonSelectedDuration.button20Mins} Mins</Text>
        </TouchableOpacity>
      </View> 

      <View style={styles.beginEndContainer}>
      {!sessionInProgress ? (
        <TouchableOpacity style={[styles.button, styles.beginButton]} onPress={beginSession}>
          <Text style={styles.colorBlack}>Begin Session</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stopSession}>
          <Text style={styles.colorBlack}>Stop Session</Text>
        </TouchableOpacity>
      )}
      </View>
    </View>
  );
}


const Stack = createStackNavigator();  
const App = () => {  

  const [musicSwitchState, setMusicSwitchState] = useState(false);
  const { totalTimeMeditated } = useSessionContext();
  
 
  return (
    <MusicSwitchProvider>
    <SessionProvider > 
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
      <Stack.Screen name="MeditationTimer" component={HomeScreen} options={{ headerShown: false }}   initialParams={{ totalTimeMeditated }}/>
        <Stack.Screen name="Home"  options={{ 
           title: 'Meditate',
    headerStyle: {
      backgroundColor: '#212121', // Set the background color of the header 
    }, 
    headerTintColor: '#ededed', // Set the text color of the header 
    headerTitleStyle: {
      fontWeight: 'bold', // Set the font weight of the header title 
    },
  }} >
          {() => <OptionsScreen totalTimeMeditated={totalTimeMeditated}
                                musicSwitchState={musicSwitchState} 
                                setMusicSwitchState={setMusicSwitchState}/>}
        </Stack.Screen>
        <Stack.Screen name="SessionList" component={SessionList} />
      </Stack.Navigator>
    </NavigationContainer> 
  </SessionProvider>
  </MusicSwitchProvider>
  );
}; 

 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#212121',  
  },
  headerText: {
    fontSize: 24,
    color: '#74aff7',  
    paddingTop: 1,
    paddingLeft: 10,
    textAlign: 'center',
  },
  container2: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: "flex-start",
    backgroundColor: '#212121',  
  },
  headerText2: {
    fontSize: 24,
    color: '#74aff7',  
    paddingTop: 50,
    paddingBottom: 20,
    textAlign: 'center',
  },
  options: {
    paddingTop: 20,

  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
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
  instructions: {
    height: 40,
    textAlign: 'center',
    color: '#ededed',
    marginBottom: 25, 
    marginTop: 5, 
    paddingHorizontal: 10, 
  },  
  button: {
    margin: 10,
    padding: 10,
    width: '70%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35,
    
  },
  beginButton: {
    backgroundColor: '#74aff7', 
    marginTop:55, 
  },
  stopButton: {
    backgroundColor: '#717171', 
    marginTop:35,  
  },
  colorBlack: {
    textAlign: 'center',
    color: '#ededed',  
    fontSize: 18,
  },
  header: {
    position: 'absolute',
    top: 0,
    height: 60,
    width: '100%',
    backgroundColor: '#79a3b1',  
  }, 
  bold: {
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 0, 
    backgroundColor: "#74aff7",  
    borderRadius: 20,
  },
  slidertext: {
    marginTop: 40,
    textAlign: 'center', 
    color: '#74aff7', 
    marginBottom: 5,
    
  },
  sliderThumb: {
    width: 5,  
    height: 5,  
    borderRadius: 15,  
    backgroundColor: '#74aff7', 
  },
  sliderContainer: {
    width: '80%',
    height: 40,
    marginTop: 0,
    marginBottom: 20,
    backgroundColor: "#74aff7",  
    borderRadius: 20,  
    overflow: 'hidden',  
  },
  sliderTrack: {
    height: 10,  
    borderRadius: 5,  
    backgroundColor: "#97d2f7",  
  },
  timerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginBottom: 0,  
    marginTop: 0, 
  },
  timerButton: {
    flex: 1,
    margin: 5,  
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#74aff7',
  },
  timerButtonWrapper: {
    flex: 1, 
    margin: 1,
  },
  beginEndContainer: {
    paddingBottom: 0,
    bottom: 0,  
    width: '80%',
    alignItems: 'center', 
  },
  goToStatsImage: {
    width: 160, 
    height: 160, 
    marginTop: -30,
    marginBottom: -18, 
     
  }, 

});

export default App;
