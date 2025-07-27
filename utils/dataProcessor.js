import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from 'date-fns';

// Processes raw Firestore activity logs for the line chart
export const processWeeklyData = (activities) => {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(today, { weekStartsOn: 1 }); // Sunday
  const weekDays = eachDayOfInterval({ start, end });

  const weeklyData = weekDays.map(day => {
    const dayActivities = activities.filter(act => isSameDay(act.createdAt.toDate(), day));
    const totalCO2 = dayActivities.reduce((sum, act) => sum + act.totalCO2, 0);
    return {
      value: totalCO2,
      label: format(day, 'EEE'), // Mon, Tue, etc.
      date: format(day, 'dd MMM'),
    };
  });
  return weeklyData;
};

// Processes raw data for the pie chart
export const processCategoryData = (activities) => {
  const categoryTotals = { transport: 0, food: 0, energy: 0 };
  activities.forEach(act => {
    if (act.activities.transport) categoryTotals.transport += (act.activities.transport.value * 0.21); // Simplified for demo
    if (act.activities.food) categoryTotals.food += (act.activities.food.value * 0.4);
    if (act.activities.energy) categoryTotals.energy += (act.activities.energy.value * 0.475);
  });

  const pieData = Object.keys(categoryTotals)
    .filter(key => categoryTotals[key] > 0)
    .map(key => ({
      value: categoryTotals[key],
      text: `${key.charAt(0).toUpperCase() + key.slice(1)}`,
      color: key === 'transport' ? '#3B82F6' : key === 'food' ? '#FACC15' : '#10B981',
    }));
  return pieData;
};

// Calculates the current logging streak
export const calculateStreak = (activities) => {
  if (activities.length === 0) return 0;

  let streak = 0;
  let today = new Date();

  // Sort activities by date descending
  const sortedActivities = activities.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

  // Remove duplicate logs on the same day
  const uniqueDays = sortedActivities.filter((act, index, self) =>
    index === self.findIndex(a => isSameDay(a.createdAt.toDate(), act.createdAt.toDate()))
  );

  if (uniqueDays.length === 0) return 0;

  // Check if today or yesterday is the last log day
  if (isSameDay(uniqueDays[0].createdAt.toDate(), today) || isSameDay(uniqueDays[0].createdAt.toDate(), new Date(today.setDate(today.getDate() - 1)))) {
    streak = 1;
    today.setDate(today.getDate()); // Reset today after modification

    for (let i = 0; i < uniqueDays.length - 1; i++) {
      const currentDay = uniqueDays[i].createdAt.toDate();
      const nextDay = uniqueDays[i+1].createdAt.toDate();

      const diffTime = currentDay - nextDay;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
  }

  return streak;
};