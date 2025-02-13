import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors, typography} from '../styles';

interface TestResult {
  test: string;
  result: string;
  date: string;
}

const TestHistory: React.FC = () => {
  const [history, setHistory] = useState<TestResult[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const storedResults = await AsyncStorage.getItem('testResults');
      if (storedResults) {
        setHistory(JSON.parse(storedResults));
      }
    } catch (error) {
      console.error('Failed to load test history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('testResults');
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={typography.title}>Test History</Text>

      {history.length === 0 ? (
        <Text style={typography.caption}>No test history available.</Text>
      ) : (
        <FlatList
          data={history.reverse()} // Show latest results first
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.resultItem}>
              <Text style={styles.testName}>{item.test} Test</Text>
              <Text style={styles.result}>Result: {item.result}</Text>
              <Text style={styles.date}>
                {new Date(item.date).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}

      {history.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
          <Text style={styles.clearButtonText}>Clear History</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  resultItem: {
    backgroundColor: colors.surface,
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
  },
  testName: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.primary,
  },
  result: {
    ...typography.body,
    color: colors.text,
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  clearButton: {
    backgroundColor: colors.error,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  clearButtonText: {
    ...typography.body,
    color: colors.surface,
  },
});

export default TestHistory;
