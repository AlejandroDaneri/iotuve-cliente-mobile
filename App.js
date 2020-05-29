import React from 'react';
import { AppRegistry, View } from 'react-native';

import { styles } from './utils/AppStyles.js';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from './pantallas/SplashScreen';
import { LoginScreen } from './pantallas/LoginScreen';
import { SignUpScreen } from './pantallas/SignUpScreen';
import { PasswordRecoveryScreen } from './pantallas/PasswordRecoveryScreen';
import { MuroScreen } from './pantallas/MuroScreen';
import { ProfileScreen } from './pantallas/ProfileScreen';
import { FriendsScreen } from './pantallas/FriendsScreen';
import { ChatScreen } from './pantallas/ChatScreen';
import { EditProfileScreen } from './pantallas/EditProfileScreen';
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

          <Stack.Screen options={{ headerShown: false }} name="Splash" component={SplashScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
          <Stack.Screen options={{ headerShown: false }} name="SignUp" component={SignUpScreen} />
          <Stack.Screen options={{ headerShown: false }} name="PasswordRecovery" component={PasswordRecoveryScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Profile" component={ProfileScreen} />
          <Stack.Screen options={{ headerShown: false }} name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Friends" component={FriendsScreen} />
          <Stack.Screen options={{ headerShown: false }} name="UploadVideo" component={UploadVideoScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Chat" component={ChatScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Video" component={VideoScreen} />
          <Stack.Screen
            options={{
              title: 'Muro de Videos',
              headerStyle: {
                backgroundColor: 'midnightblue',
              },
              headerTintColor: '#fff',
              headerLeft: null,
            }}
            name="Muro" component={MuroScreen}
          />

        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

AppRegistry.registerComponent('main', () => HelloWorldApp);
