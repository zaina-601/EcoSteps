import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../app/DashboardScreen';
import ActivityTrackerScreen from '../app/ActivityTrackerScreen';
import EcoTipsScreen from '../app/EcoTipsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'EcoSteps Dashboard' }} />
    <Stack.Screen name="ActivityTracker" component={ActivityTrackerScreen} options={{ title: 'Log Your Activity' }} />
    <Stack.Screen name="EcoTips" component={EcoTipsScreen} options={{ title: 'Discover Eco Tips' }} />
  </Stack.Navigator>
);

export default AppNavigator;