import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MusicSwitchProvider} from './context/MusicSwitchContext';
import {SessionProvider} from './context/SessionContext';
import OptionsScreen from './screens/OptionsScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <MusicSwitchProvider>
      <SessionProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              gestureEnabled: true,
              headerShown: false,
            }}>
            {/* Home Screen */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{animation: 'fade'}}
            />
            {/* Options Screen */}
            <Stack.Screen
              name="Options"
              component={OptionsScreen}
              options={{
                animation: 'fade', 
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SessionProvider>
    </MusicSwitchProvider>
  );
};

export default App;
