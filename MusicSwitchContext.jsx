import React, { createContext, useContext, useState, useMemo } from 'react';

const MusicSwitchContext = createContext();

export function MusicSwitchProvider({ children }) {
  const [musicSwitchState, setMusicSwitchState] = useState(false);

  const contextValue = useMemo(() => {
    return {
      musicSwitchState,
      setMusicSwitchState,
    }; 
  }, [musicSwitchState]);

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
