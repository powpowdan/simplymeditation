import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import {useMusicSwitchContext} from '../context/MusicSwitchContext';
import ChimeSelector2 from '../components/ChimeSelector2';
import BgMusicSelector from '../components/BgMusicSelector';
import IntervalBellSelector2 from '../components/IntervalBellSelector2';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

  const toggleSwitchWithAnimation = setter => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setter(prevState => !prevState);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Options</Text>

      <View style={styles.optionContainer}>
        <Text style={styles.Titleoptions}>Select your beginning/end chime</Text>
        <ChimeSelector2 />
      </View>

      <View style={styles.optionContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.Titleoptions}>Meditation Music</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Switch
              value={musicSwitchState}
              onValueChange={() =>
                toggleSwitchWithAnimation(setMusicSwitchState)
              }
            />
            <Text style={styles.toggleLabel}>
              {musicSwitchState ? 'ON' : 'OFF'}
            </Text>
          </View>
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
          <Text style={styles.Titleoptions}>Interval Bells</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Switch
              value={intervalBellsSwitchState}
              onValueChange={() =>
                toggleSwitchWithAnimation(setIntervalBellsSwitchState)
              }
            />
            <Text style={styles.toggleLabel}>
              {intervalBellsSwitchState ? 'ON' : 'OFF'}
            </Text>
          </View>
        </View>
        {intervalBellsSwitchState && (
          <View style={styles.innerContainer}>
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
                  <Switch
                    value={active}
                    onValueChange={() => toggleSwitchWithAnimation(toggle)}
                  />
                  <Text
                    style={[
                      styles.switchText,
                      active && styles.switchTextActive,
                    ]}>
                    {label}
                  </Text>
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
                  <Switch
                    value={active}
                    onValueChange={() => toggleSwitchWithAnimation(toggle)}
                  />
                  <Text
                    style={[
                      styles.switchText,
                      active && styles.switchTextActive,
                    ]}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.optionContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.Titleoptions}>Randomize timer</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Switch
              value={adjustmentSwitchState}
              onValueChange={() =>
                toggleSwitchWithAnimation(toggleAdjustmentSwitch)
              }
            />
            <Text style={styles.toggleLabel}>
              {adjustmentSwitchState ? 'ON' : 'OFF'}
            </Text>
          </View>
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
    padding: 20,
  },
  headerText: {
    fontSize: 27,
    color: '#74aff7',
    paddingTop: '4%',
    paddingBottom: 20,
    textAlign: 'center',
  },
  optionContainer: {
    width: '100%',
    marginBottom: 20,
    padding: 15,
    borderWidth: 0.8,
    borderColor: '#74aff7',
    borderRadius: 10,
    backgroundColor: '#1A1F26',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 5,
  },
  Titleoptions: {
    fontSize: 18,
    color: '#fff',
  },
  options: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 10,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#74aff7',
    marginLeft: 10,
  },
  innerContainer: {
    marginTop: 10,
    padding: 10,
    borderColor: '#74aff7',
    borderRadius: 8,
    backgroundColor: '#272B30',
  },
  bellOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchText: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 14,
  },
  switchTextActive: {
    color: '#74aff7',
  },
});

export default OptionsScreen;
