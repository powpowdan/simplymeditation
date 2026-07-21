import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
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
    selectedChimeNameBg,
    setSelectedChimeNameBg,
    volumeBg,
    setVolumeBg,
  } = useMusicSwitchContext();

  const [soundInstance, setSoundInstance] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isPlayingSameSong, setIsPlayingSameSong] = useState(false);
  const [previousSongPathBg, setPreviousSongPathBg] = useState(null);

  const [previewChimeNameBg, setPreviewChimeNameBg] = useState(null);
  const [previewChimePathBg, setPreviewChimePathBg] = useState(null);
  const [previewVolumeBg, setPreviewVolumeBg] = useState(0.8);

  const availableMusic = {
    Nature: [
      {
        label: 'Zen river',
        value: 'zenriver.mp3',
      },
      {
        label: 'Wind in trees',
        value: 'windtrees.mp3',
        parent: 'nature',
      },
      {
        label: 'Forest stream birds',
        value: 'natureforestbirds.mp3',
        parent: 'nature',
      },
      {
        label: 'Rain',
        value: 'rains.mp3',
        parent: 'nature',
      },
      {
        label: 'Storm wind chimes',
        value: 'stormwindchimes.mp3',
        parent: 'nature',
      },
      {
        label: 'Ocean waves',
        value: 'oceanwaves.mp3',
        parent: 'nature',
      },
      {
        label: 'Waterfall',
        value: 'waterfall.mp3',
        parent: 'nature',
      },
      {
        label: 'Night ambience',
        value: 'nightambience.mp3',
        parent: 'nature',
      },
    ],
    Mood: [
      {
        label: 'Meditation hall at night',
        value: 'meditationhallatnight24956.mp3',
        parent: 'Mood',
      },
      {
        label: 'Peaceful music meditation',
        value: 'meditationrelax.mp3',
        parent: 'Mood',
      },
      {
        label: 'Uplifting tones',
        value: 'uplifting.mp3',
        parent: 'Mood',
      },
      {
        label: 'Tibetan singing bowls',
        value: 'tibetansingingbowls.mp3',
        parent: 'Mood',
      },
      {
        label: 'Om ambient',
        value: 'omambient.mp3',
        parent: 'Mood',
      },
    ],
    Frequency: [
      {
        label: '528 hertz - love',
        value: 'hz528.mp3',
        parent: 'Frequency',
      },
      {
        label: '417 hz OM Chanting',
        value: 'now.mp3',
        parent: 'Frequency',
      },
      {
        label: '432 hertz - healing',
        value: 'hz432.mp3',
        parent: 'Frequency',
      },

      {
        label: 'Brown noise',
        value: 'brownnoise.mp3',
        parent: 'Frequency',
      },
    ],
    All: [
      {label: '417 hz OM Chanting', value: 'now.mp3', parent: 'Frequency'},
      {label: '432 hertz - healing', value: 'hz432.mp3', parent: 'Frequency'},
      {label: '528 hertz - love', value: 'hz528.mp3', parent: 'Frequency'},
      {label: 'Brown noise', value: 'brownnoise.mp3', parent: 'Frequency'},
      {
        label: 'Forest stream birds',
        value: 'natureforestbirds.mp3',
        parent: 'Nature',
      },
      {
        label: 'Meditation hall at night',
        value: 'meditationhallatnight24956.mp3',
        parent: 'Mood',
      },
      {label: 'Night ambience', value: 'nightambience.mp3', parent: 'Nature'},
      {label: 'Ocean waves', value: 'oceanwaves.mp3', parent: 'Nature'},
      {label: 'Om ambient', value: 'omambient.mp3', parent: 'Mood'},
      {
        label: 'Peaceful music meditation',
        value: 'meditationrelax.mp3',
        parent: 'Mood',
      },
      {label: 'Rain', value: 'rains.mp3', parent: 'Nature'},
      {
        label: 'Storm wind chimes',
        value: 'stormwindchimes.mp3',
        parent: 'Nature',
      },
      {
        label: 'Tibetan singing bowls',
        value: 'tibetansingingbowls.mp3',
        parent: 'Mood',
      },
      {label: 'Uplifting tones', value: 'uplifting.mp3', parent: 'Mood'},
      {label: 'Waterfall', value: 'waterfall.mp3', parent: 'Nature'},
      {label: 'Wind in trees', value: 'windtrees.mp3', parent: 'Nature'},
      {label: 'Zen river', value: 'zenriver.mp3', parent: 'Nature'},
    ],
  };

  const openModal = () => {
    setPreviewChimeNameBg(selectedChimeNameBg);
    setPreviewChimePathBg(selectedSongPathBg);
    setPreviewVolumeBg(volumeBg);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (soundInstance) {
      soundInstance.stop(() => soundInstance.release());
    }

    // Update the context directly. This is the single source of truth.
    setselectedSongPathBg(previewChimePathBg);
    setVolumeBg(previewVolumeBg);
    setIsMusicPlaying(false);
    setModalVisible(false);
  };

  const handleCloseWithoutSaving = () => {
    if (soundInstance) {
      soundInstance.stop(() => soundInstance.release());
    }
    setIsMusicPlaying(false);
    setModalVisible(false);
  };

  const handleChimeSelection = chime => { 
    setPreviewChimePathBg(chime.value);
    setPreviewChimeNameBg(chime.label);

    // If music is playing AND selected chime is same as playing chime
    if (isMusicPlaying && chime.value === previousSongPathBg) {
      setIsPlayingSameSong(true);
    } else {
      setIsPlayingSameSong(false);
    }
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
    if (!previewChimePathBg) return;

    if (isMusicPlaying) {
      // If music is playing, stop it (Cancel)
      if (soundInstance) {
        soundInstance.stop(() => {
          soundInstance.release();
          setIsMusicPlaying(false);
          setIsPlayingSameSong(false); // or set to false when stopped
        });
      }
    } else {
      // If music is NOT playing, play the selected song
      if (soundInstance) {
        soundInstance.stop(() => {
          soundInstance.release();
        });
      }

      const sound = new Sound(previewChimePathBg, null, error => {
        if (error) {
          console.error('Error loading sound:', error);
          return;
        }

        sound.setVolume(previewVolumeBg);
        sound.play(() => {
          sound.release();
          setIsMusicPlaying(false);
          setIsPlayingSameSong(false);
        });

        setSoundInstance(sound);
        setIsMusicPlaying(true);
        setIsPlayingSameSong(true); // <-- Always true while playing
        setPreviousSongPathBg(previewChimePathBg);

        setTimeout(() => {
          sound.stop(() => {
            sound.release();
            setIsMusicPlaying(false);
            setIsPlayingSameSong(false);
          });
        }, 12000);
      });
    }
  };

  const musicToDisplay =
    availableMusic[selectedCategory] || availableMusic.All;

  // This is the key to fixing the synchronization issue.
  // When the path changes from anywhere (e.g., loading a preset in HomeScreen),
  // this effect finds the matching music from the list and updates the name in the context.
  useEffect(() => {
    const music = availableMusic.All.find(m => m.value === selectedSongPathBg);
    // If a matching music item is found and its label is different from the one in the context
    if (music && music.label !== selectedChimeNameBg) {
      setSelectedChimeNameBg(music.label);
    }
  }, [selectedSongPathBg]); // This effect runs whenever the background music path changes

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
        onRequestClose={handleCloseWithoutSaving}>
        <TouchableWithoutFeedback onPress={handleCloseWithoutSaving}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Choose your background music
                </Text>

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
                    style={getCategoryButtonStyle('Frequency')}
                    onPress={() => handleCategoryChange('Frequency')}>
                    <Text style={styles.categoryButtonText}>Frequency</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={getCategoryButtonStyle('Mood')}
                    onPress={() => handleCategoryChange('Mood')}>
                    <Text style={styles.categoryButtonText}>Mood</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.optionsContainer}>
                  {musicToDisplay.map(chime => (
                    <TouchableOpacity
                      key={chime.value || chime.label}
                      style={styles.option}
                      onPress={() => handleChimeSelection(chime)}>
                      <View style={styles.iconContainer}>
                        <View
                          style={[
                            styles.circle,
                            previewChimePathBg === chime.value &&
                              styles.filledCircle,
                          ]}
                        />
                        <Text style={styles.optionText}>{chime.label}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.sliderLabel}>
                  Volume: {Math.round(previewVolumeBg * 100)}%
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
                    value={previewVolumeBg}
                    onValueChange={value => setPreviewVolumeBg(value)}
                    minimumTrackTintColor="#74aff7"
                    maximumTrackTintColor="#ccc"
                    thumbTintColor="#74aff7"
                    disabled={isMusicPlaying}
                  />
                  <Icon
                    name="volume-high-outline"
                    size={iconSize}
                    color="#ffffff"
                    style={styles.icon}
                  />
                </View>

                <View style={styles.buttonRowContainer}>
                  <TouchableOpacity
                    style={styles.testButton}
                    onPress={playTestSound}>
                    <Text style={styles.testButtonText}>
                      {isMusicPlaying && isPlayingSameSong
                        ? 'Cancel'
                        : 'Test Music'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.chooseButton}
                    onPress={handleSave}>
                    <Text style={styles.chooseButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const {width} = Dimensions.get('window');
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
    height: '80%',
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
