import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, typography} from '../styles'; // Import global styles

interface StepInstructionsProps {
  onStartTest: () => void;
}

const StepInstructions: React.FC<StepInstructionsProps> = ({onStartTest}) => {
  return (
    <View style={styles.container}>
      <Text style={typography.title}>Test Instructions</Text>

      {/* Step 1 */}
      <View style={styles.stepContainer}>
        <Icon name="camera" size={24} color={colors.primary} />
        <Text style={styles.step}>
          1. Take a clear picture of the milk sample.
        </Text>
      </View>

      {/* Step 2 */}
      <View style={styles.stepContainer}>
        <Icon name="lightbulb-on" size={24} color={colors.primary} />
        <Text style={styles.step}>2. Ensure good lighting conditions.</Text>
      </View>

      {/* Step 3 */}
      <View style={styles.stepContainer}>
        <Icon name="alert-circle" size={24} color={colors.primary} />
        <Text style={styles.step}>3. Avoid reflections or glare.</Text>
      </View>

      {/* Custom Button */}
      <TouchableOpacity style={styles.button} onPress={onStartTest}>
        <Icon name="camera-iris" size={24} color={colors.surface} />
        <Text style={styles.buttonText}>Proceed to Camera</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 20,
  },
  step: {
    ...typography.body,
    marginLeft: 10,
    color: colors.text,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
    justifyContent: 'center',
    elevation: 3, // Add shadow for Android
    shadowColor: colors.text, // Add shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    ...typography.body,
    marginLeft: 10,
    color: colors.surface,
    fontWeight: 'bold',
  },
});

export default StepInstructions;
