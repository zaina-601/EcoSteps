import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import FormInput from '../../components/common/FormInput';
import FormButton from '../../components/common/FormButton';
import { signIn } from '../../services/firebase';
import { COLORS } from '../../constants/colors';

const theme = COLORS.light;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back!</Text>
        <FormInput value={email} placeholder="Email" onChangeText={setEmail} />
        <FormInput value={password} placeholder="Password" secureTextEntry onChangeText={setPassword} />
        <FormButton title="Login" onPress={handleLogin} disabled={loading} />

        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: theme.background },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: theme.text },
    link: { color: theme.primary, textAlign: 'center', marginTop: 15, fontWeight: '500' },
  });

  export default LoginScreen;