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

const IntervalBellSelector2 = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

 const {
    selectedChimeNameIsou,
    setSelectedChimeNameIsou,  
    savedChimeIsouPath,
    setSavedChimeIsouPath,
    volumeIsou,
    setVolumeIsou,
  } = useMusicSwitchContext();

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [soundInstance, setSoundInstance] = useState(null);

  // Preview states
  const [previewChimeName, setPreviewChimeName] = useState(null);
  const [previewChimePath, setPreviewChimePath] = useState(null);
  const [previewVolume, setPreviewVolume] = useState(volumeIsou);

 const availableChimes = {
    Nature: [
      {label: 'Ocean wave', value: 'audio_file46.mp3'},
      {label: 'Owl', value: 'audio_file45.mp3'},
      {label: 'Rainfall', value: 'audio_file47.mp3'},
      {label: 'Thunder', value: 'audio_file44.mp3'},
      {label: 'Winter gust', value: 'audio_file49.mp3'},
    ],
    Special: [
      {label: 'Air Woosh', value: 'audio_file43.mp3'},
      {label: 'Deep breath', value: 'audio_file32.mp3'}, 
      {label: 'Harp', value: 'audio_file29.mp3'}, 
      {label: 'Quick shimmer', value: 'audio_file37.mp3'},
    ],
    Instrument: [
      {label: 'Classic start', value: 'audio_file.mp3'},
      {label: 'Bell', value: 'audio_file7.mp3'},
      {label: 'Bell - church', value: 'audio_file27.mp3'},
      {label: 'Bell - long', value: 'audio_file36.mp3'},
      {label: 'Bell - quick', value: 'audio_file26.mp3'},
      {label: 'Chime', value: 'audio_file40.mp3'}, 
      {label: 'Chime - sharp', value: 'audio_file33.mp3'},
      {label: 'Deep drum', value: 'audio_file30.mp3'},
      {label: 'Flute', value: 'audio_file38.mp3'},
      {label: 'Tiny bells', value: 'audio_file34.mp3'},
      {label: 'Gong', value: 'audio_file24.mp3'}, 
      {label: 'Gong - intense', value: 'audio_file17.mp3'}, 
      {label: 'Gong - long', value: 'audio_file41.mp3'},
      {label: 'Gong - Thai temple', value: 'audio_file2.mp3'},
      {label: 'Gong - reverberate', value: 'audio_file13.mp3'},
      {label: 'Gong - shallow', value: 'audio_file25.mp3'},
      {label: 'Gong - short', value: 'audio_file18.mp3'},
    ],
    All: [
      {label: 'Classic start', value: 'audio_file.mp3'},
      {label: 'Air Woosh', value: 'audio_file43.mp3'},
      {label: 'Bell - Church', value: 'audio_file27.mp3'},
      {label: 'Bell - long 2', value: 'audio_file36.mp3'},
      {label: 'Bell - Quick', value: 'audio_file26.mp3'},
      {label: 'Bell - short', value: 'audio_file7.mp3'},
      {label: 'Chime', value: 'audio_file40.mp3'}, 
      {label: 'Chime - sharp', value: 'audio_file33.mp3'},
      {label: 'Chimes ringing - short', value: 'audio_file34.mp3'},
      {label: 'Deep breath', value: 'audio_file32.mp3'},
      {label: 'Deep drum', value: 'audio_file30.mp3'},
      {label: 'Flute - long', value: 'audio_file38.mp3'},
      {label: 'Gong', value: 'audio_file31.mp3'},
      {label: 'Gong 2', value: 'audio_file24.mp3'}, 
      {label: 'Gong - Intense', value: 'audio_file17.mp3'},  
      {label: 'Gong - long', value: 'audio_file41.mp3'},
      {label: 'Gong - long start', value: 'audio_file2.mp3'},
      {label: 'Gong - Reverberate', value: 'audio_file13.mp3'},
      {label: 'Gong - shallow', value: 'audio_file25.mp3'},
      {label: 'Gong - short', value: 'audio_file18.mp3'}, 
      {label: 'Harp', value: 'audio_file29.mp3'},
      {label: 'Ocean wave fast', value: 'audio_file46.mp3'},
      {label: 'Owl', value: 'audio_file45.mp3'},
      {label: 'Quick shimmer', value: 'audio_file37.mp3'},
      {label: 'Rainfall', value: 'audio_file47.mp3'}, 
      {label: 'Thunder', value: 'audio_file44.mp3'},
      {label: 'Winter gust', value: 'audio_file49.mp3'},
    ],
  };

  const openModal = () => {
    setPreviewChimeName(selectedChimeNameIsou);
    setPreviewChimePath(savedChimeIsouPath); // Use path from context
    setPreviewVolume(volumeIsou); // Use volume from context
    setModalVisible(true);
  };

  const handleSave = () => {
    if (soundInstance) {
      soundInstance.stop(() => {
        soundInstance.release();
         setSoundInstance(null);
      });
    }

    setSavedChimeIsouPath(previewChimePath);
    setVolumeIsou(previewVolume);
    setIsMusicPlaying(false);
    setModalVisible(false);
  };

  const handleCloseWithoutSaving = () => {
    if (soundInstance) {
      soundInstance.stop(() => {
        soundInstance.release();
         setSoundInstance(null);
      }); 
    }
    setIsMusicPlaying(false);
    setModalVisible(false);
  };

  const handleChimeSelection = chime => {
    setPreviewChimeName(chime.label);
    setPreviewChimePath(chime.value);
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
          borderColor: '#74aff7', 
        },
      ];
    }
    return baseStyle;
  };

  const playTestSound = () => {
  if (!previewChimePath) return;

  // Stop and release any current sound before playing a new one
  if (soundInstance) {
    soundInstance.stop(() => {
      soundInstance.release();
      setSoundInstance(null); // Important: remove the reference
      playNewSound();         // Then play the new one
    });
  } else {
    playNewSound();
  }
};

const playNewSound = () => {
  const sound = new Sound(previewChimePath, null, error => {
    if (error) {
      console.error('Error loading sound:', error);
      return;
    }

    sound.setVolume(previewVolume);
    setSoundInstance(sound);
    setIsMusicPlaying(true); // Disable slider

    sound.play(success => {
      sound.release();
      setIsMusicPlaying(false); // Re-enable slider after done
      setSoundInstance(null);
    });
  });
};


  const chimesToDisplay =
    availableChimes[selectedCategory] || availableChimes.All;

  // When the path changes from anywhere (e.g., loading a preset),
  // this effect finds the matching chime and updates the name in the context.
  useEffect(() => {
    const chime = availableChimes.All.find(c => c.value === savedChimeIsouPath);
    if (chime && chime.label !== selectedChimeNameIsou) {
      setSelectedChimeNameIsou(chime.label);
    }
  }, [savedChimeIsouPath]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => openModal()} style={styles.button}>
        <Text>
          <Text style={[styles.buttonText, styles.labelText]}>
            Selected Interval:{' '}
          </Text>
          <Text style={styles.buttonText}>
            {selectedChimeNameIsou || 'None'}
          </Text>
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
                  Choose your interval sound
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
                    style={getCategoryButtonStyle('Instrument')}
                    onPress={() => handleCategoryChange('Instrument')}>
                    <Text style={styles.categoryButtonText}>Instrument</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={getCategoryButtonStyle('Special')}
                    onPress={() => handleCategoryChange('Special')}>
                    <Text style={styles.categoryButtonText}>Special</Text>
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
                            previewChimePath === chime.value &&
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
                  Volume: {Math.round(previewVolume * 100)}%
                </Text>
                <View style={styles.volumeContainer}>
                  <Icon
                    name="volume-low-outline"
                    size={iconSize}
                    color="#ffffff"
                    style={styles.icon}
                  />
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    value={previewVolume}
                    onValueChange={value => setPreviewVolume(value)}
                    minimumTrackTintColor="#74aff7"
                    maximumTrackTintColor="#ffffff"
                    thumbTintColor="#74aff7"
                    disabled={isMusicPlaying}
                  />
                  <Icon
                    name="volume-high-outline"
                    size={24}
                    color="#ffffff"
                    style={styles.icon}
                  />
                </View>

                {/* Buttons */}
                <View style={styles.buttonRowContainer}>
                  <TouchableOpacity
                    style={styles.testButton}
                    onPress={playTestSound}>
                    <Text style={styles.testButtonText}>Test Sound</Text>
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
    marginBottom: '3%',
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
export default IntervalBellSelector2;
