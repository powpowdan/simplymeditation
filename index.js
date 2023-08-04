/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { SessionProvider } from './SessionContext'; 

const Main = () => (
    <SessionProvider>
      <App />
    </SessionProvider>
  );

AppRegistry.registerComponent(appName, () => Main);
