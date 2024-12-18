import { useState, useRef, useEffect } from 'react';
import Sound from 'react-native-sound';

const useMusic = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const soundRef = useRef(null);

  const playMusic = (fileName = 'audio_file45.mp3') => {
    if (isMusicPlaying) return;

    const newSound = new Sound(fileName, null, error => {
      if (error) {
        console.error('Error loading sound:', error);
        return;
      }

      newSound.setNumberOfLoops(-1); // Loop the sound infinitely

      newSound.play(success => {
        if (!success) console.error('Playback error');
      });

      soundRef.current = newSound;
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

  useEffect(() => {
    return () => stopMusic(); // Cleanup when component unmounts
  }, []);

  return { playMusic, stopMusic, isMusicPlaying };
};

export default useMusic;
