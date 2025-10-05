import { useState, useRef, useEffect } from 'react';
import Sound from 'react-native-sound';
import { useMusicSwitchContext } from '../context/MusicSwitchContext';

const useMusic = () => {
  const { selectedSongPathBg, volumeBg } = useMusicSwitchContext();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const soundRef = useRef(null);

  const playMusic = () => {
    if (isMusicPlaying || !selectedSongPathBg) return;

    const sound = new Sound(selectedSongPathBg, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load sound:', error);
        return;
      }

      sound.setVolume(volumeBg);
      sound.setNumberOfLoops(-1); // 🔁 Native infinite looping
      sound.play((success) => {
        if (!success) {
          console.error('Playback failed due to decoding errors');
        }
      });

      soundRef.current = sound;
      setIsMusicPlaying(true);
    });
  };

  const stopMusic = () => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current.release();
        soundRef.current = null;
        setIsMusicPlaying(false);
      });
    }
  };

  useEffect(() => {
    return stopMusic; // Cleanup on unmount or path change
  }, [selectedSongPathBg]);

  return { playMusic, stopMusic, isMusicPlaying };
};

export default useMusic;