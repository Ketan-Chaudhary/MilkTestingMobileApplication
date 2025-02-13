import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import StepInstructions from '../components/StepInstructions';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const tests = [
  {id: '1', name: 'Starch'},
  {id: '2', name: 'Urea'},
  {id: '3', name: 'Detergent'},
];

const Home: React.FC<Props> = ({navigation}) => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Test</Text>
      {tests.map(test => (
        <TouchableOpacity
          key={test.id}
          style={styles.button}
          onPress={() => setSelectedTest(test.name)}>
          <Text style={styles.buttonText}>{test.name}</Text>
        </TouchableOpacity>
      ))}

      <Modal visible={!!selectedTest} transparent>
        <StepInstructions
          onStartTest={() => {
            navigation.navigate('Camera', {test: selectedTest!});
            setSelectedTest(null);
          }}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6200ee',
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Home;
