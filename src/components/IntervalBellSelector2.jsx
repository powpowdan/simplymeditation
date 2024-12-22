import React, { useState, useEffect } from 'react';
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

const IntervalBellSelector = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
 
  const [selectedSongPathIsou, setselectedSongPathIsou] = useState(null); //value path to music   
  const {savedChimeIsouPath, setSavedChimeIsouPath}= useMusicSwitchContext(); // To store the saved chime(path) 
  const {savedChimeIsou, setSavedChimeIsou}= useMusicSwitchContext(); // To store the saved chime(path) and volumeIsou
  const {selectedChimeNameIsou, setSelectedChimeNameIsou} = useMusicSwitchContext();
  const {volumeIsou, setVolumeIsou} = useMusicSwitchContext(); 


  const availableChimes = {
    Nature: [
      {label: 'Winter gust', value: 'audio_file49.mp3'},
      {label: 'Ocean wave slow', value: 'audio_file48.mp3'},
      {label: 'Ocean wave fast', value: 'audio_file46.mp3'},
      {label: 'Rainfall', value: 'audio_file47.mp3'},
      {label: 'Owl', value: 'audio_file45.mp3'},
      {label: 'Thunder', value: 'audio_file44.mp3'}, 
      {label: 'palceholder1', value: 'audio_file412313.mp3'},
      {label: 'palceholder12', value: 'audio_file41235.mp3'},
      {label: 'palceholder13', value: 'audio_file4123134.mp3'},
     
    ],
    Special: [
      {label: 'Air Woosh', value: 'audio_file43.mp3'},
      {label: 'Fading shimmer', value: 'audio_file39.mp3'}, 
      {label: 'Deep breath', value: 'audio_file32.mp3'},   
      {label: 'Quick shimmer', value: 'audio_file37.mp3'}, 
      {label: 'Harp', value: 'audio_file29.mp3'}, 
      {label: 'Cave notes', value: 'audio_file28.mp3'}, //delete
      {label: 'Reverse gong', value: 'audio_file23.mp3'}, //delete
      {label: '3 tech notes', value: 'audio_file22.mp3'}, //delete
      {label: 'Gong shimmer bell', value: 'audio_file16.mp3'}, 
      {label: 'Shimmering', value: 'audio_file3.mp3'}, 

 
    ],
    Instrument: [
      {label: 'Gong', value: 'audio_file31.mp3'},
      {label: 'Gong 2', value: 'audio_file24.mp3'},
      {label: 'Gong 3', value: 'audio_file21.mp3'},
      {label: 'Gong 4', value: 'audio_file6.mp3'},
      {label: 'Gong - short', value: 'audio_file18.mp3'},
      {label: 'Gong - long', value: 'audio_file41.mp3'}, 
      {label: 'Gong - light', value: 'audio_file15.mp3'}, 
      {label: 'Gong - light 2', value: 'audio_file14.mp3'}, 
      {label: 'Gong - shallow', value: 'audio_file25.mp3'}, 
      {label: 'Gong - Intense', value: 'audio_file17.mp3'}, 
      {label: 'Gong - Reverberate', value: 'audio_file13.mp3'}, 
      {label: 'Gong - long start', value: 'audio_file2.mp3'}, //better for chime
      {label: 'Classic start', value: 'audio_file.mp3'}, //classic start

      {label: 'Deep drum', value: 'audio_file30.mp3'}, 
      {label: 'Flute - long', value: 'audio_file38.mp3'}, 
      {label: 'Chime', value: 'audio_file40.mp3'}, 
      {label: 'Chime 2', value: 'audio_file10.mp3'}, 
      {label: 'Chime - very long', value: 'audio_file19.mp3'}, //better for chime
      {label: 'Chime - sharp', value: 'audio_file33.mp3'}, 
      {label: 'Chime - short', value: 'audio_file35.mp3'}, 
      {label: 'Chimes ringing - short', value: 'audio_file34.mp3'}, 
      {label: 'Bell - short', value: 'audio_file7.mp3'},  
      {label: 'Bell - long 2', value: 'audio_file36.mp3'}, 
      {label: 'Bell - Church', value: 'audio_file27.mp3'}, 
      {label: 'Bell - Quick', value: 'audio_file26.mp3'}, 
    ],
    All: [

      {label: 'Deep drum', value: 'audio_file30.mp3'}, 
      {label: 'Flute - long', value: 'audio_file38.mp3'}, 
      {label: 'Chime', value: 'audio_file40.mp3'},  
      {label: 'Chime 2', value: 'audio_file10.mp3'}, 
      {label: 'Chime - very long', value: 'audio_file19.mp3'}, //better for chime
      {label: 'Chime - sharp', value: 'audio_file33.mp3'}, 
      {label: 'Chime - short', value: 'audio_file35.mp3'}, 
      {label: 'Chimes ringing - short', value: 'audio_file34.mp3'}, 
      {label: 'Bell - short', value: 'audio_file7.mp3'},  
      {label: 'Bell - long 2', value: 'audio_file36.mp3'}, 
      {label: 'Bell - Church', value: 'audio_file27.mp3'}, 
      {label: 'Bell - Quick', value: 'audio_file26.mp3'}, 

      {label: 'Winter gust', value: 'audio_file49.mp3'},
      {label: 'Ocean wave slow', value: 'audio_file48.mp3'},
      {label: 'Ocean wave fast', value: 'audio_file46.mp3'},
      {label: 'Rainfall', value: 'audio_file47.mp3'},
      {label: 'Owl', value: 'audio_file45.mp3'},
      {label: 'Thunder', value: 'audio_file44.mp3'},

      {label: 'palceholder1', value: 'audio_file412313.mp3'},
      {label: 'palceholder12', value: 'audio_file41235.mp3'},
      {label: 'palceholder13', value: 'audio_file4123134.mp3'},

      {label: 'Gong', value: 'audio_file31.mp3'},
      {label: 'Gong 2', value: 'audio_file24.mp3'},
      {label: 'Gong 3', value: 'audio_file21.mp3'},
      {label: 'Gong 4', value: 'audio_file6.mp3'},
      {label: 'Gong - short', value: 'audio_file18.mp3'},
      {label: 'Gong - long', value: 'audio_file41.mp3'}, 
      {label: 'Gong - light', value: 'audio_file15.mp3'}, 
      {label: 'Gong - light 2', value: 'audio_file14.mp3'}, 
      {label: 'Gong - shallow', value: 'audio_file25.mp3'}, 
      {label: 'Gong - Intense', value: 'audio_file17.mp3'}, 
      {label: 'Gong - Reverberate', value: 'audio_file13.mp3'}, 
      {label: 'Gong - long start', value: 'audio_file2.mp3'}, //better for chime
      {label: 'Classic start', value: 'audio_file.mp3'}, //classic start

      {label: 'Air Woosh', value: 'audio_file43.mp3'},
      {label: 'Fading shimmer', value: 'audio_file39.mp3'}, 
      {label: 'Deep breath', value: 'audio_file32.mp3'}, 
      {label: 'Quick shimmer', value: 'audio_file37.mp3'}, 
      {label: 'Harp', value: 'audio_file29.mp3'}, 
      {label: 'Cave notes', value: 'audio_file28.mp3'}, //delete
      {label: 'Reverse gong', value: 'audio_file23.mp3'}, //delete
      {label: '3 tech notes', value: 'audio_file22.mp3'}, //delete
      {label: 'Gong shimmer bell', value: 'audio_file16.mp3'}, 
      {label: 'Shimmering', value: 'audio_file3.mp3'}, 

    
    ],
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => { 
    setSavedChimeIsou(JSON.stringify({ chime: { label: selectedChimeNameIsou, value: selectedSongPathIsou }, volumeIsou })); 
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
    const sound = new Sound(selectedSongPathIsou, null, error => {
      if (error) {
        console.error('Error loading sound:', error);
        return;
      }
    //   console.log(`Playing test sound for: ${selectedSongPathIsou} at volumeIsou ${volumeIsou}`);
      sound.setVolume(volumeIsou);
      sound.play(() => sound.release());
    });
  };

  
  const chimesToDisplay =
    availableChimes[selectedCategory] || availableChimes.All;

    useEffect(() => {
      if (savedChimeIsou) {
        const savedChimeData = JSON.parse(savedChimeIsou);
        setSelectedChimeNameIsou(savedChimeData?.chime?.label || null);
        setselectedSongPathIsou(savedChimeData?.chime?.value || null);
        setVolumeIsou(savedChimeData?.volumeIsou || .8);
      }
    }, [savedChimeIsou]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => openModal()} style={styles.button}>
        <Text style={styles.buttonText}>
          Selected Chime: {selectedChimeNameIsou || 'None'}
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
                        selectedSongPathIsou === chime.value && styles.filledCircle,
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
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={volumeIsou}
              onValueChange={value => setVolumeIsou(value)}
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
export default IntervalBellSelector;
