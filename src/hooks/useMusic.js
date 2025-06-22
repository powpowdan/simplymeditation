import { useState, useRef, useEffect } from 'react';
import Sound from 'react-native-sound';
import { useMusicSwitchContext } from '../context/MusicSwitchContext';

const CROSSFADE_DURATION = 5000; // ms
const VOLUME_STEPS = 50;

const useMusic = () => {
  const { selectedSongPathBg, volumeBg } = useMusicSwitchContext();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const soundARef = useRef(null);
  const soundBRef = useRef(null);
  const isUsingARef = useRef(true);
  const fadeTimerRef = useRef(null);

  const fadeVolume = (sound, from, to, duration = CROSSFADE_DURATION) => {
    const stepTime = duration / VOLUME_STEPS;
    for (let i = 0; i <= VOLUME_STEPS; i++) {
      const volume = from + (to - from) * (i / VOLUME_STEPS);
      setTimeout(() => {
        if (sound?.isLoaded()) sound.setVolume(volume);
      }, i * stepTime);
    }
  };

  const crossfadeToNext = () => {
    const isUsingA = isUsingARef.current;
    const currentSound = isUsingA ? soundARef.current : soundBRef.current;

    const nextSound = new Sound(selectedSongPathBg, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Error loading next sound:', error);
        return;
      }

      nextSound.setVolume(0);
      nextSound.play();

      // Crossfade
      fadeVolume(nextSound, 0, volumeBg);
      fadeVolume(currentSound, volumeBg, 0);

      // Stop and release the current sound after fade
      setTimeout(() => {
        currentSound.stop(() => currentSound.release());
      }, CROSSFADE_DURATION);

      // Swap refs
      if (isUsingA) {
        soundBRef.current = nextSound;
      } else {
        soundARef.current = nextSound;
      }

      isUsingARef.current = !isUsingA;
      scheduleNextCrossfade(nextSound);
    });
  };

  const scheduleNextCrossfade = (soundInstance) => {
    const duration = soundInstance.getDuration() * 1000;
    const startFadeTime = duration - CROSSFADE_DURATION;

    fadeTimerRef.current = setTimeout(() => {
      crossfadeToNext();
    }, startFadeTime);
  };

  const playMusic = () => {
    if (isMusicPlaying || !selectedSongPathBg) return;

    const sound = new Sound(selectedSongPathBg, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load sound:', error);
        return;
      }

      sound.setVolume(volumeBg);
      sound.play();
      soundARef.current = sound;
      isUsingARef.current = true;

      scheduleNextCrossfade(sound);
      setIsMusicPlaying(true);
    });
  };

  const stopMusic = () => {
    clearTimeout(fadeTimerRef.current);

    [soundARef.current, soundBRef.current].forEach(sound => {
      if (sound) {
        sound.stop(() => sound.release());
      }
    });

    soundARef.current = null;
    soundBRef.current = null;
    setIsMusicPlaying(false);
  };

  useEffect(() => {
    return stopMusic;
  }, [selectedSongPathBg]);

  return { playMusic, stopMusic, isMusicPlaying };
};

export default useMusic;
