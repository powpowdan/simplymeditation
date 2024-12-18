import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Sound from 'react-native-sound';
import {useMusicSwitchContext} from '../context/MusicSwitchContext';
import DropDownPicker from 'react-native-dropdown-picker'; 

const ChimeSelector = () => {
  const soundOptions = [
    {id: '1', label: 'Bells', value: 'bell'},
    {id: '2', label: 'Gongs', value: 'gong'},
    {id: '3', label: 'Nature', value: 'nature'},
    {id: '4', label: 'Other', value: 'other'},
    {id: '5', label: 'Classic Bell', value: 'audio_file.mp3', parent: 'bell'},
    {id: '6', label: 'Gong', value: 'audio_file2.mp3', parent: 'gong'},
    {
      id: '7',
      label: 'Magic Windchimes',
      value: 'audio_file3.mp3',
      parent: 'other',
    },
    {id: '8', label: 'Bell Minor', value: 'audio_file4.mp3', parent: 'bell'},
    {id: '9', label: 'Light Gong', value: 'audio_file5.mp3', parent: 'gong'},
    {id: '10', label: 'Gong 6', value: 'audio_file6.mp3', parent: 'gong'},
    {id: '11', label: 'Light Bell', value: 'audio_file7.mp3', parent: 'bell'},
    {id: '12', label: 'Gong Flat', value: 'audio_file8.mp3', parent: 'gong'},
    {id: '13', label: 'Sharp Bell', value: 'audio_file9.mp3', parent: 'bell'},
    {id: '14', label: 'Subtle Bell', value: 'audio_file10.mp3', parent: 'bell'},
    {
      id: '15',
      label: 'Deep Short Gong',
      value: 'audio_file13.mp3',
      parent: 'gong',
    },
    {id: '16', label: 'Tiny Gong', value: 'audio_file14.mp3', parent: 'gong'},
    {id: '17', label: 'Silent Gong', value: 'audio_file15.mp3', parent: 'gong'},
    {
      id: '18',
      label: 'Shimmering Gong',
      value: 'audio_file16.mp3',
      parent: 'gong',
    },
    {id: '19', label: 'Hit Gong', value: 'audio_file17.mp3', parent: 'gong'},
    {id: '20', label: 'Gong 3', value: 'audio_file18.mp3', parent: 'gong'},
    {id: '21', label: 'Bell 17s', value: 'audio_file19.mp3', parent: 'bell'},
    {
      id: '22',
      label: 'Chinese Gong',
      value: 'audio_file20.mp3',
      parent: 'gong',
    },
    {
      id: '23',
      label: 'Very Light Gong',
      value: 'audio_file21.mp3',
      parent: 'gong',
    },
    {id: '24', label: 'Tech Bell', value: 'audio_file22.mp3', parent: 'bell'},
    {
      id: '25',
      label: 'Reverse Gong',
      value: 'audio_file23.mp3',
      parent: 'gong',
    },
    {
      id: '26',
      label: 'Peaceful Bell',
      value: 'audio_file24.mp3',
      parent: 'bell',
    },
    {id: '27', label: 'Xylophone', value: 'audio_file25.mp3', parent: 'other'},
    {
      id: '28',
      label: 'Small Gong Bell',
      value: 'audio_file26.mp3',
      parent: 'bell',
    },
    {
      id: '29',
      label: 'Zen Tone Deep',
      value: 'audio_file27.mp3',
      parent: 'other',
    },
    {
      id: '30',
      label: 'Kayagum Gongs',
      value: 'audio_file28.mp3',
      parent: 'gong',
    },
    {id: '31', label: 'Tank Drum', value: 'audio_file29.mp3', parent: 'other'},
    {id: '32', label: 'Dhumm', value: 'audio_file30.mp3', parent: 'other'},
    {
      id: '33',
      label: 'Classic Gong',
      value: 'audio_file31.mp3',
      parent: 'gong',
    },
    {
      id: '34',
      label: 'Deep Breath',
      value: 'audio_file32.mp3',
      parent: 'other',
    },
    {id: '35', label: 'Sharp Bell', value: 'audio_file33.mp3', parent: 'bell'},
    {
      id: '36',
      label: 'Soft Wind Chimes',
      value: 'audio_file34.mp3',
      parent: 'other',
    },
    {
      id: '37',
      label: 'Zen Short Gong',
      value: 'audio_file35.mp3',
      parent: 'gong',
    },
    {
      id: '38',
      label: 'Singing Bowl',
      value: 'audio_file36.mp3',
      parent: 'other',
    },
    {
      id: '39',
      label: 'Mystic Chime',
      value: 'audio_file37.mp3',
      parent: 'other',
    },
    {id: '40', label: 'Pan Flute', value: 'audio_file38.mp3', parent: 'other'},
    {id: '41', label: 'Magic Zen', value: 'audio_file39.mp3', parent: 'other'},
    {
      id: '42',
      label: 'Deep Copper Bell',
      value: 'audio_file40.mp3',
      parent: 'bell',
    },
    {
      id: '43',
      label: 'Softest Gong',
      value: 'audio_file41.mp3',
      parent: 'gong',
    },
    {
      id: '44',
      label: 'White Noise',
      value: 'audio_file42.mp3',
      parent: 'other',
    },
    {id: '45', label: 'Woosh', value: 'audio_file43.mp3', parent: 'other'},
    {id: '46', label: 'Thunder', value: 'audio_file44.mp3', parent: 'nature'},
    {id: '47', label: 'Owl', value: 'audio_file45.mp3', parent: 'nature'},
    {
      id: '48',
      label: 'Ocean Wave',
      value: 'audio_file46.mp3',
      parent: 'nature',
    },
    {
      id: '49',
      label: 'Heavy Rain Drops',
      value: 'audio_file47.mp3',
      parent: 'nature',
    },
    {
      id: '50',
      label: 'Slow Ocean Wave',
      value: 'audio_file48.mp3',
      parent: 'nature',
    },
    {id: '51', label: 'Wind', value: 'audio_file49.mp3', parent: 'nature'},
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
    <View>
      <Text style={styles.heading}>Choose a Tone</Text>

      <View style={styles.row}>
       
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
              position: 'absolute',
            }}
            textStyle={styles.closedDropdownText} // font 18 
            placeholderStyle={styles.placeholderStyle}
            maxHeight={maxDropdownHeight}
            listItemLabelStyle={styles.dropdownListItemText}
            searchable={true}
            closeOnBackPressed={true}
            // autoScroll={true}
            itemSeparator={true}
            stickyHeader={true}
            categorySelectable={false}
            listItemContainerStyle={{
              height: 50,
            }}
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
    marginLeft: '-15%',
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
  closedDropdownText: {
    color: '#FFFFFF',
    fontSize: 14, // Smaller text for closed dropdown
  },
  dropdownListItemText: {
    fontSize: 20,  // Larger font size when expanded
    color: '#FFFFFF',
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  placeholderStyle: {},
});

export default ChimeSelector;
