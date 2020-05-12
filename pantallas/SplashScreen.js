import React from 'react';
import { SafeAreaView, ActivityIndicator, Text, View } from 'react-native';

import {
  Provider as PaperProvider,
} from 'react-native-paper';

import { styles } from '../utils/AppStyles';
import AppUtils from '../utils/AppUtils.js';
import AppAsyncStorage from '../utils/AppAsyncStorage.js';

import ChotuveLogo from '../ChotuveLogo.js';

export class SplashScreen extends React.Component {

  delayedInit = () =>
    setTimeout(() => {
      this.initAuthToken();
    }, 2000)

  initAuthToken = async () => {

    const authData = await AppAsyncStorage.getToken();
    console.log('---- AppAsyncStorage getToken -> authData ----');
    console.log(authData);

    if (authData !== null) {
      const authDataJson = JSON.parse(authData);
      //console.log(authDataJson.authToken);
      // tengo token guardado, lo uso para continuar.

      //por ahora redirecciono a Muro sin revisar nada.
      this.props.navigation.navigate("Muro");
    } else {
      // no tengo token, no hago nada. Me quedo en esta pantalla de Login
      this.props.navigation.navigate("Login");
    }

  }

  componentDidMount() {
    console.log('Inicio sistema');
    console.log('Espero 2 segundos para dejar ver splash y luego inicio realmente');
    this.delayedInit();
  }

  render() {
    const { navigation } = this.props;
    return (

      <PaperProvider>
        <SafeAreaView style={styles.safearea}>
          <View
            style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'midnightblue', flex: 1, }}>

            <ChotuveLogo />

            <ActivityIndicator style={{paddingTop: 10}} size="large" color="#0000ff" />

            <Text style={{color: 'white', paddingVertical: 20}}>
              Estamos inicializando el sistema...
            </Text>

          </View>
        </SafeAreaView>
      </PaperProvider>

    );
  }
}
