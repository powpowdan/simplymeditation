import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [totalTimeMeditated, setTotalTimeMeditated] = useState(0);

  const addMeditationTime = (minutes) => {
    setTotalTimeMeditated((prevTotal) => prevTotal + minutes);
  };

  useEffect(() => {
    const loadTotalTimeMeditated = async () => {
      try {
        const storedTotalTime = await AsyncStorage.getItem('totalTimeMeditated');
        if (storedTotalTime !== null) {
          setTotalTimeMeditated(parseInt(storedTotalTime));
        }
      } catch (error) {
        console.error('Error loading totalTimeMeditated:', error);
      }
    };

    loadTotalTimeMeditated();
  }, []);

  useEffect(() => {
    const storeTotalTimeMeditated = async () => {
      try {
        await AsyncStorage.setItem('totalTimeMeditated', totalTimeMeditated.toString());
      } catch (error) {
        console.error('Error storing totalTimeMeditated:', error);
      }
    };

    storeTotalTimeMeditated();
  }, [totalTimeMeditated]);

  const contextValue = useMemo(() => {
    return {
      totalTimeMeditated,
      addMeditationTime,
    };
  }, [totalTimeMeditated]);

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
}
