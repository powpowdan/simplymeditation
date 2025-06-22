import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Animated, Pressable, Dimensions} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import OptionsScreen from '../screens/OptionsScreen';
import StatsScreen from '../screens/StatsScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSessionContext} from '../context/SessionContext';

const Tab = createBottomTabNavigator();

export default function BottomTabsNavigator() {
  const {sessionInProgress} = useSessionContext();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          sessionInProgress && {opacity: 0.5}, // dim during session
        ],
        tabBarActiveTintColor: styles.activeTintColor.color,
        tabBarInactiveTintColor: styles.inactiveTintColor.color,
        tabBarIcon: ({color, size, focused}) => {
          let iconName;
          let scale = focused ? 1.2 : 1;
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Statistics') {
            iconName = 'stats-chart-outline';
          } else if (route.name === 'Options') {
            iconName = 'settings-outline';
          }

          return (
            <Animated.View style={{transform: [{scale}]}}>
              <Icon name={iconName} size={size*scale} color={color} />
            </Animated.View>
          );
        },
        tabBarButton: props => (
          <Pressable
            {...props}
            disabled={sessionInProgress} // disable during session
          />
        ),
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Statistics" component={StatsScreen} />
      <Tab.Screen name="Options" component={OptionsScreen} />
    </Tab.Navigator>
  );
}

const { width } = Dimensions.get('window');
const baseWidth = 411; // Pixel 4 XL baseline
const scale = width / baseWidth;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1A1F26',
    height: 55 * scale, // scaled fixed height instead of '7%'
  },
  activeTintColor: {
    color: '#74aff7',
  },
  inactiveTintColor: {
    color: '#A7C8E7',
  },
});