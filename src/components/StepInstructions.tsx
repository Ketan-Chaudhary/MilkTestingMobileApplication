import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

interface StepInstructionsProps {
  onStartTest: () => void;
}

const StepInstructions: React.FC<StepInstructionsProps> = ({onStartTest}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Instructions</Text>
      <Text style={styles.step}>
        1. Take a clear picture of the milk sample.
      </Text>
      <Text style={styles.step}>2. Ensure good lighting conditions.</Text>
      <Text style={styles.step}>3. Avoid reflections or glare.</Text>
      <Button title="Proceed to Camera" onPress={onStartTest} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  step: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default StepInstructions;
