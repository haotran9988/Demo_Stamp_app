import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from './Home';
import Login from './Login';
import Stamp from './Stamp';
import ReadCSV from './ReadCSV';

const Stack = createNativeStackNavigator();
const MainNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Login">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Stamp" component={Stamp} />
        <Stack.Screen name="ReadCSV" component={ReadCSV} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
