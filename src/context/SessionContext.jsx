import React, {createContext, useContext, useMemo, useState} from 'react';
import useAsyncStorage from '../hooks/useAsyncStorage'; // Import the custom hook

const SessionContext = createContext();

export function SessionProvider({children}) {
  const [totalTimeMeditated, setTotalTimeMeditated] = useAsyncStorage(
    'totalTimeMeditated',
    0,
  );
  const [sessionCount, setSessionCount] = useAsyncStorage('sessionCount', 0);
  const [longestTimeMeditated, setLongestTimeMeditated] = useAsyncStorage(
    'longestTimeMeditated',
    0,
  );
  const [shortestTimeMeditated, setShortestTimeMeditated] = useAsyncStorage(
    'shortestTimeMeditated',
    0,
  );
  const [currentStreak, setCurrentStreak] = useAsyncStorage('currentStreak', 0);
  const [longestStreak, setLongestStreak] = useAsyncStorage('longestStreak', 0);
  const [lastSessionDate, setLastSessionDate] = useAsyncStorage(
    'lastSessionDate',
    null,
  );
  const [meditationHistory, setMeditationHistory] = useAsyncStorage(
    'meditationHistory',
    {}, // Change from array to object
  );
  const [sessionInProgress, setSessionInProgress] = useState(false);

  const [buttonDurations, setButtonDurations] = useAsyncStorage(
    'buttonDurations',
    {
      button5Mins: 5,
      button10Mins: 10,
      button15Mins: 15,
      button20Mins: 20,
    },
  );

  const setButtonSelectedDuration = (key, duration) => {
    setButtonDurations(prev => ({
      ...prev,
      [key]: duration,
    }));
  };

  const addMeditationTime = minutes => {
    const totalTimeInSeconds = totalTimeMeditated + minutes * 60;
    setTotalTimeMeditated(totalTimeInSeconds);

    const seconds = minutes * 60;

    // Update longestTimeMeditated + shortest
    setLongestTimeMeditated(prevLongest => Math.max(prevLongest, seconds));

    // Update shortestTimeMeditated
    if (shortestTimeMeditated === 0 || seconds < shortestTimeMeditated) {
      setShortestTimeMeditated(seconds);
    }
  };

  const incrementSessionCount = sessionDurationInSeconds => {
    // This function now also handles streak logic
    setSessionCount(prevCount => prevCount + 1);

    const today = new Date();
    // Correctly format date string based on local timezone to avoid UTC issues.
    const todayDateString = `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    // yesterday's date string locally.
    const yesterdayDateString = `${yesterday.getFullYear()}-${String(
      yesterday.getMonth() + 1,
    ).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    if (lastSessionDate === yesterdayDateString) {
      // Streak continues
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      setLongestStreak(prevLongest => Math.max(prevLongest, newStreak));
    } else if (lastSessionDate !== todayDateString) {
      // Streak is broken or it's the first session of a new day
      setCurrentStreak(1);
      setLongestStreak(prevLongest => Math.max(prevLongest, 1));
    }
    // If lastSessionDate is already today, the streak doesn't change.

    setLastSessionDate(todayDateString);
    // Add today's meditation time to the history object
    setMeditationHistory(prevHistory => {
      const newHistory = {...prevHistory};
      const timeToday = newHistory[todayDateString] || 0;
      newHistory[todayDateString] = timeToday + sessionDurationInSeconds;
      return newHistory;
    });
  };

  const resetStatistics = async () => {
    // Now also resets streak data
    [setCurrentStreak, setLongestStreak, setLastSessionDate, setSessionCount, setTotalTimeMeditated, setLongestTimeMeditated, setShortestTimeMeditated].forEach(setter => setter(0));
    setMeditationHistory({}); // Reset history to an empty object
    setLastSessionDate(null); // Explicitly null for date
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
      currentStreak,
      longestStreak,
      meditationHistory,
      buttonDurations,
      setButtonSelectedDuration,
      setSessionInProgress,
      sessionInProgress,
    };
  }, [
    totalTimeMeditated,
    longestTimeMeditated,
    shortestTimeMeditated,
    currentStreak,
    longestStreak,
    meditationHistory,
    buttonDurations,
    setSessionInProgress,
    sessionInProgress,
  ]);

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
