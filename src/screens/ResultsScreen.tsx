import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {colors, typography} from '../styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

const ResultsScreen: React.FC<Props> = ({route, navigation}) => {
  const {result} = route.params;

  return (
    <View style={styles.container}>
      <Icon name="check-circle" size={100} color={colors.secondary} />
      <Text style={typography.title}>Test Results</Text>

      <View style={styles.resultContainer}>
        <Text style={typography.body}>{result}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.retakeButton]}
        onPress={() => navigation.navigate('Camera', {test: 'Retake Test'})}>
        <Text style={styles.buttonText}>Retake Test</Text>
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
  resultContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    marginVertical: 10,
  },
  retakeButton: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    ...typography.body,
    color: colors.surface,
  },
});

export default ResultsScreen;
