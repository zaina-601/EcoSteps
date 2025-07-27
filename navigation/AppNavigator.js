import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../app/DashboardScreen';
import ActivityTrackerScreen from '../app/ActivityTrackerScreen';
import EcoTipsScreen from '../app/EcoTipsScreen';
import ProfileScreen from '../app/ProfileScreen';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator();
const theme = COLORS.light;

const AppNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: theme.background },
      headerTintColor: theme.text,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={({ navigation }) => ({
        title: 'EcoSteps Dashboard',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="person-circle-outline" size={28} color={theme.primary} />
          </TouchableOpacity>
        ),
      })}
    />
    <Stack.Screen name="ActivityTracker" component={ActivityTrackerScreen} options={{ title: 'Log Your Activity' }} />
    <Stack.Screen name="EcoTips" component={EcoTipsScreen} options={{ title: 'Discover Eco Tips' }} />
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile & Settings' }} />
  </Stack.Navigator>
);

export default AppNavigator;