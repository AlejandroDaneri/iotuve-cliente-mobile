/* Import Libs */
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

/* Import Components */
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { PasswordRecoveryScreen } from './components/PasswordRecoveryScreen';
import { MuroScreen } from './components/MuroScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { FriendsScreen } from './components/FriendsScreen';
import { ChatScreen } from './components/ChatScreen';
import { EditProfileScreen } from './components/EditProfileScreen';
import { VideoScreen } from './components/VideoScreen';
import { UploadVideoScreen } from './components/UploadVideoScreen';

const Stack = createStackNavigator();

export default class ChotuveFiubaApp extends React.Component {

  render() {
	Icon.loadFont();
	  
    console.log('render - App.js');

    console.disableYellowBox = true;

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

AppRegistry.registerComponent('main', () => ChotuveFiubaApp);
