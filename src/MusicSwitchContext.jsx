import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MusicSwitchContext = createContext();

export function MusicSwitchProvider({ children }) {
  const [musicSwitchState, setMusicSwitchState] = useState(false);
  const [intervalBellsSwitchState, setIntervalBellsSwitchState] = useState(false);
  const [interval25Active, setInterval25Active] = useState(false);
  const [interval50Active, setInterval50Active] = useState(false);
  const [interval75Active, setInterval75Active] = useState(false);
  const [interval90Active, setInterval90Active] = useState(false);
  const [adjustmentSwitchState, setAdjustmentSwitchState] = useState(false);
  const [adjustmentValue, setAdjustmentValue] = useState(0);


  // const toggleIntervalBellsSwitchState = () => {
  //   setIntervalBellsSwitchState(!intervalBellsSwitchState);
  // };

  const toggleInterval25 = () => {
    setInterval25Active(!interval25Active);
  };

  const toggleInterval50 = () => {
    setInterval50Active(!interval50Active);
  };

  const toggleInterval75 = () => {
    setInterval75Active(!interval75Active);
  };

  const toggleInterval90 = () => {
    setInterval90Active(!interval90Active);
  };

  
  const toggleAdjustmentSwitch = () => {
    setAdjustmentSwitchState(!adjustmentSwitchState);
  };

  const setAdjustment = (value) => {
    setAdjustmentValue(value);
  };
 

  const contextValue = useMemo(() => {
    return {
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
      adjustmentValue,
      setAdjustment,
    }; 
  }, [musicSwitchState, intervalBellsSwitchState, interval25Active, interval50Active, interval75Active, interval90Active, adjustmentSwitchState,
    adjustmentValue,]);

  useEffect(() => {
    const loadState = async () => {
      try {
        const savedMusicSwitchState = await AsyncStorage.getItem('musicSwitchState');
        if (savedMusicSwitchState !== null) {
          setMusicSwitchState(JSON.parse(savedMusicSwitchState));
        }

        const savedIntervalMainState = await AsyncStorage.getItem('intervalBellsSwitchState');
        if (savedIntervalMainState !== null) {
          setIntervalBellsSwitchState(JSON.parse(savedIntervalMainState));
        }

        const savedInterval25State = await AsyncStorage.getItem('interval25Active');
        if (savedInterval25State !== null) {
          setInterval25Active(JSON.parse(savedInterval25State));
        }

        const savedInterval50State = await AsyncStorage.getItem('interval50Active');
        if (savedInterval50State !== null) {
          setInterval50Active(JSON.parse(savedInterval50State));
        }

        const savedInterval75State = await AsyncStorage.getItem('interval75Active');
        if (savedInterval75State !== null) {
          setInterval75Active(JSON.parse(savedInterval75State));
        }

        const savedInterval90State = await AsyncStorage.getItem('interval90Active');
        if (savedInterval90State !== null) {
          setInterval90Active(JSON.parse(savedInterval90State));
        }
        const savedAdjustmentSwitchState = await AsyncStorage.getItem('adjustmentSwitchState');
        if (savedAdjustmentSwitchState !== null) {
          setAdjustmentSwitchState(JSON.parse(savedAdjustmentSwitchState));
        }

        const savedAdjustmentValue = await AsyncStorage.getItem('adjustmentValue');
        if (savedAdjustmentValue !== null) {
          setAdjustmentValue(JSON.parse(savedAdjustmentValue));
        }
        
      } catch (error) {
        console.error('Error loading state from AsyncStorage:', error);
      }
    };

    loadState();
  }, []);

  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem('musicSwitchState', JSON.stringify(musicSwitchState)); 
        await AsyncStorage.setItem('intervalBellsSwitchState', JSON.stringify(intervalBellsSwitchState));
        await AsyncStorage.setItem('interval25Active', JSON.stringify(interval25Active));
        await AsyncStorage.setItem('interval50Active', JSON.stringify(interval50Active));
        await AsyncStorage.setItem('interval75Active', JSON.stringify(interval75Active));
        await AsyncStorage.setItem('interval90Active', JSON.stringify(interval90Active));
        await AsyncStorage.setItem('adjustmentSwitchState', JSON.stringify(adjustmentSwitchState));
        await AsyncStorage.setItem('adjustmentValue', JSON.stringify(adjustmentValue));
      } catch (error) {
        console.error('Error saving state to AsyncStorage:', error);
      }
    };

    saveState();
  }, [musicSwitchState, intervalBellsSwitchState, interval25Active, interval50Active, interval75Active, interval90Active, adjustmentSwitchState, adjustmentValue]);
 
  return (
    <MusicSwitchContext.Provider value={contextValue}>
      {children}
    </MusicSwitchContext.Provider>
  );
} 

export function useMusicSwitchContext() {
  const context = useContext(MusicSwitchContext);
  if (!context) {
    throw new Error('useMusicSwitchContext must be used within a MusicSwitchProvider');
  }
  return context;
} 
