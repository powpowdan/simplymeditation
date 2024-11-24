import {useState, useRef, useEffect} from 'react';
import Sound from 'react-native-sound';

const useMusic = () => {
  //not actually using isMusicPlaying for now.
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const soundRef = useRef(null);

  const playMusic = (fileName = 'now.mp3') => {
    const newSound = new Sound(fileName, null, error => {
      if (error) {
        console.error('Error loading sound:', error);
        return;
      }
      newSound.play(() => {
        newSound.release(); // Release when done
      });
      soundRef.current = newSound;
      setIsMusicPlaying(true);
    });
  };

  const stopMusic = () => {
    const currentSound = soundRef.current;
    if (currentSound) {
      currentSound.stop();
      currentSound.release();
      soundRef.current = null;
      setIsMusicPlaying(false);
      console.log('stopMusicFunction ran');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, []);

  return {playMusic, stopMusic, isMusicPlaying};
};

export default useMusic;
