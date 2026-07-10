/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { SessionProvider } from './src/context/SessionContext';
import TrackPlayer from 'react-native-track-player'; 

const Main = () => (
    <SessionProvider>
      <App />
    </SessionProvider>
  );
  
  AppRegistry.registerComponent(appName, () => Main);
  
  // load service dynamically to prevent early boot crashes
  TrackPlayer.registerPlaybackService(() => require('./src/hooks/trackPlayerService').playbackService);
