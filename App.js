import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AuthNavigator from './navigation/AuthNavigator';
import AppNavigator from './navigation/AppNavigator';
import { COLORS } from './constants/colors';
import * as Notifications from 'expo-notifications';

const theme = COLORS.light;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function scheduleDailyReminder() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "👋 Don't forget to log your activities!",
            body: 'Track your carbon footprint to make a difference today.',
        },
        trigger: {
            hour: 20,
            minute: 0,
            repeats: true,
        },
    });
}

const RootNavigator = () => {
  const { user, loading } = React.useContext(AuthContext);

  useEffect(() => {
    if (user) {
      Notifications.requestPermissionsAsync().then(({ status }) => {
        if (status === 'granted') {
          scheduleDailyReminder();
        }
      });
    }
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
});