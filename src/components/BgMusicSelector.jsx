import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import {useMusicSwitchContext} from '../context/MusicSwitchContext';

const BgMusicSelector = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const {selectedSongPathBg, setselectedSongPathBg} = useMusicSwitchContext(); // just a simple path for the beginsession
  const {savedChimeBg, setSavedChimeBg} = useMusicSwitchContext(); // To store the saved chime(path) and volumeBg
  const {selectedChimeNameBg, setSelectedChimeNameBg} = useMusicSwitchContext();
  const {volumeBg, setVolumeBg} = useMusicSwitchContext();

  const availableChimes = {
    Nature: [
      {
        label: 'Relaxing meditation music',
        value: 'relaxingmeditationmusic225173.mp3',
      },
      {
        label: 'Calm river flowing',
        value: 'calmzenriverflowing228223.mp3',
      },
      {
        label: 'Gentle wind',
        value: 'agentlebreezewind414681.mp3',
        parent: 'nature',
      },
      {
        label: 'Nature forest stream birds',
        value: 'natureforestbirds.mp3',
        parent: 'nature',
      },
      {
        label: 'Placeholder1',
        value: '1',
      },
      {
        label: 'Placeholder2',
        value: '2',
      },
      {
        label: 'Placeholder3',
        value: '3',
      },
      {
        label: 'Placeholder4',
        value: '4',
      },
      {
        label: 'Placeholder5',
        value: '5',
      },
    ],
    Mood: [
      {
        label: 'Meditation hall at night',
        value: 'meditationhallatnight24956.mp3',
        parent: 'other',
      },
      {
        label: 'Peaceful music meditation',
        value: 'meditationrelax231757.mp3',
        parent: 'other',
      },
      {
        label: 'Peaceful music meditation',
        value: 'meditationrelax2317573.mp3',
        parent: 'instrument',
      },
      {
        label: 'Mindfulness meditation music',
        value: 'mindful.mp3',
        parent: 'other',
      },
      {
        label: 'Placeholder1',
        value: '1',
      },
      {
        label: 'Placeholder2',
        value: '2',
      },
      {
        label: 'Placeholder3',
        value: '3',
      },
      {
        label: 'Placeholder4',
        value: '4',
      },
      {
        label: 'Placeholder5',
        value: '5',
      },
    ],
    Frequency: [
      {
        label: '528 hz ambient music',
        value: 'hz528frequencyambientmusic',
        parent: 'hertz',
      },
      {
        label: '417 hz OM Chanting',
        value: 'now.mp3',
      },
      {
        label: '432 hz alpha waves',
        value: 'hz432alphawaveshealtheholebodyspirit216473.mp3',
        parent: 'hertz',
      },
      {
        label: 'Tibetan singing bowls',
        value: 'tibetansingingbowlsbodydamagerepairhealbodysoul161797',
        parent: 'instrument',
      },
      {
        label: 'Placeholder1',
        value: '1',
      },
      {
        label: 'Placeholder2',
        value: '2',
      },
      {
        label: 'Placeholder3',
        value: '3',
      },
      {
        label: 'Placeholder4',
        value: '4',
      },
      {
        label: 'Placeholder5',
        value: '5',
      },
    ],
    All: [
      {
        label: 'Nothing',
        value: null,
      },
      {
        label: 'Relaxing meditation music',
        value: 'relaxingmeditationmusic225173.mp3',
      },
      {
        label: '417 hz OM Chanting',
        value: 'now.mp3',
      },
      {
        label: 'Calm river flowing',
        value: 'calmzenriverflowing228223.mp3',
      },
      {
        label: 'Gentle wind',
        value: 'agentlebreezewind414681.mp3',
        parent: 'nature',
      },
      {
        label: 'Nature forest stream birds',
        value: 'natureforestbirds.mp3',
        parent: 'nature',
      },
      {
        label: '528 hz ambient music',
        value: 'hz528frequencyambientmusic',
        parent: 'hertz',
      },
      {
        label: '432 hz alpha waves',
        value: 'hz432alphawaveshealtheholebodyspirit216473.mp3',
        parent: 'hertz',
      },
      {
        label: 'Tibetan singing bowls',
        value: 'tibetansingingbowlsbodydamagerepairhealbodysoul161797',
        parent: 'instrument',
      },
      {
        label: 'Meditation hall at night',
        value: 'meditationhallatnight24956.mp3',
        parent: 'other',
      },
      {
        label: 'Peaceful music meditation',
        value: 'meditationrelax231757.mp3',
        parent: 'other',
      },
      {
        label: 'Mindfulness meditation music',
        value: 'mindful.mp3',
      },
    ],
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setSavedChimeBg(
      JSON.stringify({
        chime: {label: selectedChimeNameBg, value: selectedSongPathBg},
        volumeBg,
      }),
    );
    setModalVisible(false);
  };

  const handleChimeSelection = chime => {
    setselectedSongPathBg(chime.value);
    setSelectedChimeNameBg(chime.label);
  };

  const handleCategoryChange = category => {
    setSelectedCategory(category); 
  };

  const getCategoryButtonStyle = category => {
    const baseStyle = [styles.categoryButton, {borderColor: '#74aff7'}];
    if (category === selectedCategory) {
      return [
        ...baseStyle,
        {
          backgroundColor: '#74aff7',
          borderColor: '#74aff7', // background color
        },
      ];
    }
    return baseStyle;
  };

  let currentSound = null;

  const playTestSound = () => {
    if (currentSound) {
      // If the sound is already playing, stop it
      currentSound.stop(() => {
        currentSound.release();
        currentSound = null; // Reset the reference
        console.log('Tone playback stopped');
      });
    } else {
      // If the sound is not playing, start it
      if (!selectedSongPathBg) {
        console.error('No sound path selected.');
        return;
      }

      currentSound = new Sound(selectedSongPathBg, null, error => {
        if (error) {
          console.error('Error loading sound:', error);
          return;
        }

        currentSound.setVolume(volumeBg); // Adjust volume
        currentSound.play(() => console.log('Tone playing for 5 seconds'));

        setTimeout(() => {
          if (currentSound) {
            currentSound.stop(() => {
              currentSound.release();
              currentSound = null; // Reset the reference
              console.log('Sound playback completed');
            });
          }
        }, 10000); // Play for 10 seconds
      });
    }
  };

  const chimesToDisplay =
    availableChimes[selectedCategory] || availableChimes.All;

  useEffect(() => {
    if (savedChimeBg) {
      const savedChimeData = JSON.parse(savedChimeBg);
      setSelectedChimeNameBg(savedChimeData?.chime?.label || null);
      setselectedSongPathBg(savedChimeData?.chime?.value || null);
      setVolumeBg(savedChimeData?.volumeBg || 0.8);
    }
  }, [savedChimeBg]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => openModal()} style={styles.button}>
        <Text style={styles.buttonText}>
          Selected Music: {selectedChimeNameBg || 'None'}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose your background music</Text>

            <View style={styles.categoryContainer}>
              <TouchableOpacity
                style={getCategoryButtonStyle('All')}
                onPress={() => handleCategoryChange('All')}>
                <Text style={styles.categoryButtonText}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={getCategoryButtonStyle('Nature')}
                onPress={() => handleCategoryChange('Nature')}>
                <Text style={styles.categoryButtonText}>Nature</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={getCategoryButtonStyle('TimeOfDay')}
                onPress={() => handleCategoryChange('TimeOfDay')}>
                <Text style={styles.categoryButtonText}>Time of Day</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={getCategoryButtonStyle('Mood')}
                onPress={() => handleCategoryChange('Mood')}>
                <Text style={styles.categoryButtonText}>Mood</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.optionsContainer}>
              {chimesToDisplay.map(chime => (
                <TouchableOpacity
                  key={chime.value || chime.label}
                  style={styles.option}
                  onPress={() => handleChimeSelection(chime)}>
                  <View style={styles.iconContainer}>
                    <View
                      style={[
                        styles.circle,
                        selectedSongPathBg === chime.value &&
                          styles.filledCircle,
                      ]}
                    />
                    <Text style={styles.optionText}>{chime.label}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Volume Slider */}
            <Text style={styles.sliderLabel}>
              Volume: {Math.round(volumeBg * 100)}%
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={volumeBg}
              onValueChange={value => setVolumeBg(value)}
              minimumTrackTintColor="#74aff7"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#74aff7"
            />

            {/* Test Sound Button */}
            <View style={styles.buttonRowContainer}>
              {/* Test Sound Button */}
              <TouchableOpacity
                style={styles.testButton}
                onPress={playTestSound}>
                <Text style={styles.testButtonText}>Test Music</Text>
              </TouchableOpacity>

              {/* Choose Button */}
              <TouchableOpacity
                style={styles.chooseButton}
                onPress={closeModal}>
                <Text style={styles.chooseButtonText}>Choose Music</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 1,
  },
  button: {
    backgroundColor: '#1A1F26',
    padding: 12,
    borderRadius: 8,
    borderColor: '#74aff7',
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalContent: {
    backgroundColor: '#212121',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#74aff7',
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1A1A1A',
    borderColor: '#74aff7',
    borderWidth: 1,
    borderRadius: 5,
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  optionsContainer: {
    paddingBottom: 30,
  },
  option: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'transparent',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#74aff7',
  },
  filledCircle: {
    backgroundColor: '#74aff7',
  },
  optionText: {
    color: '#fff',
    fontSize: 17,
  },
  sliderLabel: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  slider: {
    width: '100%',
    height: 30,
  },
  buttonRowContainer: {
    flexDirection: 'row', // Arrange buttons side by side
    justifyContent: 'space-between', // Add space between buttons
    marginTop: 20, // Optional: Adjust top margin to fit your design
  },
  testButton: {
    padding: 10,
    backgroundColor: '#74aff7',
    borderRadius: 8,
    flex: 1, // Make the buttons take equal width
    marginRight: 10, // Optional: Add space between buttons
  },
  chooseButton: {
    padding: 10,
    backgroundColor: '#74aff7',
    borderRadius: 8,
    flex: 1, // Make the buttons take equal width
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  chooseButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#74aff7',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
export default BgMusicSelector;
