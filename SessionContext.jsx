import React, { createContext, useState, useContext } from 'react';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [totalTimeMeditated, setTotalTimeMeditated] = useState(0);

  const addMeditationTime = (minutes) => {
    setTotalTimeMeditated((prevTotalTime) => prevTotalTime + minutes);
  };

  return (
    <SessionContext.Provider value={{ totalTimeMeditated, addMeditationTime }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}
