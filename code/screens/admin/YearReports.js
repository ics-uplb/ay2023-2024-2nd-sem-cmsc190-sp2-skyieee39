import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { ref, onValue } from 'firebase/database';
import moment from 'moment';
import { db } from '../../firebase-config';  // Adjust the import path as necessary

const screenWidth = Dimensions.get('window').width;

const YearReports = () => {
  const [yearlyData, setYearlyData] = useState([]);
  const [overallMood, setOverallMood] = useState('');
  const [loading, setLoading] = useState(true);
  const [noEntries, setNoEntries] = useState(false); 

  useEffect(() => {
    const journalEntriesRef = ref(db, 'journals');
    const unsubscribe = onValue(journalEntriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allEntries = [];
        for (let userId in data) {
          for (let entryId in data[userId]) {
            allEntries.push({
              id: entryId,
              userId,
              ...data[userId][entryId],
            });
          }
        }
        processData(allEntries);
      } else {
        setNoEntries(true); // Set no entries if data is null
        setLoading(false); // Stop loading indicator
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);


  const processData = (entries) => {
    const now = moment();
    let totalSentimentScore = 0;
    let entryCount = 0;
    let yearlyCounts = { positive: 0, neutral: 0, negative: 0 };

    for (let key in entries) {
      const entry = entries[key];
      const entryDate = moment(entry.createdAt);

      if (entryDate.isSame(now, 'year')) {
        updateCounts(yearlyCounts, entry.sentiment);
        totalSentimentScore += classifySentimentScore(entry.sentiment);
        entryCount++;
      }
    }

    if (entryCount === 0) {
      setNoEntries(true);
    } else {
      setYearlyData(formatChartData(yearlyCounts));
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
    return [
      {
        name: 'Positive',
        population: counts.positive,
        color: 'green',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'Neutral',
        population: counts.neutral,
        color: 'yellow',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'Negative',
        population: counts.negative,
        color: 'orange',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
    ];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
        <Text style={styles.chartTitle}>Journal Sentiment Report</Text>
        <ScrollView contentContainerStyle={styles.container}>
        <PieChart
            data={yearlyData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
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
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center'
  },
  overallMood: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default YearReports;