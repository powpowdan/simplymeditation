import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  Dimensions
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

const { width } = Dimensions.get('window');
const baseWidth = 411; // Pixel 4 XL baseline
const scale = width / baseWidth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#212121',
    padding: 20 * scale,
  },
  headerText: {
    fontSize: 27 * scale,
    color: '#74aff7',
    paddingTop: '4%',      // already relative — leave as-is
    paddingBottom: 20 * scale,
    textAlign: 'center',
  },
  optionContainer: {
    width: '100%',
    marginBottom: 20 * scale,
    padding: 15 * scale,
    borderWidth: 0.8,
    borderColor: '#74aff7',
    borderRadius: 10 * scale,
    backgroundColor: '#1A1F26',
  },
  Titleoptions: {
    fontSize: 18 * scale,
    color: '#fff',
  },
  options: {
    fontSize: 16 * scale,
    color: '#fff',
    marginBottom: 10 * scale,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14 * scale,
    color: '#74aff7',
    marginLeft: 10 * scale,
  },
  innerContainer: {
    marginTop: 10 * scale,
    padding: 10 * scale,
    borderColor: '#74aff7',
    borderRadius: 8 * scale,
    backgroundColor: '#272B30',
  },
  bellOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10 * scale,
  },
  switchText: {
    color: '#ffffff',
    marginLeft: 10 * scale,
    fontSize: 14 * scale,
  },
  switchTextActive: {
    color: '#74aff7',
  },
});

export default OptionsScreen;
