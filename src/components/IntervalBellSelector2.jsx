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

const IntervalBellSelector = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [selectedSongPathIsou, setselectedSongPathIsou] = useState(null); //value path to music
  const {savedChimeIsouPath, setSavedChimeIsouPath} = useMusicSwitchContext(); // To store the saved chime(path)
  const {savedChimeIsou, setSavedChimeIsou} = useMusicSwitchContext(); // To store the saved chime(path) and volumeIsou
  const {selectedChimeNameIsou, setSelectedChimeNameIsou} =
    useMusicSwitchContext();
  const {volumeIsou, setVolumeIsou} = useMusicSwitchContext();

  const [soundInstance, setSoundInstance] = useState(null);

   const availableChimes = {
    Nature: [
      {label: 'Ocean wave fast', value: 'audio_file46.mp3'},
      {label: 'Owl', value: 'audio_file45.mp3'},
      {label: 'Rainfall', value: 'audio_file47.mp3'},
      {label: 'Thunder', value: 'audio_file44.mp3'},
      {label: 'Winter gust', value: 'audio_file49.mp3'}
    ],
    Special: [
      {label: 'Air Woosh', value: 'audio_file43.mp3'}, 
      {label: 'Deep breath', value: 'audio_file32.mp3'},
      {label: 'Gong shimmer', value: 'audio_file16.mp3'},
      {label: 'Harp', value: 'audio_file29.mp3'}, 
      {label: 'Shimmering', value: 'audio_file3.mp3'},
      {label: 'Quick shimmer', value: 'audio_file37.mp3'}, 
    ],
    Instrument: [
      {label: 'Classic start', value: 'audio_file.mp3'},
      {label: 'Bell', value: 'audio_file7.mp3'}, 
      {label: 'Bell - church', value: 'audio_file27.mp3'},
      {label: 'Bell - long', value: 'audio_file36.mp3'},
      {label: 'Bell - quick', value: 'audio_file26.mp3'}, 
      {label: 'Chime', value: 'audio_file40.mp3'},
      {label: 'Chime 2', value: 'audio_file10.mp3'},
      {label: 'Chime - sharp', value: 'audio_file33.mp3'}, 
      {label: 'Deep drum', value: 'audio_file30.mp3'},
      {label: 'Flute', value: 'audio_file38.mp3'},
      {label: 'Tiny bells', value: 'audio_file34.mp3'},
      {label: 'Gong', value: 'audio_file24.mp3'},
      {label: 'Gong 2', value: 'audio_file6.mp3'},
      {label: 'Gong - intense', value: 'audio_file17.mp3'},
      {label: 'Gong - light', value: 'audio_file14.mp3'},
      {label: 'Gong - long', value: 'audio_file41.mp3'},
      {label: 'Gong - Thai temple', value: 'audio_file2.mp3'},
      {label: 'Gong - reverberate', value: 'audio_file13.mp3'},
      {label: 'Gong - shallow', value: 'audio_file25.mp3'},
      {label: 'Gong - short', value: 'audio_file18.mp3'}
],
    All: [
      {label: 'Classic start', value: 'audio_file.mp3'},
      {label: 'Air Woosh', value: 'audio_file43.mp3'},
      {label: 'Bell - Church', value: 'audio_file27.mp3'},
      {label: 'Bell - long 2', value: 'audio_file36.mp3'},
      {label: 'Bell - Quick', value: 'audio_file26.mp3'},
      {label: 'Bell - short', value: 'audio_file7.mp3'},
      {label: 'Chime', value: 'audio_file40.mp3'},
      {label: 'Chime 2', value: 'audio_file10.mp3'},
      {label: 'Chime - sharp', value: 'audio_file33.mp3'},
      {label: 'Chimes ringing - short', value: 'audio_file34.mp3'}, 
      {label: 'Deep breath', value: 'audio_file32.mp3'},
      {label: 'Deep drum', value: 'audio_file30.mp3'},
      {label: 'Flute - long', value: 'audio_file38.mp3'},
      {label: 'Gong', value: 'audio_file31.mp3'},
      {label: 'Gong 2', value: 'audio_file24.mp3'},
      {label: 'Gong 4', value: 'audio_file6.mp3'},
      {label: 'Gong - Intense', value: 'audio_file17.mp3'},
      {label: 'Gong - light', value: 'audio_file15.mp3'},
      {label: 'Gong - light 2', value: 'audio_file14.mp3'},
      {label: 'Gong - long', value: 'audio_file41.mp3'},
      {label: 'Gong - long start', value: 'audio_file2.mp3'},
      {label: 'Gong - Reverberate', value: 'audio_file13.mp3'},
      {label: 'Gong - shallow', value: 'audio_file25.mp3'},
      {label: 'Gong - short', value: 'audio_file18.mp3'},
      {label: 'Gong shimmer bell', value: 'audio_file16.mp3'},
      {label: 'Harp', value: 'audio_file29.mp3'},
      {label: 'Ocean wave fast', value: 'audio_file46.mp3'}, 
      {label: 'Owl', value: 'audio_file45.mp3'}, 
      {label: 'Quick shimmer', value: 'audio_file37.mp3'},
      {label: 'Rainfall', value: 'audio_file47.mp3'},
      {label: 'Shimmering', value: 'audio_file3.mp3'},
      {label: 'Thunder', value: 'audio_file44.mp3'},
      {label: 'Winter gust', value: 'audio_file49.mp3'}
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
    setSavedChimeIsou(
      JSON.stringify({
        chime: {label: selectedChimeNameIsou, value: selectedSongPathIsou},
        volumeIsou,
      }),
    );
    setSavedChimeIsouPath(selectedSongPathIsou);
    setModalVisible(false);
  };

  const handleChimeSelection = chime => {
    setselectedSongPathIsou(chime.value);
    setSelectedChimeNameIsou(chime.label);
  };

  const handleCategoryChange = category => {
    setSelectedCategory(category); // Set the selected category
  };

  const getCategoryButtonStyle = category => {
    const baseStyle = [styles.categoryButton, {borderColor: '#74aff7'}];
    if (category === selectedCategory) {
      return [
        ...baseStyle,
        {
          backgroundColor: '#74aff7',
          borderColor: '#74aff7', // Make the selected button's border and background the same color
        },
      ];
    }
    return baseStyle;
  };

  const playTestSound = () => {
    if (!selectedSongPathIsou) return;
    // Check if soundInstance exists and is playing
    if (soundInstance) {
      soundInstance.stop(() => {
        soundInstance.release(); // Release the old sound instance
      });
    }
    const sound = new Sound(selectedSongPathIsou, null, error => {
      if (error) {
        console.error('Error loading sound:', error);
        return;
      }
      sound.setVolume(volumeIsou);
      sound.play(() => sound.release());
      setSoundInstance(sound);
    });
  };

  const chimesToDisplay =
    availableChimes[selectedCategory] || availableChimes.All;

useEffect(() => {
  if (savedChimeIsou) {
    const savedChimeData = JSON.parse(savedChimeIsou);
    setSelectedChimeNameIsou(savedChimeData?.chime?.label || null);
    setselectedSongPathIsou(savedChimeData?.chime?.value || null);
    setVolumeIsou(savedChimeData?.volumeIsou || 0.8);
  } 
}, [savedChimeIsou]);

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
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose your interval sound</Text>

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
                        selectedSongPathIsou === chime.value &&
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
              Volume: {Math.round(volumeIsou * 100)}%
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
                value={volumeIsou}
                onValueChange={value => setVolumeIsou(value)}
                minimumTrackTintColor="#74aff7"
                maximumTrackTintColor="#ffffff"
                thumbTintColor="#74aff7"
              />

              <Icon
                name="volume-high-outline"
                size={24}
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
                <Text style={styles.testButtonText}>Test Sound</Text>
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
export default IntervalBellSelector;
