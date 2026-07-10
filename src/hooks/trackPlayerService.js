import TrackPlayer, { Event } from 'react-native-track-player';

/**
 * This is the entry point for the audio service.
 * It handles background events and remote controls.
 */
export const playbackService = async function() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());

  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    // On remote stop (like swiping away the notification), we stop the player.
    TrackPlayer.stop();
  });

  // Note: You can add more event listeners here for things like headset disconnects, etc.
};