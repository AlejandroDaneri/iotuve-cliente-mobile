import React from 'react';
import { AppRegistry, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import './Enviroment';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from './LoginScreen';
import { MuroScreen } from './MuroScreen';
import { PerfilScreen } from './PerfilScreen';
import { ChatScreen } from './ChatScreen';

const Stack = createStackNavigator();

export default class HelloWorldApp extends React.Component {

  render() {
    console.log("render - App.js");
    console.log(global.endpoint_ping);

    return (

      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Login'
          screenOptions={{
            headerShown: false
          }}>

          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginScreen} />

<Stack.Screen
            options={{ headerShown: false }}
            name="Perfil"
            component={PerfilScreen} />

<Stack.Screen
            options={{ headerShown: false }}
            name="Chat"
            component={ChatScreen} />

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
            component={MuroScreen} />

        </Stack.Navigator>
      </NavigationContainer>

    )

  }
}

export const styles = StyleSheet.create({
  safearea: {
    flex: 1,
  },
  headerContainer: {
    //flex: 1,
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  headerText: {
    color: 'white',
    fontSize: 50,
  },
  center: {
    alignItems: 'center'
  }
})

AppRegistry.registerComponent('main', () => HelloWorldApp);
