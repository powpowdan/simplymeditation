import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Sound from 'react-native-sound';
import {useMusicSwitchContext} from '../context/MusicSwitchContext';
import DropDownPicker from 'react-native-dropdown-picker';

const ChimeSelector = () => {
  const soundOptions = [
    {label: 'Bells', value: 'bell'},
    {label: 'Gongs', value: 'gong'},
    {label: 'Nature', value: 'nature'},
    {label: 'Other', value: 'other'},
    {label: 'classic Bell', value: 'audio_file.mp3', parent: 'bell'},
    {label: 'gong', value: 'audio_file2.mp3', parent: 'gong'},
    {label: 'magic windchimes', value: 'audio_file3.mp3', parent: 'other'},
    {label: 'bell minor', value: 'audio_file4.mp3', parent: 'bell'},
    {label: 'light gong', value: 'audio_file5.mp3', parent: 'gong'},
    {label: 'gong 6', value: 'audio_file6.mp3', parent: 'gong'},
    {label: 'light bell', value: 'audio_file7.mp3', parent: 'bell'},
    {label: 'gong flat', value: 'audio_file8.mp3', parent: 'gong'},
    {label: 'sharp bell', value: 'audio_file9.mp3', parent: 'bell'},
    {label: 'subtle bell', value: 'audio_file10.mp3', parent: 'bell'},
    {label: 'deep short gong', value: 'audio_file13.mp3', parent: 'gong'},
    {label: 'tiny gong', value: 'audio_file14.mp3', parent: 'gong'},
    {label: 'silent gong', value: 'audio_file15.mp3', parent: 'gong'},
    {label: 'shimering gong', value: 'audio_file16.mp3', parent: 'gong'},
    {label: 'hit gong', value: 'audio_file17.mp3', parent: 'gong'},
    {label: 'gong 3', value: 'audio_file18.mp3', parent: 'gong'},
    {label: 'bell 17s', value: 'audio_file19.mp3', parent: 'bell'},
    {label: 'chinese gong', value: 'audio_file20.mp3', parent: 'gong'},
    {label: 'very light gong', value: 'audio_file21.mp3', parent: 'gong'},
    {label: 'tech bell', value: 'audio_file22.mp3', parent: 'bell'},
    {label: 'reverse gong', value: 'audio_file23.mp3', parent: 'gong'},
    {label: 'peaceful bell', value: 'audio_file24.mp3', parent: 'bell'},
    {label: 'xylophone', value: 'audio_file25.mp3', parent: 'other'},
    {label: 'small gong bell', value: 'audio_file26.mp3', parent: 'bell'},
    {label: 'zen tone deep', value: 'audio_file27.mp3', parent: 'other'},
    {label: 'kayagum gongs', value: 'audio_file28.mp3', parent: 'gong'},
    {label: 'tank drum ', value: 'audio_file29.mp3', parent: 'other'},
    {label: 'dhumm', value: 'audio_file30.mp3', parent: 'other'},
    {label: 'classic gong', value: 'audio_file31.mp3', parent: 'gong'},
    {label: 'deep breath', value: 'audio_file32.mp3', parent: 'other'},
    {label: 'sharp bell', value: 'audio_file33.mp3', parent: 'bell'},
    {label: 'soft wind chimes', value: 'audio_file34.mp3', parent: 'other'},
    {label: 'zen short gong', value: 'audio_file35.mp3', parent: 'gong'},
    {label: 'singing bowl', value: 'audio_file36.mp3', parent: 'other'},
    {label: 'mystic chime', value: 'audio_file37.mp3', parent: 'other'},
    {label: 'pan flute', value: 'audio_file38.mp3', parent: 'other'},
    {label: 'magic zen', value: 'audio_file39.mp3', parent: 'other'},
    {label: 'deep copper bell', value: 'audio_file40.mp3', parent: 'bell'},
    {label: 'softest gong', value: 'audio_file41.mp3', parent: 'gong'},
    {label: 'white noise', value: 'audio_file42.mp3', parent: 'other'},
    {label: 'woosh', value: 'audio_file43.mp3', parent: 'other'},
    {label: 'thunder', value: 'audio_file44.mp3', parent: 'nature'},
    {label: 'owl', value: 'audio_file45.mp3', parent: 'nature'},
    {label: 'ocean wave', value: 'audio_file46.mp3', parent: 'nature'},
    {label: 'heavy rain drops', value: 'audio_file47.mp3', parent: 'nature'},
    {label: 'slow ocean wave', value: 'audio_file48.mp3', parent: 'nature'},
    {label: 'wind', value: 'audio_file49.mp3', parent: 'nature'},
  ];

  const {selectedTone, setSelectedTone} = useMusicSwitchContext();
  const [open, setOpen] = useState(false); // Control dropdown visibility
  const [items, setItems] = useState(soundOptions); // Items for dropdown

  //temporary adjustment for dropdown window height hardcoded
  const { intervalBellsSwitchState, musicSwitchState } = useMusicSwitchContext(); 
  let maxDropdownHeight;

  if (intervalBellsSwitchState && musicSwitchState) {
    maxDropdownHeight = 475;  // Both states are true
  } else if (intervalBellsSwitchState && !musicSwitchState) {
    maxDropdownHeight = 435;  // Only intervalBellsSwitchState is open
  } else if (!intervalBellsSwitchState && musicSwitchState) {
    maxDropdownHeight = 380;  // Only musicSwitchState is open
  } else {
    maxDropdownHeight = 380;  // Neither state is active
  }
 
  // Play the selected tone
  const playTone = () => {
    if (!selectedTone) return;
    const sound = new Sound(selectedTone, null, error => {
      if (error) {
        console.error('Error loading sound:', error);
        return;
      }
      sound.play(() => sound.release());
    });
  };

  DropDownPicker.setTheme('DARK');
  return (
    <View > 
      <Text style={styles.heading}>Choose a Tone</Text>

      <View style={styles.row} > 
        <DropDownPicker
          open={open}
          value={selectedTone}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedTone}
          setItems={setItems}
          placeholder="Select a tone"
          style={styles.dropdown}
        dropDownContainerStyle={{
          ...styles.dropdownContainer,
          zIndex: open ? 9000 : 1000,
          position: 'absolute'
        }}
          textStyle={styles.dropdownText}
          placeholderStyle={styles.placeholderStyle}
          maxHeight={maxDropdownHeight}
          searchable={true}
          closeOnBackPressed={true} 
          // autoScroll={true}
          itemSeparator={true}
          stickyHeader={true}
          categorySelectable={false}
          listParentLabelStyle={{
            color: '#74aff7',
          }}
          listParentContainerStyle={{
            backgroundColor: '#1A1F26',
          }}
          searchPlaceholder="Search for sounds"
        />
          <TouchableOpacity style={styles.button} onPress={playTone}>
          <Text style={styles.buttonText}>Test Sound</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '55%', 
    marginRight: '24%',
    
  },
  picker: {
    width: 150,
  },
  button: {
    backgroundColor: '#1A1F26',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#74aff7',
    marginLeft: '-15%'
  },
  buttonText: {
    color: '#FFFFFF',
  },
  dropdown: {
    backgroundColor: '#1A1F26',
    width: 154,
    borderColor: '#74aff7',
    borderWidth: 1,
    borderRadius: 0, 
  },
  dropdownContainer: {
    backgroundColor: '#1A1F26',
    borderColor: '#74aff7',
    width: 380,
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  placeholderStyle: {},
});

export default ChimeSelector;
