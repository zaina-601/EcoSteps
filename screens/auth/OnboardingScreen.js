import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { COLORS } from '../../constants/colors';

// Use the light theme colors for this screen
const theme = COLORS.light;

const OnboardingScreen = ({ navigation }) => (
  <View style={styles.container}>
    {/*
      <Image
        source={require('../../assets/images/onboarding-illustration.png')}
        style={styles.illustration}
      />
    */}
    <Text style={styles.title}>Welcome to EcoSteps</Text>
    <Text style={styles.subtitle}>Track your carbon footprint and help the planet.</Text>

    <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
      <Text style={styles.buttonText}>Get Started</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.background,
  },
  illustration: {
      width: 300,
      height: 300,
      resizeMode: 'contain',
      marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 17,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 24,
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: theme.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;