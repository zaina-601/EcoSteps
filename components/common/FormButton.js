import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';

const theme = COLORS.light;

const FormButton = ({ title, onPress, disabled = false, style, textStyle }) => (
  <TouchableOpacity
    style={[styles.button, style, disabled && styles.disabled]}
    onPress={onPress}
    disabled={disabled}
  >
    {disabled ? <ActivityIndicator color={theme.background} /> : <Text style={[styles.text, textStyle]}>{title}</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: theme.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FormButton;