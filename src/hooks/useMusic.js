import { useState, useRef, useEffect } from 'react';
import Sound from 'react-native-sound';
import { useMusicSwitchContext } from '../context/MusicSwitchContext';

const useMusic = () => {
  const { selectedBgTone } = useMusicSwitchContext();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const soundRef = useRef(null);

  const playMusic = () => {
    if (isMusicPlaying || !selectedBgTone) return;

    const sound = new Sound(selectedBgTone, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.error('Music Playback Error:', error);
        return;
      }
      sound.setNumberOfLoops(-1); // Loop indefinitely
      sound.play(() => console.log('Background music playing'));
      soundRef.current = sound;
      setIsMusicPlaying(true);
    });
  };

  const stopMusic = () => {
    const currentSound = soundRef.current;
    if (currentSound) {
      currentSound.stop(() => console.log('Audio stopped'));
      currentSound.release();
      soundRef.current = null;
      setIsMusicPlaying(false);
    }
  };

  useEffect(() => stopMusic, [selectedBgTone]);

  return { playMusic, stopMusic, isMusicPlaying };
};

export default useMusic;
