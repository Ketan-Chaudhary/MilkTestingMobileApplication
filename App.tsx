import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Using MaterialCommunityIcons for a wide range of icons
import Home from './src/screens/Home';
import CameraScreen from './src/screens/CameraScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import TestHistory from './src/screens/TestHistory';
import Profile from './src/screens/Profile';
import Help from './src/screens/Help';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

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

// Custom Tab Bar Component
const CustomTabBar = ({state, descriptors, navigation}: any) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Define icons for each tab
        let iconName;
        switch (route.name) {
          case 'Start Test':
            iconName = 'test-tube'; // Professional icon for tests
            break;
          case 'Test History':
            iconName = 'clipboard-list-outline'; // Professional icon for history
            break;
          case 'Profile':
            iconName = 'account-circle-outline'; // Professional icon for profile
            break;
          case 'Help':
            iconName = 'help-circle-outline'; // Professional icon for help
            break;
          default:
            iconName = 'circle'; // Fallback icon
        }

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={onPress}>
            <Icon
              name={iconName}
              size={24}
              color={isFocused ? '#6200ee' : '#999'}
            />
            <Text
              style={[
                styles.tabLabel,
                {color: isFocused ? '#6200ee' : '#999'},
              ]}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
        <Tab.Screen name="Start Test" component={HomeStack} />
        <Tab.Screen name="Test History" component={TestHistory} />
        <Tab.Screen name="Profile" component={Profile} />
        <Tab.Screen name="Help" component={Help} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default App;
