import { useState, useRef, useEffect } from 'react';
import Sound from 'react-native-sound';
import { useMusicSwitchContext } from '../context/MusicSwitchContext';
import notifee from '@notifee/react-native';
import {
  createNotificationChannel,
  startNotificationService,
  stopNotificationService,
} from './notificationService';
Sound.setCategory('Playback', true);

const useMusic = () => {
  const { selectedSongPathBg, volumeBg } = useMusicSwitchContext();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const soundRef = useRef(null);

  // Request permissions and initialize the channel on mount
  useEffect(() => {
    const setupNotifications = async () => {
      // ⬇️ Request explicit Android permission
      await notifee.requestPermission();
      await createNotificationChannel();
    };
    
    setupNotifications();
  }, []);

  // 2. Initialize the notification channel when the hook loads
  useEffect(() => {
    createNotificationChannel();
  }, []);

  const playMusic = () => {
    if (isMusicPlaying || !selectedSongPathBg) return;

    const sound = new Sound(selectedSongPathBg, Sound.MAIN_BUNDLE, async (error) => {
      if (error) {
        console.error('Failed to load sound:', error);
        return;
      } 

      soundRef.current = sound; //NEW: Establish the reference immediately, trying loop fix

      sound.setVolume(volumeBg);
      sound.setNumberOfLoops(-1); // Native infinite looping

      sound.play((success) => {
        if (!success) {
          console.error('Playback failed due to decoding errors');
          // NEW : If it cuts out or stops unexpectedly, reset the state
          setIsMusicPlaying(false);
          stopNotificationService(); // Kill notification if playback fails
        }
      });
 try {
        await startNotificationService();
      } catch (err) {
        console.error('Failed to start foreground service notification:', err);
      }
      setIsMusicPlaying(true);
    });
  };

  const stopMusic = () => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current.release();
        soundRef.current = null;
        setIsMusicPlaying(false); 
        stopNotificationService(); //kill foreground service
      });
    }
  };

  useEffect(() => {
    return stopMusic; // Cleanup on unmount or path change
  }, [selectedSongPathBg]);

  return { playMusic, stopMusic, isMusicPlaying };
};

export default useMusic;