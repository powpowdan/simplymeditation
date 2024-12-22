import {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function useAsyncStorage(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const hasChanged = useRef(false); // Track if the value has changed


  // FOR DEBUG
  // const clearAppData = async () => {
  //   await AsyncStorage.clear();
  //   console.log('App data cleared');
  // };
  
  // useEffect(() => {
  //   clearAppData();
  // }, []);

  // Load value from AsyncStorage
  useEffect(() => {
    const loadValue = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(key);
        if (storedValue !== null) {
          setValue(JSON.parse(storedValue));
        } else {
          setValue(defaultValue); // If no value, set to default
        }
      } catch (error) {
        console.error('Error loading value from AsyncStorage:', error);
      }
    };
    loadValue();
  }, [key]);

  // Save value to AsyncStorage only when it changes
  useEffect(() => {
    if (hasChanged.current) {
      const saveValue = async () => {
        try {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('Error saving value to AsyncStorage:', error);
        }
      };
      saveValue();
      hasChanged.current = false; // Reset the flag after saving
    }
  }, [key, value]);

  const setStoredValue = newValue => {
    setValue(newValue);
    hasChanged.current = true; // Mark as changed
  };

  return [value, setStoredValue];
}

export default useAsyncStorage;
