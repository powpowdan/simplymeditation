import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a context for the session data
const SessionContext = createContext();

// Create a provider component to manage the session data
export function SessionProvider({ children }) {
  // Initialize state to track total time meditated
  const [totalTimeMeditated, setTotalTimeMeditated] = useState(0);

  // Function to add meditation time to the total
  const addMeditationTime = (minutes) => {
    setTotalTimeMeditated((prevTotal) => prevTotal + minutes);
  };

  // Load total time meditated from AsyncStorage on initial render
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

  // Store total time meditated to AsyncStorage whenever it changes
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

  // Define the context value
  const contextValue = {
    totalTimeMeditated,
    addMeditationTime,
  };

  // Provide the context value to the children components
  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

// Custom hook to access the session context
export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
}
