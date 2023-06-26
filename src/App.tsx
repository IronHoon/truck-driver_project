/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {RootNavigation} from './navigations/RootNavigation';
import MainNavigator from './navigations/MainNavigator';
import Toast from 'react-native-toast-message';
import {ToastConfig} from './config/ToastConfig';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App(): JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer ref={RootNavigation.navigationRef}>
        <MainNavigator />
        <Toast config={ToastConfig} />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
