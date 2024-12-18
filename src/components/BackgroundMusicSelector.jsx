import React, {useState, useEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {useMusicSwitchContext} from '../context/MusicSwitchContext';
import Sound from 'react-native-sound';

const BackgroundMusicSelector = () => {
  const soundOptions = [
    {label: 'Monks', value: 'monks'},
    {label: 'Nature', value: 'nature'},
    {label: 'Hertz', value: 'hertz'},
    {label: 'Upbeat', value: 'upbeat'},
    {label: 'Other', value: 'other'},
    {label: 'Instrumental', value: 'instrument'},
    {label: 'Monks chanting 355 hz', value: 'now.mp3', parent: 'monks'},
    {
      label: 'Relaxing meditation music',
      value: 'relaxingmeditationmusic225173.mp3',
      parent: 'other',
    },
    {
      label: '432 hz alpha waves',
      value: 'hz432alphawaveshealtheholebodyspirit216473.mp3',
      parent: 'hertz',
    },
    {
      label: 'Calm river flowing',
      value: 'calmzenriverflowing228223.mp3',
      parent: 'nature',
    },
    {
      label: 'Om namah shivaya dhun',
      value: 'omnamahshivayadhun269789',
      parent: 'upbeat',
    },
    {
      label: 'Om ambient',
      value: 'omambientnoiseformeditation273938.mp3',
      parent: 'monks',
    },
    {
      label: 'Gentle wind',
      value: 'agentlebreezewind414681.mp3',
      parent: 'nature',
    },
    {
      label: 'Meditation hall at night',
      value: 'meditationhallatnight24956.mp3',
      parent: 'other',
    },
    {
      label: 'Tibetan singing bowls',
      value: 'tibetansingingbowlsbodydamagerepairhealbodysoul161797',
      parent: 'instrument',
    },
    {
      label: '528 hz ambient music',
      value: 'hz528frequencyambientmusic',
      parent: 'hertz',
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
      label: 'Om mani padme hum',
      value: 'ommanipadmehumchantsong271790.mp3',
      parent: 'upbeat',
    },
    {
      label: 'Mindfulness meditation music',
      value: 'mindful.mp3',
      parent: 'other',
    },
    {
      label: 'Nature forest stream birds',
      value: 'natureforestbirds.mp3',
      parent: 'nature',
    },
  ];

  const {selectedBgTone, setBgSelectedTone} = useMusicSwitchContext();
  const [open, setOpen] = useState(false); // Control dropdown visibility
  const [items, setItems] = useState(soundOptions); // Items for dropdown
 

  //temporary adjustment for dropdown window height hardcoded
  const { intervalBellsSwitchState } = useMusicSwitchContext();  
  const maxDropdownHeight = intervalBellsSwitchState ? 451 : 530;

  let currentSound = null;
  // Play the selected tone
  const playTone = () => {
    if (currentSound) {
      // If the sound is already playing, stop it
      currentSound.stop(() => {
        currentSound.release();
        currentSound = null;
        console.log('Tone playback stopped');
      });
    } else {
      // If the sound is not playing, start it
      if (!selectedBgTone) return;

      currentSound = new Sound(selectedBgTone, null, error => {
        if (error) {
          console.error('Error loading sound:', error);
          return;
        }
        currentSound.play(() => console.log('Tone playing for 5 seconds'));

        setTimeout(() => {
          if (currentSound) {
            currentSound.stop(() => {
              currentSound.release();

              currentSound = null;
            });
          }
        }, 10000);
      });
    }
  };
  DropDownPicker.setTheme('DARK');
  return (
    <View>
    
      <Text style={styles.heading}>Choose background music</Text> 
      <View style={styles.row}> 
        <DropDownPicker
          open={open}
          value={selectedBgTone}
          items={items}
          setOpen={setOpen}
          setValue={setBgSelectedTone}
          setItems={setItems}
          placeholder="Select Music"
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
          zIndex={2000}
          zIndexInverse={1000}
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
  buttonText: {
    color: '#FFFFFF', 
  },

  dropdownText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  placeholderStyle: {},
});

export default BackgroundMusicSelector;
