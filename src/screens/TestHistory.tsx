import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      <Text style={styles.title}>Test History</Text>

      {history.length === 0 ? (
        <Text style={styles.noHistory}>No test history available.</Text>
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
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6200ee',
  },
  noHistory: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  resultItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
  },
  testName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  result: {
    fontSize: 16,
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  clearButton: {
    backgroundColor: '#d32f2f',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TestHistory;
