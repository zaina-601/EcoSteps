import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

const theme = COLORS.light;

const FormInput = ({ value, placeholder, secureTextEntry = false, onChangeText }) => (
  <TextInput
    style={styles.input}
    value={value}
    placeholder={placeholder}
    placeholderTextColor={theme.textSecondary}
    secureTextEntry={secureTextEntry}
    onChangeText={onChangeText}
    autoCapitalize="none"
  />
);

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: theme.background,
    color: theme.text,
  },
});

export default FormInput;