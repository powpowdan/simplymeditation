import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'; 
import useAsyncStorage from '../hooks/useAsyncStorage'; // Import the custom hook

const MusicSwitchContext = createContext();

export function MusicSwitchProvider({ children }) {
  const [musicSwitchState, setMusicSwitchState] = useAsyncStorage('musicSwitchState', false);
  const [intervalBellsSwitchState, setIntervalBellsSwitchState] = useAsyncStorage('intervalBellsSwitchState', false);
  const [interval25Active, setInterval25Active] = useAsyncStorage('interval25Active', false);
  const [interval50Active, setInterval50Active] = useAsyncStorage('interval50Active', false);
  const [interval75Active, setInterval75Active] = useAsyncStorage('interval75Active', false);
  const [interval90Active, setInterval90Active] = useAsyncStorage('interval90Active', false);
  const [adjustmentSwitchState, setAdjustmentSwitchState] = useAsyncStorage('adjustmentSwitchState', false);
  const [adjustmentValue, setAdjustmentValue] = useAsyncStorage('adjustmentValue', 0);
 

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
