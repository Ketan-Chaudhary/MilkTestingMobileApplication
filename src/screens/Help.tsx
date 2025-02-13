import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';

const Help: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Help & FAQs</Text>

      <Text style={styles.subtitle}>Frequently Asked Questions</Text>
      <View style={styles.faqContainer}>
        <Text style={styles.question}>Q: How do I start a test?</Text>
        <Text style={styles.answer}>
          A: Navigate to the "Start Test" tab and select a test.
        </Text>

        <Text style={styles.question}>
          Q: What should I do if my test fails?
        </Text>
        <Text style={styles.answer}>
          A: Ensure proper lighting and retake the image.
        </Text>

        <Text style={styles.question}>
          Q: Where can I view past test results?
        </Text>
        <Text style={styles.answer}>A: Visit the "Test History" tab.</Text>
      </View>

      <Text style={styles.subtitle}>Guidelines for Testing</Text>
      <Text style={styles.guideline}>✔ Use a well-lit environment.</Text>
      <Text style={styles.guideline}>✔ Hold the camera steady.</Text>
      <Text style={styles.guideline}>✔ Follow on-screen instructions.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6200ee',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#6200ee',
  },
  faqContainer: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  answer: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  guideline: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
});

export default Help;
