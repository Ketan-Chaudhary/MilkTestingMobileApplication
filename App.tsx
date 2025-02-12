import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './src/screens/Home';
import CameraScreen from './src/screens/CameraScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import TestHistory from './src/screens/TestHistory';
import Profile from './src/screens/Profile';
import Help from './src/screens/Help';

export type RootStackParamList = {
  Home: undefined;
  Camera: {test: string};
  Results: {result: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
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
);

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            let iconName;
            if (route.name === 'Start Test') iconName = 'flask-outline';
            else if (route.name === 'Test History') iconName = 'history';
            else if (route.name === 'Profile') iconName = 'account';
            else if (route.name === 'Help') iconName = 'help-circle-outline';
            return <Icon name={iconName!} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="Start Test" component={HomeStack} />
        <Tab.Screen name="Test History" component={TestHistory} />
        <Tab.Screen name="Profile" component={Profile} />
        <Tab.Screen name="Help" component={Help} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
