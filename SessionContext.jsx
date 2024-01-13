import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [totalTimeMeditated, setTotalTimeMeditated] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  const addMeditationTime = (minutes) => {
    setTotalTimeMeditated((prevTotal) => prevTotal + minutes);
  };

  const incrementSessionCount = () => {
    setSessionCount((prevCount) => prevCount + 1);
  };

  const resetStatistics = async () => {
    try {
      await AsyncStorage.setItem('sessionCount', '0');
      await AsyncStorage.setItem('totalTimeMeditated', '0');

      setSessionCount(0);
      setTotalTimeMeditated(0);
    } catch (error) {
      console.error('Error resetting statistics:', error);
    }
  };

  // load session count
  useEffect(() => {
    const loadSessionCount = async () => {
      try {
        const value = await AsyncStorage.getItem('sessionCount');
        if (value !== null) {
          setSessionCount(parseInt(value, 10));
        }
      } catch (error) {
        console.error('Error loading sessionCount:', error);
      }
    };

    loadSessionCount();
  }, []);


// load total time meditated
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


//store total time meditated
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

  //total session count
  useEffect(() => {
    const saveSessionCount = async () => {
      try {
        await AsyncStorage.setItem('sessionCount', sessionCount.toString());
      } catch (error) {
        console.error('Error saving sessionCount:', error);
      }
    };

    saveSessionCount();
  }, [sessionCount]);

  const contextValue = useMemo(() => {
    return {
      totalTimeMeditated,
      addMeditationTime,
      sessionCount,
      incrementSessionCount,
      resetStatistics,
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
