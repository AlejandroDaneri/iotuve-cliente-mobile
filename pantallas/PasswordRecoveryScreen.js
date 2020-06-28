import React from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import {
  Button,
  TextInput,
  Provider as PaperProvider,
  Snackbar,
  Card
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import { styles } from '../utils/AppStyles';

import { requestPing } from '../networking/ChotuveRequests.js';

import ChotuveLogo from '../ChotuveLogo.js';
import EndPoints from '../utils/EndPoints';
import AppUtils from '../utils/AppUtils';

export class PasswordRecoveryScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this._onToggleSnackBar = this._onToggleSnackBar.bind(this);
    this._onDismissSnackBar = this._onDismissSnackBar.bind(this);

    this.state = {
      processPhase: 0,

      snackBarVisible: false,
      snackBarText: '',
      snackBarBackgroundColor: '#CC0000',

      // info del formulario
      userEmail: '',
      //Generic process error message
      process_error_msg: 'Error desconocido'
    };

    this.requestPasswordRecovery = this.requestPasswordRecovery.bind(this);
  }

  _onToggleSnackBar(texto) {
    this.setState({
      snackBarVisible: !this.state.snackBarVisible,
      snackBarText: texto,
    });
  }

  _onDismissSnackBar() {
    this.setState({
      snackBarVisible: false
    });
  }

  async requestPasswordRecovery() {

    this.setState({
      processPhase: 1,
    });

    var myHeaders = new Headers({});
    var myBody = JSON.stringify({
      username: this.state.userEmail,
    });

    fetch(EndPoints.passwordRecovery, {
      method: 'POST',
      headers: myHeaders,
      body: myBody,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);

        if (responseJson.fullResponse.ok) {
          this.setState({
            processPhase: 2,
          });
        } else {
          this.state.process_error_msg = 'Error desconocido';
          if ((responseJson.fullResponse.status == 400) && (responseJson.data.code == -1)) {
            this.state.process_error_msg = 'El email ingresado no es válido';
          }
          if ((responseJson.fullResponse.status == 400) && (responseJson.data.code == -2)) {
            this.state.process_error_msg = 'La cuenta está cerrada';
          }
          if ((responseJson.fullResponse.status == 400) && (responseJson.data.code == -3)) {
            this.state.process_error_msg = 'La cuenta usa "Sign in with Google", no se puede resetear la contraseña"';
          }
          if ((responseJson.fullResponse.status == 404) && (responseJson.data.code == -1)) {
            this.state.process_error_msg = 'El email ingresado no es válido';
          }
          this._onToggleSnackBar(this.state.process_error_msg);
          this.setState({
            processPhase: 0,
          });
        }
      })
      .catch((error) => {
        console.log('------- error ------');
        this.state.processPhase = 0;
        this.state.process_error_msg = 'Error desconocido';
        this._onToggleSnackBar(this.state.process_error_msg);
        console.log(error);
      });
  }

  render() {
    const { navigation } = this.props;

    return (
      <PaperProvider>
        <SafeAreaView style={styles.safearea}>
          <View
            style={{ backgroundColor: 'midnightblue', flex: 1, paddingHorizontal: 20, paddingTop: 5 }}>

            <ChotuveLogo />

            <View
              style={{
                flexDirection: 'column',
              }}>

              {(this.state.processPhase == 0) &&
                <View>
                  <View
                    style={{
                      margin: 10,
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      backgroundColor: 'white',
                    }}>
                    <TextInput
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={{ paddingVertical: 4 }}
                      dense="true"
                      label="Ingresá tu Email"
                      mode="outlined"
                      value={this.state.userEmail}
                      onChangeText={(userEmail) => this.setState({ userEmail })}
                    />
                    <Button
                      style={{ marginTop: 15 }}
                      icon="key"
                      mode="contained"
                      onPress={() => {
                        console.log('Click en boton RESETEAR CLAVE');
                        this.requestPasswordRecovery();
                      }}>
                      RESETEAR CLAVE
                     </Button>
                  </View>
                  <View
                    style={{
                      margin: 10,
                      marginTop: 20,
                      paddingHorizontal: 20,
                      paddingVertical: 20,
                      backgroundColor: 'white',
                    }}>
                    <Button
                      icon="arrow-left"
                      mode="outlined"
                      onPress={() => {
                        console.log('Navegacion -> Login'),
                          navigation.navigate('Login');
                        this.setState({
                          processPhase: 0,
                        });
                      }}>
                      Volver a Login
                  </Button>
                  </View>
                </View>
              }

              {this.state.processPhase == 1 &&
                <View
                  style={{
                    margin: 10,
                    paddingHorizontal: 20,
                    paddingVertical: 40,
                    backgroundColor: 'white',
                  }}>

                  <View>
                    <Button
                      loading="true"
                      mode="outlined">
                      Espera por favor
                    </Button>
                  </View>

                </View>
              }

              {this.state.processPhase == 2 &&
                <View
                  style={{
                    margin: 10,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    backgroundColor: 'white',
                  }}>

                  <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <Icon.Button
                      backgroundColor="white"
                      color="blue"
                      size={56}
                      name="key"
                    ></Icon.Button>
                    <Text style={{ fontSize: 24, textAlign: 'center' }}>Te enviamos un correo, por favor seguí las instrucciones para recuperar tu cuenta</Text>
                  </View>
                  <View style={{ padding: 8 }}></View>
                  <Button
                    icon="arrow-left"
                    mode="outlined"
                    onPress={() => {
                      console.log('Navegacion -> Login'),
                        this.setState({
                          processPhase: 0,
                        });
                      navigation.navigate('Login');
                    }}>
                    Volver a Login
                  </Button>
                </View>
              }
            </View>
          </View>

          <Snackbar
            style={{ backgroundColor: this.state.snackBarBackgroundColor }}
            visible={this.state.snackBarVisible}
            duration={3000}
            onDismiss={this._onDismissSnackBar}
            action={{
              onPress: () => {
                // Do something
                this._onDismissSnackBar();
              },
            }}
          >
            {this.state.snackBarText}
          </Snackbar>

        </SafeAreaView>
      </PaperProvider>
    );
  }
}
