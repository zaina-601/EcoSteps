// app/ProfileScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, TextInput } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { userSignOut, updateMonthlyGoal } from '../services/firebase';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import FormButton from '../components/common/FormButton';
import FormInput from '../components/common/FormInput';
import Constants from 'expo-constants'; // To get app version

const theme = COLORS.light;

const ProfileScreen = () => {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState('');

  const handleSaveGoal = async () => {
    if (!newGoal || isNaN(parseFloat(newGoal)) || parseFloat(newGoal) <= 0) {
      Alert.alert('Invalid Goal', 'Please enter a valid positive number for your goal.');
      return;
    }
    const goalValue = parseFloat(newGoal);
    await updateMonthlyGoal(user.uid, goalValue);
    Alert.alert('Success', 'Your monthly goal has been updated!');
    setModalVisible(false);
    setNewGoal('');
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: userSignOut }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={80} color={theme.text} />
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Options Section */}
      <View style={styles.optionsContainer}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity style={styles.optionRow} onPress={() => setModalVisible(true)}>
          <Ionicons name="flag-outline" size={24} color={theme.primary} />
          <Text style={styles.optionText}>Manage Monthly Goal</Text>
          <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View style={styles.dangerZone}>
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={'#EF4444'} />
          <Text style={[styles.optionText, { color: '#EF4444' }]}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.versionText}>
        Version: {Constants.expoConfig?.version ?? 'N/A'}
      </Text>

      {/* Goal Management Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Set New Monthly Goal</Text>
            <FormInput
              placeholder="Enter new CO₂ goal (kg)"
              keyboardType="numeric"
              value={newGoal}
              onChangeText={setNewGoal}
            />
            <FormButton title="Save Goal" onPress={handleSaveGoal} />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.secondary },
  header: { alignItems: 'center', padding: 30, backgroundColor: theme.background },
  email: { fontSize: 18, fontWeight: '500', color: theme.text, marginTop: 10 },
  optionsContainer: { marginTop: 30 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: theme.textSecondary, paddingHorizontal: 20, marginBottom: 10, textTransform: 'uppercase' },
  optionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.background, padding: 20, borderBottomWidth: 1, borderBottomColor: theme.secondary },
  optionText: { fontSize: 16, color: theme.text, marginLeft: 15, flex: 1 },
  dangerZone: { marginTop: 30 },
  versionText: { alignSelf: 'center', color: theme.textSecondary, position: 'absolute', bottom: 20 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  cancelText: { color: theme.textSecondary, marginTop: 15 },
});

export default ProfileScreen;