import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Animated} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import OptionsScreen from '../screens/OptionsScreen';
import StatsScreen from '../screens/StatsScreen';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        // tabBarShowLabel: false,
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
              <Icon name={iconName} size={size} color={color} />
            </Animated.View>
          );
        },
        tabBarLabel: ({focused}) => {
          return (
            <Animated.Text
              style={{
                fontSize: focused ? 11 : 9, // Animate label size on focus
                color: focused
                  ? styles.activeTintColor.color
                  : styles.inactiveTintColor.color,
              }}>
              {route.name}
            </Animated.Text>
          );
        },
        tabBarItemStyle: {
          paddingBottom: 3,
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Statistics" component={StatsScreen} />
      <Tab.Screen name="Options" component={OptionsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1A1F26',
    height: '7%',
  },
  activeTintColor: {
    color: '#74aff7',
  },
  inactiveTintColor: {
    color: '#A7C8E7',
  },
});
