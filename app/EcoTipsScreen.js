import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ECO_TIPS } from '../constants/ecoTips';
import { COLORS } from '../constants/colors';
import Card from '../components/common/Card';

const theme = COLORS.light;
const FAVORITES_KEY = '@EcoSteps:Favorites';

const EcoTipsScreen = () => {
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
        if (storedFavorites !== null) {
          setFavorites(new Set(JSON.parse(storedFavorites)));
        }
      } catch (e) {
        Alert.alert('Error', 'Could not load your favorite tips.');
      }
    };
    loadFavorites();
  }, []);

  const toggleFavorite = useCallback(async (tipId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(tipId)) {
      newFavorites.delete(tipId);
    } else {
      newFavorites.add(tipId);
    }
    setFavorites(newFavorites);
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([...newFavorites]));
    } catch (e) {
      Alert.alert('Error', 'Could not save your favorite.');
    }
  }, [favorites]);

  const renderTip = ({ item }) => {
    const isFavorite = favorites.has(item.id);
    return (
      <Card title={item.category}>
        <Text style={styles.tipText}>{item.tip}</Text>
        <Text style={styles.descriptionText}>{item.description}</Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Text style={styles.favoriteText}>{isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}</Text>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={ECO_TIPS}
        renderItem={renderTip}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.secondary },
  tipText: { fontSize: 16, fontWeight: '500', color: theme.text, marginBottom: 8 },
  descriptionText: { fontSize: 14, color: theme.textSecondary, lineHeight: 20 },
  favoriteButton: { marginTop: 15, alignSelf: 'flex-start' },
  favoriteText: { color: theme.accent, fontWeight: 'bold' },
});

export default EcoTipsScreen;