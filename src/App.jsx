import React from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { MusicSwitchProvider } from './MusicSwitchContext';
import { SessionProvider } from './SessionContext'; 
import OptionsScreen from './screens/OptionsScreen';
import HomeScreen from './screens/HomeScreen'; 
import SessionList from './SessionList';



const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <MusicSwitchProvider>
      <SessionProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              gestureEnabled: true, // Enable gestures for transitions (optional)
              headerShown: false, // Hide header for all screens by default (optional)
            }}>
            {/* Meditation Timer Screen */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{headerShown: false,  animation: 'fade'}}
            />
            {/* Options Screen */}
            <Stack.Screen
              name="Options" // Use "Options" as the screen name for OptionsScreen
              component={OptionsScreen}
              options={{
                animation: 'fade',
                title: 'Options',
                headerStyle: {
                  backgroundColor: '#212121', // Set the background color of the header
                },
                headerTintColor: '#ededed', // Set the text color of the header
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            {/* Session List Screen */}
            <Stack.Screen name="SessionList" component={SessionList} />
          </Stack.Navigator>
        </NavigationContainer>
      </SessionProvider>
    </MusicSwitchProvider>
  );
};



export default App;
