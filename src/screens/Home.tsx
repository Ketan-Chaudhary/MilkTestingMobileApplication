import React from 'react';
import {View, Text, Button, FlatList, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const tests = [
  {id: '1', name: 'Starch'},
  {id: '2', name: 'Urea'},
  {id: '3', name: 'Detergent'},
];

const Home: React.FC<Props> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Milk Testing Kit</Text>
      <FlatList
        data={tests}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Button
            title={item.name}
            onPress={() => navigation.navigate('Camera', {test: item.name})}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
});

export default Home;
