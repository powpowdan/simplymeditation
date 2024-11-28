/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { SessionProvider } from './src/context/SessionContext';

const Main = () => (
    <SessionProvider>
      <App />
    </SessionProvider>
  );

AppRegistry.registerComponent(appName, () => Main);
