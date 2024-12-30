import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import OptionsScreen from '../screens/OptionsScreen';
import StatsScreen from '../screens/StatsScreen';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Hides the default header
        tabBarStyle: styles.tabBar, // Style the tab bar
        tabBarActiveTintColor: styles.activeTintColor.color, // Active icon color
        tabBarInactiveTintColor: styles.inactiveTintColor.color, // Inactive icon color
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Placeholder" component={StatsScreen} />
      <Tab.Screen name="Options" component={OptionsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1A1F26',
  },
  activeTintColor: {
    color: '#74aff7',
  },
  inactiveTintColor: {
    color: '#A7C8E7',
  },
});
