import React, { createContext, useContext, useState, useMemo } from 'react';

const MusicSwitchContext = createContext();

export function MusicSwitchProvider({ children }) {
  const [musicSwitchState, setMusicSwitchState] = useState(false);
  const [intervalBellsSwitchState, setIntervalBellsSwitchState] = useState(false);

  const contextValue = useMemo(() => {
    return {
      musicSwitchState,
      setMusicSwitchState,
      intervalBellsSwitchState,
      setIntervalBellsSwitchState,
    }; 
  }, [musicSwitchState, intervalBellsSwitchState]);

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
