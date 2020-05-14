import React from 'react';
import { AppRegistry, View } from 'react-native';

import AppUtils from './utils/AppUtils.js';
import { styles } from './utils/AppStyles.js';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from './pantallas/SplashScreen';
import { LoginScreen } from './pantallas/LoginScreen';
import { SignUpScreen } from './pantallas/SignUpScreen';
import { MuroScreen } from './pantallas/MuroScreen';
import { PerfilScreen } from './pantallas/PerfilScreen';
import { FriendRequestScreen } from './pantallas/FriendRequestScreen';
import { ChatScreen } from './pantallas/ChatScreen';
import { EditProfileScreen } from './pantallas/EditProfile';
import { VideoScreen } from './pantallas/VideoScreen';
import { UploadVideoScreen } from './pantallas/UploadVideoScreen';

const Stack = createStackNavigator();

export default class HelloWorldApp extends React.Component {

  render() {
    console.log('render - App.js');

    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
          }}>

          <Stack.Screen
            options={{ headerShown: false }}
            name="Splash"
            component={SplashScreen}
          />

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
            name="EditProfile"
            component={EditProfileScreen}
          />

          <Stack.Screen
            options={{ headerShown: false }}
            name="FriendRequest"
            component={FriendRequestScreen}
          />

          <Stack.Screen
            options={{ headerShown: false }}
            name="UploadVideo"
            component={UploadVideoScreen}
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

AppRegistry.registerComponent('main', () => HelloWorldApp);
