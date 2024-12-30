import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { MusicSwitchProvider } from './context/MusicSwitchContext';
import { SessionProvider } from './context/SessionContext'; 
import BottomTabsNavigator from './components/BottomTabsNavigator';

 

const App = () => { 
  return (
    <MusicSwitchProvider>
      <SessionProvider>
        <NavigationContainer>
          <BottomTabsNavigator  />
        </NavigationContainer>
      </SessionProvider>
    </MusicSwitchProvider>
  );
};

export default App;
