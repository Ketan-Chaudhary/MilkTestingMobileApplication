import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import CameraScreen from './src/screens/CameraScreen';
import ResultsScreen from './src/screens/ResultsScreen'; // New screen for displaying results

export type RootStackParamList = {
  Home: undefined;
  Camera: {test: string};
  Results: {result: string}; // New route for results
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ee', // Purple color
          },
          headerTintColor: '#fff', // White text
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{title: 'Milk Testing Kit'}}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{title: 'Camera'}}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{title: 'Test Results'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
