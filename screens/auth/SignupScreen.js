import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import FormInput from '../../components/common/FormInput';
import FormButton from '../../components/common/FormButton';
import { signUp } from '../../services/firebase';

import { COLORS } from '../../constants/colors';

const theme = COLORS.light;

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);
    if (error) {
      Alert.alert('Signup Failed', error.message);
    }
  };

   return (
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <FormInput value={email} placeholder="Email" onChangeText={setEmail} />
        <FormInput value={password} placeholder="Password" secureTextEntry onChangeText={setPassword} />
        <FormInput value={confirmPassword} placeholder="Confirm Password" secureTextEntry onChangeText={setConfirmPassword} />
        <FormButton title="Sign Up" onPress={handleSignup} disabled={loading} />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: theme.background },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: theme.text },
    link: { color: theme.primary, textAlign: 'center', marginTop: 15, fontWeight: '500' },
  });

  export default SignupScreen;