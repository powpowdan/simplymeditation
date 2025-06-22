import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import {useMusicSwitchContext} from '../context/MusicSwitchContext';
import Icon from 'react-native-vector-icons/Ionicons';

const BgMusicSelector = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const {
    selectedSongPathBg,
    setselectedSongPathBg,
    savedChimeBg,
    setSavedChimeBg,
    selectedChimeNameBg,
    setSelectedChimeNameBg,
    volumeBg,
    setVolumeBg,
  } = useMusicSwitchContext();

  const [soundInstance, setSoundInstance] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [previousSongPathBg, setPreviousSongPathBg] = useState(null);

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
      {
        label: 'DEBUG HERE',
        value: 'audio_file39.mp3',
        parent: 'instrument',
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
        label: 'DEBUG HERE',
        value: 'audio_file39.mp3',
        parent: 'instrument',
      },
      {
        label: 'Brown noise',
        value: 'brownnoise',
        parent: 'hertz',
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
        label: 'Brown noise',
        value: 'brownnoise.mp3',
        parent: 'hertz',
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
    if (soundInstance) {
      soundInstance.stop(() => {
        soundInstance.release();
      });
    }

    setSavedChimeBg(
      JSON.stringify({
        chime: {label: selectedChimeNameBg, value: selectedSongPathBg},
        volumeBg,
      }),
    );
    setIsMusicPlaying(false);
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

  const playTestSound = () => {
    if (!selectedSongPathBg) return;

    // If the user is trying to play the same sound again while music is playing, stop the current sound
    if (selectedSongPathBg === previousSongPathBg && isMusicPlaying) {
      if (soundInstance) {
        soundInstance.stop(() => {
          soundInstance.release();
          setIsMusicPlaying(false);
        });
      }
    } else {
      // If it's a new sound, stop the current sound and play the new one
      if (soundInstance) {
        soundInstance.stop(() => {
          soundInstance.release();
          setIsMusicPlaying(false);
        });
      }

      const sound = new Sound(selectedSongPathBg, null, error => {
        if (error) {
          console.error('Error loading sound:', error);
          return;
        }

        sound.setVolume(volumeBg);
        sound.play(() => sound.release());
        setSoundInstance(sound);
        setIsMusicPlaying(true);

        setPreviousSongPathBg(selectedSongPathBg); // Update the previous song path

        // Stop the sound after 8 seconds
        setTimeout(() => {
          sound.stop(() => {
            sound.release();
            setIsMusicPlaying(false);
          });
        }, 8000); // 8-second timeout
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
        <Text>
          <Text style={[styles.buttonText, styles.labelText]}>
            Selected Music:{' '}
          </Text>
          <Text style={styles.buttonText}>{selectedChimeNameBg || 'None'}</Text>
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
                <Text style={styles.categoryButtonText}>Hertz</Text>
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
            <View style={styles.volumeContainer}>
              <Icon
                name="volume-low-outline"
                size={24}
                color="#ffffff"
                style={styles.icon}
              />
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={volumeBg}
                onValueChange={value => setVolumeBg(value)}
                minimumTrackTintColor="#74aff7"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#74aff7"
                // disabled={isMusicPlaying}
              />
              <Icon
                name="volume-high-outline"
                size={iconSize}
                color="#ffffff"
                style={styles.icon}
              />
            </View>

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
                <Text style={styles.chooseButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width } = Dimensions.get('window');
const baseWidth = 411; // Pixel 4 XL baseline
const scale = width / baseWidth;
const iconSize = 24 * scale;

const styles = StyleSheet.create({
  container: {
    marginVertical: 1 * scale,
  },
  button: {
    backgroundColor: '#1A1F26',
    padding: 12 * scale,
    borderRadius: 8 * scale,
    borderColor: '#74aff7',
    borderWidth: 0.4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14 * scale,
  },
  labelText: {
    color: '#74aff7',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalContent: {
    backgroundColor: '#212121',
    padding: 20 * scale,
    borderRadius: 10 * scale,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22 * scale,
    fontWeight: 'bold',
    color: '#74aff7',
    marginBottom: 20 * scale,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20 * scale,
  },
  categoryButton: {
    paddingVertical: 8 * scale,
    paddingHorizontal: 12 * scale,
    backgroundColor: '#1A1A1A',
    borderColor: '#74aff7',
    borderWidth: 1,
    borderRadius: 5 * scale,
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 14 * scale,
  },
  optionsContainer: {
    paddingBottom: 30 * scale,
  },
  option: {
    paddingVertical: 20 * scale,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 15 * scale,
    height: 15 * scale,
    borderRadius: 10 * scale,
    backgroundColor: 'transparent',
    marginRight: 10 * scale,
    borderWidth: 1,
    borderColor: '#74aff7',
  },
  filledCircle: {
    backgroundColor: '#74aff7',
  },
  optionText: {
    color: '#fff',
    fontSize: 17 * scale,
  },
  sliderLabel: {
    color: '#74aff7',
    marginTop: 15 * scale,
    marginBottom: 5 * scale,
    fontSize: 14 * scale,
  },
  slider: {
    width: '100%',
    height: 30 * scale,
  },
  buttonRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20 * scale,
  },
  testButton: {
    padding: 10 * scale,
    backgroundColor: '#74aff7',
    borderRadius: 8 * scale,
    flex: 1,
    marginRight: 10 * scale,
  },
  chooseButton: {
    padding: 10 * scale,
    backgroundColor: '#74aff7',
    borderRadius: 8 * scale,
    flex: 1,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16 * scale,
    textAlign: 'center',
  },
  chooseButtonText: {
    color: '#fff',
    fontSize: 16 * scale,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20 * scale,
    padding: 12 * scale,
    backgroundColor: '#74aff7',
    borderRadius: 8 * scale,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16 * scale,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: '1%',
    paddingRight: '6%',
  },
});
export default BgMusicSelector;
