import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

const ResultsScreen: React.FC<Props> = ({route}) => {
  const {result} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Results</Text>
      <Text style={styles.resultText}>{result}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6200ee',
  },
  resultText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});

export default ResultsScreen;
