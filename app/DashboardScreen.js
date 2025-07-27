import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import ProgressBar from 'react-native-progress/Bar';
import { collection, query, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../constants/colors';
import Card from '../components/common/Card';
import FormButton from '../components/common/FormButton';
import { processWeeklyData, processCategoryData, calculateStreak } from '../utils/dataProcessor';

const theme = COLORS.light;

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [monthlyGoal, setMonthlyGoal] = useState(100); // Default goal
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Fetch User Goal
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().monthlyGoal) {
        setMonthlyGoal(userDoc.data().monthlyGoal);
      }

      // Fetch Activities
      const q = query(collection(db, 'users', user.uid, 'activities'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const activities = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Process Data
      const currentMonthTotal = activities
        .filter(act => new Date(act.createdAt.toDate()).getMonth() === new Date().getMonth())
        .reduce((sum, act) => sum + act.totalCO2, 0);

      setWeeklyData(processWeeklyData(activities));
      setPieData(processCategoryData(activities));
      setStreak(calculateStreak(activities));
      setMonthlyTotal(currentMonthTotal);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      Alert.alert("Error", "Could not fetch your data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  // useFocusEffect will refetch data every time the screen comes into view
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <Card title="🔥 Your Streak">
          <Text style={styles.streakText}>{streak} {streak === 1 ? 'day' : 'days'}</Text>
          <Text style={styles.subtitle}>Keep logging daily to build your habit!</Text>
        </Card>

        <Card title="📅 Monthly Goal">
          <Text style={styles.goalText}>
            {monthlyTotal.toFixed(2)} / {monthlyGoal} kg CO2
          </Text>
          <ProgressBar
            progress={monthlyTotal / monthlyGoal}
            width={null}
            height={10}
            color={theme.primary}
            unfilledColor={theme.secondary}
            borderWidth={0}
            borderRadius={5}
          />
        </Card>

        <Card title="📊 Weekly Emissions (kg CO2)">
          <LineChart
            data={weeklyData}
            height={200}
            color1={theme.primary}
            dataPointsColor1={theme.primary}
            startFillColor1={theme.primary}
            endFillColor1={'#3b82f620'} // Lighter primary
            isAnimated
          />
        </Card>

        <Card title="🍰 Emission Sources">
          {pieData.length > 0 ? (
            <View style={{alignItems: 'center'}}>
                <PieChart data={pieData} donut showText textColor={theme.text} radius={100} />
            </View>
          ) : (
            <Text style={styles.subtitle}>Log some activities to see your sources!</Text>
          )}
        </Card>

        <FormButton title="Discover Eco Tips" onPress={() => navigation.navigate('EcoTips')} style={{marginTop: 10}}/>
        <FormButton title="Log Today's Activities" onPress={() => navigation.navigate('ActivityTracker')} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.secondary
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background
  },
  streakText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.accent
  },
  subtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4
  },
  goalText: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 10,
    alignSelf: 'center'
  },
});

export default DashboardScreen;