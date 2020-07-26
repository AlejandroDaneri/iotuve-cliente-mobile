import React from 'react';
import { SafeAreaView, ActivityIndicator, Text, View, StatusBar } from 'react-native';
import { StackActions } from '@react-navigation/native';

import { Provider as PaperProvider } from 'react-native-paper';

import { styles } from '../utils/AppStyles';
import AppAsyncStorage from '../utils/AppAsyncStorage.js';

import ChotuveLogo from '../ChotuveLogo.js';
import EndPoints from '../utils/EndPoints';
import axios from "axios"


export class SplashScreen extends React.Component {

  delayedInit = () =>
    setTimeout(() => {
      this.initAuthToken();
    }, 2000)

  initAuthToken = async () => {

    const sessionData = await AppAsyncStorage.getSession();
    console.log('---- AppAsyncStorage getSession -> sessionData ----');
    console.log(sessionData);

    if (sessionData !== null) {
      const authToken = await AppAsyncStorage.getTokenFromSession();
      // tengo token guardado, lo uso para continuar.

      axios.get(EndPoints.sessions, {
        headers: { 'X-Auth-Token': authToken },
      })
        .then(response => {
          const replaceAction = StackActions.replace('Muro');
          this.props.navigation.dispatch(replaceAction);
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 401) {
            // no tengo token, no hago nada. Me quedo en esta pantalla de Login
            const replaceAction = StackActions.replace('Login');
            this.props.navigation.dispatch(replaceAction);
          }
        });

    } else {
      // no tengo token, no hago nada. Me quedo en esta pantalla de Login
      const replaceAction = StackActions.replace('Login');
      this.props.navigation.dispatch(replaceAction);
    }

  }

  componentDidMount() {
    console.log('Inicio sistema');
    console.log('Espero 2 segundos para splash, luego inicio real');
    this.delayedInit();
  }

  render() {

    return (

      <PaperProvider>
        <SafeAreaView style={styles.safearea}>
          <StatusBar barStyle="light-content" />
            <View
              style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'midnightblue', flex: 1, }}>

              <ChotuveLogo />

              <ActivityIndicator style={{ paddingTop: 10 }} size="large" color="#0000ff" />

              <Text style={{ color: 'white', paddingVertical: 20 }}>
                Estamos inicializando el sistema...
              </Text>

            </View>
        </SafeAreaView>
      </PaperProvider>

    );
  }
}
