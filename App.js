/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SigninScreen,
  MessageScreen,
  ListRequestFriendScreen,
  CallVideoScreen,
} from './src/screen/index';
import BottomTabNavigatorHome from './src/navigation/BottomTabNavigatorHome';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import store from './src/reducers/store';
import {SearchBar, HeaderMessageScreen} from './src/component/index';

const Stack = createStackNavigator();

const App: () => Node = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SigninScreen">
          <Stack.Screen
            options={{headerShown: false}}
            name="CallVideoScreen"
            component={CallVideoScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="SigninScreen"
            component={SigninScreen}
          />
          <Stack.Screen
            options={({route, navigation}) => ({
              header: () => (
                <HeaderMessageScreen route={route} navigation={navigation} />
              ),
            })}
            name="MessageScreen"
            component={MessageScreen}
          />
          <Stack.Screen
            options={({route, navigation}) => ({
              header: () => <SearchBar navigation={navigation} />,
            })}
            name="BottomTabNavigatorHome"
            component={BottomTabNavigatorHome}
          />
          <Stack.Screen
            name="ListRequestFriendScreen"
            component={ListRequestFriendScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
