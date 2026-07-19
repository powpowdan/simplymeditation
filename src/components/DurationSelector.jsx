import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';

const TimerButton = ({name, duration, onPress, onLongPress, disabled}) => (
  <TouchableOpacity
    style={[styles.timerButton, disabled && styles.timerButtonDisabled]}
    onPress={onPress}
    onLongPress={onLongPress}
    disabled={disabled}>
    <Text style={[styles.presetName, disabled && styles.colorBlackDisabled]}>{name}</Text>
    <Text style={[styles.presetDuration, disabled && styles.colorBlackDisabled]}>{duration} Mins</Text>
  </TouchableOpacity>
);

const DurationSelector = ({
  selectedDuration,
  handleTimerChange,
  handlePresetSelect,
  handleButtonLongPress,
  savedPresets,
  sliderDisabled,
}) => {
 // Extract the button durations and their keys dynamically from the prop
 const buttonConfig = Object.entries(savedPresets).map(([key, preset]) => ({
  key,
  name: preset.name,
  duration: preset.duration,
}));
 

  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.slidertext}>Choose your session length</Text>
      <View style={styles.sliderBackground}>
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
          disabled={sliderDisabled}
        />
      </View>
      <View style={styles.buttonGrid}>
        {buttonConfig.map((button) => (
          <TimerButton
            key={button.key}
            name={button.name}
            duration={button.duration}
            onPress={() => handlePresetSelect(button.key)}
            onLongPress={() => handleButtonLongPress(button.key)}
            disabled={sliderDisabled} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    width: '80%',
    alignItems: 'center',
  },
  slidertext: {
    marginTop: 20,
    textAlign: 'center',
    color: '#74aff7',
    marginBottom: 8,
  },
  sliderBackground: {
    width: '100%',
    height: 40,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    justifyContent: 'center',
    borderWidth: .5, //  outline
    borderColor: '#74aff7', 
  },
  slider: {
    width: '100%',
    height: 40,
  },
  colorBlack: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
  },
  presetName: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  presetDuration: {
    textAlign: 'center',
    color: '#ccc',
    fontSize: 12,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows buttons to wrap into multiple rows
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  timerButton: {
    width: '48%', // Ensures two buttons fit per row
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    borderRadius: 8,
    paddingVertical: 8,
    backgroundColor: '#1A1A1A',

    borderWidth: .5, //  outline
  borderColor: '#74aff7', 
  },
  colorBlackDisabled: {
    color: '#A7C8E7',  
  },
  //    timerButtonDisabled: {
  //     backgroundColor: '#97c2f7',
  //   },
});

export default DurationSelector;
