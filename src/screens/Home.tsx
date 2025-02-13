import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import StepInstructions from '../components/StepInstructions';
import {colors, typography} from '../styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const tests = [
  {id: '1', name: 'Starch', icon: 'flask'},
  {id: '2', name: 'Urea', icon: 'water'},
  {id: '3', name: 'Detergent', icon: 'soap'},
];

const Home: React.FC<Props> = ({navigation}) => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={typography.title}>Select a Test</Text>
      {tests.map(test => (
        <TouchableOpacity
          key={test.id}
          style={styles.button}
          onPress={() => setSelectedTest(test.name)}>
          <Icon name={test.icon} size={24} color={colors.primary} />
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
    backgroundColor: colors.background,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    elevation: 3,
  },
  buttonText: {
    ...typography.body,
    marginLeft: 10,
    color: colors.text,
  },
});

export default Home;
