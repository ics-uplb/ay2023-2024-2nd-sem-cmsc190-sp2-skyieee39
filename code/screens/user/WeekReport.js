import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { ref, onValue } from 'firebase/database';
import moment from 'moment';
import { db } from '../../firebase-config';  // Adjust the import path as necessary
import { useSelector } from 'react-redux';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const WeekReport = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [overallMood, setOverallMood] = useState('');
  const [loading, setLoading] = useState(true);
  const [noEntries, setNoEntries] = useState(false); 
  const userId = useSelector(state => state.user.userId);

  useEffect(() => {
    const journalEntriesRef = ref(db, 'journals/' + userId);
    const unsubscribe = onValue(journalEntriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = [];
        for (let entryId in data) {
          entries.push({
            id: entryId,
            ...data[entryId],
          });
        }
        processData(entries);
      } else {
        setNoEntries(true); // Set no entries if data is null
        setLoading(false); // Stop loading indicator
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const processData = (entries) => {
    const now = moment();
    let weeklyCounts = { positive: 0, neutral: 0, negative: 0 };
    let totalSentimentScore = 0;
    let entryCount = 0;

    for (let entry of entries) {
      const entryDate = moment(entry.createdAt);

      if (entryDate.isSame(now, 'week')) {
        updateCounts(weeklyCounts, entry.sentiment);
        totalSentimentScore += classifySentimentScore(entry.sentiment);
        entryCount++;
      }
    }

    if (entryCount === 0) {
      setNoEntries(true);
    } else {
      setWeeklyData(formatChartData(weeklyCounts));
      setOverallMood(calculateOverallMood(totalSentimentScore, entryCount));
    }
    setLoading(false);
  };

  const updateCounts = (counts, sentiment) => {
    if (sentiment === 'positive') counts.positive++;
    if (sentiment === 'neutral') counts.neutral++;
    if (sentiment === 'negative') counts.negative++;
  };

  const classifySentimentScore = (sentiment) => {
    if (sentiment === 'positive') return 1;
    if (sentiment === 'neutral') return 0;
    if (sentiment === 'negative') return -1;
    return 0;
  };

  const calculateOverallMood = (totalScore, count) => {
    if (count === 0) return 'No entries';
    const averageScore = totalScore / count;
    if (averageScore > 0) return 'Positive';
    if (averageScore < 0) return 'Negative';
    return 'Neutral';
  };

  const formatChartData = (counts) => {
    return {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [
        {
          data: [counts.positive, counts.neutral, counts.negative],
        },
      ],
    };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (noEntries) {
    return (
      <View style={styles.noEntriesContainer}>
        <Text style={styles.noEntriesText}>No journal entries</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.chartTitle}>Journal Sentiment Report</Text>
      <ScrollView contentContainerStyle={styles.container}>
        <BarChart
          data={weeklyData}
          width={screenWidth}
          height={screenHeight * 0.4}
          chartConfig={chartConfig}
          fromZero={true}
          showValuesOnTopOfBars={true}
          style={styles.chartStyle}
        />
        <Text style={styles.overallMood}>Overall Mood: {overallMood}</Text>
      </ScrollView>
    </View>
  );
};

const chartConfig = {
  backgroundColor: '#1cc910',
  backgroundGradientFrom: '#eff3ff',
  backgroundGradientTo: '#efefef',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEntriesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEntriesText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  chartStyle: {
    borderRadius: 25,
  },
  overallMood: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default WeekReport;
