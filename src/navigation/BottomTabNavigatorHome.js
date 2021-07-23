import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {MessageTab, FriendsTab} from '../screen/index';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Reanimated 2']);

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator tabBarPosition={'bottom'}>
      <Tab.Screen name="MessageTab" component={MessageTab} />
      <Tab.Screen name="FriendsTab" component={FriendsTab} />
    </Tab.Navigator>
  );
}

export default MyTabs;
