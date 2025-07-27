import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import FormInput from '../../components/common/FormInput';
import FormButton from '../../components/common/FormButton';
import { resetPassword } from '../../services/firebase';
import { COLORS } from '../../constants/colors';

const theme = COLORS.light;

const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      Alert.alert('Error', 'Could not send reset email. Please check the address.');
    } else {
      Alert.alert('Success', 'A password reset link has been sent to your email.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive a password reset link.</Text>
      <FormInput value={email} placeholder="Email" onChangeText={setEmail} />
      <FormButton title="Send Link" onPress={handleReset} disabled={loading} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: theme.background },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: theme.text },
  subtitle: { fontSize: 16, textAlign: 'center', color: theme.textSecondary, marginBottom: 30 },
  link: { color: theme.primary, textAlign: 'center', marginTop: 15, fontWeight: '500' },
});

export default ResetPasswordScreen;