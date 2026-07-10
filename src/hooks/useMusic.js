import { useState, useRef, useEffect } from 'react';
import TrackPlayer, {
  usePlaybackState,
  State,
  Capability,
  RepeatMode,
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';
import { useMusicSwitchContext } from '../context/MusicSwitchContext';

const useMusic = () => {
  const { selectedSongPathBg, volumeBg } = useMusicSwitchContext();
  
  // Destructure the nested state property safely with a fallback string
  //this extracts the players state and prevents crashes before player is redy
  const { state: currentPlaybackState } = usePlaybackState() || { state: State.None };
  //functions wait for this to be true before we send commands
  const [isPlayerReady, setPlayerReady] = useState(false);

  // Initialize the player
  useEffect(() => {
    let isMounted = true;
    const setupPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer();
        
        if (!isMounted) return;

        await TrackPlayer.updateOptions({
          android: {
            appKilledPlaybackBehavior:
              AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
          },
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop, 
          ],
          compactCapabilities: [Capability.Play, Capability.Pause],
        });
        setPlayerReady(true);
      } catch (error) {
        if (error.message && error.message.includes('already been initialized')) {
          if (isMounted) setPlayerReady(true);
        } else {
          console.error('Error setting up TrackPlayer:', error);
        }
      }
    };
    setupPlayer();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update volume dynamically when the context volume changes
  useEffect(() => {
    if (isPlayerReady) {
      TrackPlayer.setVolume(volumeBg).catch(() => {});
    }
  }, [volumeBg, isPlayerReady]);

  const playMusic = async () => {
    if (!isPlayerReady || !selectedSongPathBg) return;

    try {
      await TrackPlayer.reset(); //clear old tracks

      const cleanResourceName = selectedSongPathBg
        .replace(/\.[^/.]+$/, "")
        .replace(/^.*[\\\/]/, "");

      const packageName = "com.simplymeditation2";

      await TrackPlayer.add({
        id: 'background-music',
        url: `android.resource://${packageName}/raw/${cleanResourceName}`,
        title: 'Meditation Session',
        artist: 'Simply Meditation',
      });

      await TrackPlayer.setVolume(volumeBg);
      await TrackPlayer.setRepeatMode(RepeatMode.Track); 

      await TrackPlayer.play();
    } catch (error) {
      console.error('Error playing music with TrackPlayer:', error);
    }
  };

  const stopMusic = async () => {
    if (!isPlayerReady) return;
    try {
      await TrackPlayer.reset();
    } catch (error) {
      console.error('Error stopping track:', error);
    }
  };

  const isInitialMount = useRef(true);

  // track-switches dynamically and clean the player queue safely
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (isPlayerReady) {
        stopMusic();
      }
    }
  }, [selectedSongPathBg, isPlayerReady]); // Added isPlayerReady so it handles early changes correctly

  // Check the extracted primitive string value directly
  const isMusicPlaying = currentPlaybackState === State.Playing || currentPlaybackState === State.Buffering;

  return { playMusic, stopMusic, isMusicPlaying, isPlayerReady };
};

export default useMusic;