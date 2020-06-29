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

import ChotuveLogo from '../ChotuveLogo.js';
import EndPoints from '../utils/EndPoints';

export class SignUpScreen extends React.Component {
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
      userFirstName: '',
      userLastname: '',
      userEmail: '',
      userPhone: '',
      userPassword: '',
      //Generic process error message
      process_error_msg: 'Error desconocido'
    }
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

  postFormData = () => {

    this.setState({
      processPhase: 1,
    });

    var misHeaders = new Headers({ });

    var miBody = JSON.stringify({
      username: this.state.userEmail,
      password: this.state.userPassword,
      first_name: this.state.userFirstName,
      last_name: this.state.userLastname,
      contact: {
        email: this.state.userEmail,
        phone: this.state.userPhone
      },
      avatar: {
        url: 'https://ui-avatars.com/api/?name=' + (this.state.userFirstName ? this.state.userFirstName.charAt(0):'C') + '+' + (this.state.userFirstName ? this.state.userLastname.charAt(0):'T') + '&size=96&color=FFFFFF&background=191970'
      }
    })
    
    fetch(EndPoints.users, {
      method: 'POST',
      headers: misHeaders,
      body: miBody,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        console.log(responseJson.fullResponse.status);
        console.log(responseJson.data);

        if (responseJson.fullResponse.ok) {
          this.setState({
            data: responseJson.data,
            processPhase: 2,
          });
        } else {
          this.state.process_error_msg = 'Error desconocido'
          if ((responseJson.fullResponse.status == 400) && (responseJson.data.code == -1)) {
            this.state.process_error_msg = 'Por favor, verificá los datos ingresados';
          }
          if ((responseJson.fullResponse.status == 400) && (responseJson.data.code == -2)) {
            this.state.process_error_msg = 'Por favor, verificá la información de contacto ingresada';
          }
          if ((responseJson.fullResponse.status == 400) && (responseJson.data.code == -3)) {
            this.state.process_error_msg = 'Formato incorrecto de avatar';
          }
          this._onToggleSnackBar(this.state.process_error_msg);
          this.setState({
            processPhase: 3,
          });
        }
      })
      .catch((error) => {
        console.log('------- error ------');
        console.log(error);
        this.setState({
          processPhase: 3,
          process_error_msg: 'Error desconocido'
        });
        this._onToggleSnackBar(this.state.process_error_msg);
      });

  };

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

              {((this.state.processPhase == 0) || (this.state.processPhase == 3)) &&
                <View
                  style={{
                    margin: 10,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    backgroundColor: 'white',
                  }}>

                  <TextInput
                    dense="true"
                    label="Ingresá tu Nombre"
                    mode="outlined"
                    value={this.state.userFirstName}
                    onChangeText={(userFirstName) => this.setState({ userFirstName })}
                  />

                  <TextInput
                    style={{ paddingVertical: 4 }}
                    dense="true"
                    label="Ingresá tu Apellido"
                    mode="outlined"
                    value={this.state.userLastname}
                    onChangeText={(userLastname) => this.setState({ userLastname })}
                  />

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

                  <TextInput
                    style={{ paddingVertical: 4 }}
                    dense="true"
                    label="Ingresá tu Teléfono"
                    mode="outlined"
                    value={this.state.userPhone}
                    onChangeText={(userPhone) => this.setState({ userPhone })}
                  />

                  <TextInput
                    style={{ paddingVertical: 4 }}
                    dense="true"
                    label="Ingresá tu Clave"
                    mode="outlined"
                    secureTextEntry={true}
                    value={this.state.userPassword}
                    onChangeText={(userPassword) => this.setState({ userPassword })}
                  />

                  <Button
                    style={{ marginTop: 15 }}
                    icon="send"
                    mode="contained"
                    onPress={() => {
                      console.log('Click en boton Crear Nuevo Usuario');
                      this.postFormData();
                    }}>
                    Crear Nuevo Usuario
                </Button>
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
                      Espera, CREANDO USUARIO
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
                      color="green"
                      size={56}
                      name="check-circle"
                    ></Icon.Button>

                  </View>

                  <Text style={{ fontSize: 24, textAlign: 'center' }}>Usuario creado con éxito</Text>
                  <View style={{ padding: 8 }}></View>
                  <Button
                    icon="arrow-left"
                    mode="outlined"
                    onPress={() => {
                      console.log('Navegacion -> Login'),
                        navigation.navigate('Login');
                    }}>
                    Volver a Login
                  </Button>

                </View>
              }

              {((this.state.processPhase == 0) || (this.state.processPhase == 3)) &&
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
