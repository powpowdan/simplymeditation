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

      <View>
        <Text style={styles.options}>Meditation Music</Text>
        <Switch value={musicSwitchState} onValueChange={setMusicSwitchState} />
        {musicSwitchState && (
          <View>
            <Text style={styles.options}>Choose your meditation music</Text>
            <BgMusicSelector />
          </View>
        )}
      </View>

      <View>
        <Text style={styles.bellOptions}>Interval Bells</Text>
        <Switch
          value={intervalBellsSwitchState}
          onValueChange={setIntervalBellsSwitchState}
        />
      </View>
      {/* if true show the bell switches */}
      {intervalBellsSwitchState && (
        <View style={styles.bellContainer}>
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

          <Text style={styles.options}>Select your Interval bell sounds</Text>
          <IntervalBellSelector2 />
        </View>
      )}

      <View>
        <Text style={styles.options}>Randomize timer</Text>
        <Switch
          value={adjustmentSwitchState}
          onValueChange={toggleAdjustmentSwitch}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121',
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    color: '#74aff7',
    paddingTop: 50,
    paddingBottom: 10,
    textAlign: 'center',
  },
  statText: {
    marginTop: 10,
  },
  options: {
    fontSize: 15,
    paddingTop: 20,
    marginBottom: 10,
  },
  bellOptions: {
    paddingTop: 20,
    marginBottom: 10,
  },
  bellContainer: {
    marginTop: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bellOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    color: '#ffffff',
    marginLeft: 10,
  },
  resetButtonContainer: {
    marginTop: 20,
  },
});

export default OptionsScreen;
