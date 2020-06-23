import React from 'react';
import { StackActions } from '@react-navigation/native';

import { SafeAreaView, Text, View } from 'react-native';
import { Button, TextInput, Provider as PaperProvider, Snackbar } from 'react-native-paper';

import { styles } from '../utils/AppStyles';
import ChotuveLogo from '../ChotuveLogo.js';

import AppAsyncStorage from '../utils/AppAsyncStorage.js';
import EndPoints from '../utils/EndPoints';
import AppUtils from '../utils/AppUtils';

import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

export class LoginScreen extends React.Component {
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
      snackBarBackgroundColor: 'blue',

      userEmail: '',
      userPassword: '',

      logoColor: "blue",
    };
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

  _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      console.log('Sign in with Google: cerrando sesión existente');
      this._signOut();
    } else {
      //alert("Please Login");
      console.log('Sign in with Google: por favor iniciar sesión');
    }
    this.setState({ gettingLoginStatus: false });
  };

  _signIn = async () => {
    //Prompts a modal to let the user sign in into your application.
    try {
      await GoogleSignin.hasPlayServices({
        //Check if device has Google Play Services installed.
        //Always resolves to true on iOS.
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      //Success, log user data
      console.log('Sign in with Google: Info de usuario --> ', userInfo);
      this.setState({ userInfo: userInfo });
      //Life is good, process the login request!
      console.log('Sign in with Google: procesando login válido para el usuario ' + this.state.userInfo.user.email);
      this.postGoogleLogin();
    } catch (error) {
      console.log('Sign in with Google:', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Sign in with Google: cancelado por el usuario!');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in with Google: iniciando sesión...');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Sign in with Google: Play Services no disponible o desactualizado');
      } else {
        console.log('Sign in with Google: error desconocido (' + error.code + ')');
      }
    }
  };

  _signOut = async () => {
    //Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ userInfo: null }); // Remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  postGoogleLogin = () => {

    this.setState({
      processPhase: 1,
    });

    var myHeaders = new Headers({});

    var myBody = JSON.stringify({
      username: this.state.userInfo.user.email,
      login_service_token: this.state.userInfo.idToken,
    });

    console.log('Sign in with Google: contactando al APP Server...');
    fetch(EndPoints.sessions, {
      method: 'POST',
      headers: myHeaders,
      body: myBody,
    })
      .then((response) =>
        response.json().then((json) => {
          return { data: json, fullResponse: response };
        }),
      )
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);

        if (responseJson.fullResponse.ok) {
          AppAsyncStorage.saveSession(responseJson.data);

          console.log('Sign in with Google: autorizado, ingresando a la aplicación');
          this.setState({
            data: responseJson.data,
            processPhase: 2,
          });
          const replaceAction = StackActions.replace('Muro');
          this.props.navigation.dispatch(replaceAction);
        } else {
          //Si el usuario no existe, hay que crearlo antes!
          //***********************************************
          if ((responseJson.fullResponse.status == 401) && (responseJson.data.code == -4)) {
            //Si es HTTP 401 y code -4, hay que registralo
            console.log('Sign in with Google: nuevo inicio de sesión. Creando usuario...');

            var misHeaders = new Headers({});

            var miBody = JSON.stringify({
              username: this.state.userInfo.user.email,
              first_name: this.state.userInfo.user.givenName,
              last_name: this.state.userInfo.user.familyName,
              contact: {
                email: this.state.userInfo.user.email,
                phone: '-'
              },
              avatar: {
                url: this.state.userInfo.user.photo
              },
              login_service: true
            });

            fetch(EndPoints.users, {
              method: 'POST',
              headers: misHeaders,
              body: miBody,
            })
              .then((response_create) =>
                response_create.json().then((json) => {
                  return { data: json, fullResponse: response_create };
                }),
              )
              .then((responseJson_create) => {
                AppUtils.printResponseJson(responseJson_create);
                if (responseJson_create.fullResponse.ok) {
                  console.log('Sign in with Google: usuario creado');
                  console.log('Sign in with Google: contactando al APP Server...');
                  fetch(EndPoints.sessions, {
                    method: 'POST',
                    headers: myHeaders,
                    body: myBody,
                  })
                    .then((response_relogin) =>
                      response_relogin.json().then((json) => {
                        return { data: json, fullResponse: response_relogin };
                      }),
                    )
                    .then((responseJson_relogin) => {
                      AppUtils.printResponseJson(responseJson_relogin);
                      if (responseJson_relogin.fullResponse.ok) {
                        AppAsyncStorage.saveSession(responseJson_relogin.data);

                        console.log('Sign in with Google: autorizado, ingresando a la aplicación');
                        this.setState({
                          data: responseJson_relogin.data,
                          processPhase: 2,
                        });
                        const replaceAction = StackActions.replace('Muro');
                        this.props.navigation.dispatch(replaceAction);
                      } else {

                        console.log('Sign in with Google: denegado. Cerrando sesión...');
                        //Login failed, log out of Google
                        this._signOut();
                        this.state.login_error_msg = 'Error iniciando sesión con Google';
                        this._onToggleSnackBar(this.state.login_error_msg);
                        this.setState({
                          processPhase: 3,
                        });
                      }
                    })
                    .catch((error) => {
                      console.log('------- error ------');
                      console.log(error);
                      this.state.login_error_msg = 'Error desconocido';
                      this._onToggleSnackBar(this.state.login_error_msg);
                      this.setState({
                        processPhase: 3,
                      });
                    });
                } else {
                  console.log('Sign in with Google: error creando usuario. Cerrando sesión...');
                  //User creation failed, log out of Google
                  this._signOut();
                  this.state.login_error_msg = 'Error creando nuevo usuario';
                  this._onToggleSnackBar(this.state.login_error_msg);
                  this.setState({
                    processPhase: 3,
                  });
                }
              })
              .catch((error) => {
                console.log('------- error ------');
                console.log(error);
                //Login failed, log out of Google
                this._signOut();
                this.state.login_error_msg = 'Error desconocido';
                this.setState({
                  processPhase: 3,
                });
              });
          } else {
            console.log('Sign in with Google: denegado. Cerrando sesión...');
            this.state.login_error_msg = 'Error iniciando sesión con Google';
            if ((responseJson.fullResponse.status == 400) && (responseJson.data.code == -2)) {
              this.state.login_error_msg = 'La cuenta está cerrada';
              this._onToggleSnackBar(this.state.login_error_msg);
            }
            if ((responseJson.fullResponse.status == 400) && (responseJson.data.code == -3)) {
              this.state.login_error_msg = 'Usuario ya registrado, por favor utilice usuario y contraseña';
              this._onToggleSnackBar(this.state.login_error_msg);
            }
            //Login failed, log out of Google
            this._signOut();
            this.setState({
              processPhase: 3,
            });
          }
        }
      })
      .catch((error) => {
        console.log('------- error ------');
        console.log(error);
        //Login failed, log out of Google
        this._signOut();
        this.state.login_error_msg = 'Error desconocido';
        this.setState({
          processPhase: 3,
        });
      });
  };

  postFormData = () => {

    this.setState({
      processPhase: 1,
    });

    var myHeaders = new Headers({});

    var myBody = JSON.stringify({
      username: this.state.userEmail,
      password: this.state.userPassword,
    });

    fetch(EndPoints.sessions, {
      method: 'POST',
      headers: myHeaders,
      body: myBody,
    })
      .then((response) =>
        response.json().then((json) => {
          return { data: json, fullResponse: response };
        }),
      )
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);

        if (responseJson.fullResponse.ok) {
          AppAsyncStorage.saveSession(responseJson.data);

          this.setState({
            data: responseJson.data,
            processPhase: 2,
          });
          const replaceAction = StackActions.replace('Muro');
          this.props.navigation.dispatch(replaceAction);

        } else {

          this.state.login_error_msg = 'Error desconocido';
          if ((responseJson.fullResponse.status == 400) && (responseJson.data.code == -1)) {
            this.state.login_error_msg = 'Por favor ingrese su usuario y contraseña';
            this._onToggleSnackBar(this.state.login_error_msg);
          }
          if ((responseJson.fullResponse.status == 400) && (responseJson.data.code == -2)) {
            this.state.login_error_msg = 'La cuenta está cerrada';
            this._onToggleSnackBar(this.state.login_error_msg);
          }
          if ((responseJson.fullResponse.status == 400) && (responseJson.data.code == -4)) {
            this.state.login_error_msg = 'Por favor utilice "Sign in with Google"';
            this._onToggleSnackBar(this.state.login_error_msg);
          }
          if ((responseJson.fullResponse.status == 401) && (responseJson.data.code == -2)) {
            this.state.login_error_msg = 'Usuario o contraseña incorrectos';
            this._onToggleSnackBar(this.state.login_error_msg);
          }
          if ((responseJson.fullResponse.status == 401) && (responseJson.data.code == -4)) {
            this.state.login_error_msg = 'No se encontró el usuario';
            this._onToggleSnackBar(this.state.login_error_msg);
          }
          this.setState({
            processPhase: 3,
          });
        }
      })
      .catch((error) => {
        console.log('------- error ------');
        console.log(error);
        this.state.login_error_msg = 'Error desconocido';
        this._onToggleSnackBar(this.state.login_error_msg);
        this.setState({
          processPhase: 3,
        });
      });
  };

  componentDidMount() {
    console.log('componentDidMount > LoginScreen');
    console.log('processPhase: ' + this.state.processPhase);
    //initial configuration
    console.log('Sign in with Google: configurando...');
    GoogleSignin.configure({
      webClientId: '968905452769-1sspsng4hdnimgvn23shje99q9916jgk.apps.googleusercontent.com',
    });
    //Check if user is already signed in
    this._isSignedIn();
    //Generic login error message
    this.state.login_error_msg = 'Error desconocido';
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
              <View
                style={{
                  margin: 10,
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                  backgroundColor: 'white',
                }}>

                <TextInput
                  keyboardType="email-address"
                  style={{ m: 15 }}
                  label="Ingresá tu Email"
                  mode="outlined"
                  onChangeText={(userEmail) => this.setState({ userEmail })}
                />

                <TextInput
                  style={{ marginTop: 15 }}
                  label="Ingresá tu Clave"
                  mode="outlined"
                  secureTextEntry={true}
                  onChangeText={(userPassword) => this.setState({ userPassword })}
                />

                {this.state.processPhase != 1 &&
                  <Button
                    style={{ marginTop: 15 }}
                    icon="send"
                    mode="contained"
                    onPress={() => {
                      console.log('Click en boton Ingresar en Login');
                      this.postFormData();
                    }}>
                    Ingresar
                </Button>
                }

                {this.state.processPhase == 1 &&
                  <View style={{ marginTop: 15 }}>
                    <Button
                      loading="true"
                      mode="contained">
                      Ingresando
                    </Button>
                  </View>
                }

                <View style={{ alignItems: 'center', paddingTop: 8 }}>

                  <GoogleSigninButton
                    style={{ width: 250 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={this._signIn}
                    disabled={this.state.isSigninInProgress} />

                </View>

              </View>
              <View
                style={{
                  margin: 10,
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                  backgroundColor: 'white',
                }}>

                <Button
                  icon="key"
                  mode="outlined"
                  onPress={() => {
                    console.log('Navegacion -> PasswordRecovery'),
                      navigation.navigate('PasswordRecovery');
                  }}>
                  OLVIDÉ MI CLAVE
                </Button>

                <Button
                  style={{ marginTop: 10 }}
                  icon="account"
                  mode="outlined"
                  onPress={() => {
                    console.log('Navegacion -> Nuevo Usuario'),
                      navigation.navigate('SignUp');
                  }}>
                  SOY UN NUEVO USUARIO
                </Button>

              </View>

            </View>


          </View>

          <Snackbar
            style={{ backgroundColor: this.state.snackBarBackgroundColor }}
            visible={this.state.snackBarVisible}
            duration={2000}
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
