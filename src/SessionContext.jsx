import React, { createContext, useContext, useMemo } from 'react';
import useAsyncStorage from './hooks/useAsyncStorage'; // Import the custom hook

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [totalTimeMeditated, setTotalTimeMeditated] = useAsyncStorage('totalTimeMeditated', 0);
  const [sessionCount, setSessionCount] = useAsyncStorage('sessionCount', 0);
  const [longestTimeMeditated, setLongestTimeMeditated] = useAsyncStorage('longestTimeMeditated', 0);
  const [shortestTimeMeditated, setShortestTimeMeditated] = useAsyncStorage('shortestTimeMeditated', 0);

  const [buttonDurations, setButtonDurations] = useAsyncStorage('buttonDurations', {
    button5Mins: 5,
    button10Mins: 10,
    button15Mins: 15,
    button20Mins: 20, 
  }); 

  
  const setButtonSelectedDuration = (key, duration) => {
    setButtonDurations(prev => ({
      ...prev,
      [key]: duration, 
    }));
  };
 
  const addMeditationTime = (minutes) => {
    const totalTimeInSeconds = totalTimeMeditated + minutes * 60;
    setTotalTimeMeditated(totalTimeInSeconds);
  
    const seconds = minutes * 60;
  
    // Update longestTimeMeditated + shortest 
    setLongestTimeMeditated((prevLongest) => Math.max(prevLongest, seconds));

    // Update shortestTimeMeditated
    if (shortestTimeMeditated === 0 || seconds < shortestTimeMeditated) {
      setShortestTimeMeditated(seconds);
    }
  };

  const incrementSessionCount = () => {
    setSessionCount((prevCount) => prevCount + 1);
  };

  const resetStatistics = async () => { 
      setSessionCount(0);
      setTotalTimeMeditated(0);
      setLongestTimeMeditated(0);
      setShortestTimeMeditated(0);  
  };

  const resetShortestStatistics = async () => {
    setShortestTimeMeditated(0);
  };

  
  const contextValue = useMemo(() => {
    return {
      totalTimeMeditated,
      addMeditationTime,
      sessionCount,
      incrementSessionCount,
      resetStatistics,
      resetShortestStatistics,
      longestTimeMeditated,
      shortestTimeMeditated,
      buttonDurations,
      setButtonSelectedDuration ,
    };
  }, [totalTimeMeditated, longestTimeMeditated, shortestTimeMeditated, buttonDurations, ]);

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
