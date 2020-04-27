import React from 'react';
import { AppRegistry, View } from 'react-native';
import { StyleSheet } from 'react-native';

import './Enviroment';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from './pantallas/LoginScreen';
import { SignUpScreen } from './pantallas/SignUpScreen';
import { MuroScreen } from './pantallas/MuroScreen';
import { PerfilScreen } from './pantallas/PerfilScreen';
import { ChatScreen } from './pantallas/ChatScreen';
import { VideoScreen } from './pantallas/VideoScreen';

const Stack = createStackNavigator();

export default class HelloWorldApp extends React.Component {
  render() {
    console.log('render - App.js');
    console.log(global.endpoint_ping);

    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginScreen}
          />

          <Stack.Screen
            options={{ headerShown: false }}
            name="SignUp"
            component={SignUpScreen}
          />

          <Stack.Screen
            options={{ headerShown: false }}
            name="Perfil"
            component={PerfilScreen}
          />

          <Stack.Screen
            options={{ headerShown: false }}
            name="Chat"
            component={ChatScreen}
          />

          <Stack.Screen
            options={{ headerShown: false }}
            name="Video"
            component={VideoScreen}
          />

          <Stack.Screen
            name="Muro"
            options={{
              title: 'Muro de Videos',
              headerStyle: {
                backgroundColor: 'midnightblue',
              },
              headerTintColor: '#fff',
              headerLeft: null,
            }}
            component={MuroScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export const styles = StyleSheet.create({
  safearea: {
    flex: 1,
  },
  headerContainer: {
    //flex: 1,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 48,
  },
  center: {
    alignItems: 'center',
  },
});

AppRegistry.registerComponent('main', () => HelloWorldApp);
