import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const TestHistory: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Test History</Text>
    <Text>No tests recorded yet.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 22, fontWeight: 'bold'},
});

export default TestHistory;
