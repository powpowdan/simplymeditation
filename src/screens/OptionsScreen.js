import React from 'react';
import {View, Text, Switch, StyleSheet} from 'react-native';
import {useMusicSwitchContext} from '../context/MusicSwitchContext';
import ChimeSelector2 from '../components/ChimeSelector2';
import BgMusicSelector from '../components/BgMusicSelector';
import IntervalBellSelector2 from '../components/IntervalBellSelector2';

function OptionsScreen() {
  const {
    musicSwitchState,
    setMusicSwitchState,
    intervalBellsSwitchState,
    setIntervalBellsSwitchState,
    interval25Active,
    toggleInterval25,
    interval50Active,
    toggleInterval50,
    interval75Active,
    toggleInterval75,
    interval90Active,
    toggleInterval90,
    adjustmentSwitchState,
    toggleAdjustmentSwitch,
  } = useMusicSwitchContext();

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Options</Text>

      <View style={styles.optionContainer}>
        <Text style={styles.options}>Select your beginning/end chime</Text>
        <ChimeSelector2 />
      </View>

      <View style={styles.optionContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.options}>Meditation Music</Text>
          <Switch
            value={musicSwitchState}
            onValueChange={setMusicSwitchState}
          />
        </View>
        {musicSwitchState && (
          <View style={styles.innerContainer}>
            <Text style={styles.options}>Choose your meditation music</Text>
            <BgMusicSelector />
          </View>
        )}
      </View>

      <View style={styles.optionContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.bellOptions}>Interval Bells</Text>
          <Switch
            value={intervalBellsSwitchState}
            onValueChange={setIntervalBellsSwitchState}
          />
        </View>
      </View>

      {intervalBellsSwitchState && (
        <View style={styles.bellContainer}>
          <Text style={styles.options}>Select your Interval bell sounds</Text>

          <IntervalBellSelector2 />
          <View style={styles.rowContainer}>
            {[
              {
                active: interval25Active,
                label: '25% of session',
                toggle: toggleInterval25,
              },
              {
                active: interval50Active,
                label: '50% of session',
                toggle: toggleInterval50,
              },
            ].map(({active, label, toggle}) => (
              <View style={styles.bellOption} key={label}>
                <Switch value={active} onValueChange={toggle} />
                <Text style={styles.switchText}>{label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.rowContainer}>
            {[
              {
                active: interval75Active,
                label: '75% of session',
                toggle: toggleInterval75,
              },
              {
                active: interval90Active,
                label: '90% of session',
                toggle: toggleInterval90,
              },
            ].map(({active, label, toggle}) => (
              <View style={styles.bellOption} key={label}>
                <Switch value={active} onValueChange={toggle} />
                <Text style={styles.switchText}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.optionContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.options}>Randomize timer</Text>
          <Switch
            value={adjustmentSwitchState}
            onValueChange={toggleAdjustmentSwitch}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#212121',
    padding: 30, // Increased padding for better spacing
  },
  headerText: {
    fontSize: 24,
    color: '#74aff7',
    paddingTop: 50,
    paddingBottom: 20,
    textAlign: 'center',
  },
  optionContainer: {
    width: '100%', // Ensure container stretches to the screen width
    marginBottom: 20, // Consistent bottom margin for all sections
  },
  options: {
    fontSize: 15,
    color: '#fff', // Ensures text is visible on dark background
    marginBottom: 10,
  },
  bellOptions: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 10,
  },
  innerContainer: {
    marginTop: 10, // Add some space for nested components
  },
  bellContainer: {},
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Ensures text and switches are vertically aligned
    marginBottom: 15, // Added bottom margin to give space between rows
  },
  bellOption: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%', // Adjust width to ensure no overflow
  },
  switchText: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 14, // Ensure text size is readable and consistent
  },
  resetButtonContainer: {
    marginTop: 20,
  },
});

export default OptionsScreen;
