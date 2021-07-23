/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import Firebase from './src/services/Firebase';
Firebase.onMessageBackground();
Firebase.onMessageForeground();

AppRegistry.registerComponent(appName, () => App);
