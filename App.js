import React from 'react';
import { AppRegistry } from 'react-native';
import { TouchableOpacity, StyleSheet } from 'react-native';

import './Enviroment';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from './LoginScreen';
import { MuroScreen } from './MuroScreen';

const Stack = createStackNavigator();

export default class HelloWorldApp extends React.Component {

  render() {
    console.log("render - App.js");
    console.log(global.endpoint_ping);

    return (

      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Muro'
          screenOptions={{
            headerShown: false
          }}>

          <Stack.Screen
            name="Login"
            component={LoginScreen} />

          <Stack.Screen
            name="Muro"
            options={{ title: 'Titulo del Muro' }}
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
