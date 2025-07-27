import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import { useAuth } from '../hooks/useAuth';
import { useCarbonCalculator } from '../hooks/useCarbonCalculator';
import { logActivity } from '../services/firebase';

import Card from '../components/common/Card';
import FormInput from '../components/common/FormInput';
import FormButton from '../components/common/FormButton';
import { COLORS } from '../constants/colors';
import { EMISSION_FACTORS } from '../constants/emissions';

const theme = COLORS.light;

const createPickerItems = (category) =>
  Object.keys(EMISSION_FACTORS[category]).map((key) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value: key,
  }));

const ActivityTrackerScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState({
    transport: { type: 'car', value: 0 },
    food: { type: 'chicken', value: 0 },
    energy: { value: 0 },
  });
  const [loading, setLoading] = useState(false);

  const totalCO2 = useCarbonCalculator(activities);

  const handleInputChange = (category, field, inputValue) => {
    const numericValue = parseFloat(inputValue) || 0;
    setActivities((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: numericValue },
    }));
  };

  const handleTypeChange = (category, type) => {
    setActivities((prev) => ({
      ...prev,
      [category]: { ...prev[category], type },
    }));
  };

  const handleSaveLog = async () => {
    if (totalCO2 <= 0) {
      Alert.alert("No Activity", "Please enter some activities before saving.");
      return;
    }
    setLoading(true);
    const { error } = await logActivity(user.uid, {
      activities,
      totalCO2: parseFloat(totalCO2),
    });
    setLoading(false);

    if (error) {
      Alert.alert("Error", "Could not save your activity. Please try again.");
    } else {
      Alert.alert("Success!", `Your activity adding ${totalCO2} kg of CO2 has been logged.`);
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Today's Estimated CO2</Text>
        <Text style={styles.co2Text}>{totalCO2} kg</Text>
      </View>

      <Card title="Transport">
        <RNPickerSelect
          onValueChange={(value) => handleTypeChange('transport', value)}
          items={createPickerItems('transport')}
          style={pickerSelectStyles}
          value={activities.transport.type}
        />
        <FormInput
          placeholder="Distance in km"
          keyboardType="numeric"
          onChangeText={(val) => handleInputChange('transport', 'value', val)}
        />
      </Card>

      <Card title="Food">
        <RNPickerSelect
          onValueChange={(value) => handleTypeChange('food', value)}
          items={createPickerItems('food')}
          style={pickerSelectStyles}
          value={activities.food.type}
        />
        <FormInput
          placeholder="Number of servings"
          keyboardType="numeric"
          onChangeText={(val) => handleInputChange('food', 'value', val)}
        />
      </Card>

      <Card title="Energy">
        <FormInput
          placeholder="Electricity used in kWh"
          keyboardType="numeric"
          onChangeText={(val) => handleInputChange('energy', 'value', val)}
        />
      </Card>

      <FormButton title="Save Today's Log" onPress={handleSaveLog} disabled={loading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.secondary },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  co2Text: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.primary,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    color: theme.text,
    paddingRight: 30,
    marginBottom: 15,
    backgroundColor: theme.background,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    color: theme.text,
    paddingRight: 30,
    marginBottom: 15,
    backgroundColor: theme.background,
  },
});

export default ActivityTrackerScreen;