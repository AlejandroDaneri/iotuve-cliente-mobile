import React from 'react';
import { SafeAreaView, Text, View, Keyboard } from 'react-native';
import {
  Button,
  TextInput,
  Provider as PaperProvider,
  Divider,
} from 'react-native-paper';


import { styles } from '../utils/AppStyles';
import ChotuveLogo from '../ChotuveLogo.js';

import AppAsyncStorage from '../utils/AppAsyncStorage.js';
import EndPoints from '../utils/EndPoints';
import AppUtils from '../utils/AppUtils';

export class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      processPhase: 0,

      userEmail: '',
      userPassword: '',

      logoColor: "blue",
    };
  }

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
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);

        if (responseJson.fullResponse.ok) {
          AppAsyncStorage.saveSession(responseJson.data);

          this.setState({
            data: responseJson.data,
            processPhase: 2,
          });
          this.props.navigation.navigate("Muro");

        } else {
          this.setState({
            processPhase: 0,
          });
        }
      })
      .catch((error) => {
        console.log('------- error ------');
        console.log(error);
        this.setState({
          processPhase: 0,
        });
      });

  }

  componentDidMount(){
    console.log("componentDidMount > LoginScreen");
    console.log(this.state.processPhase);
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
                  <View style={{ paddingTop: 20, paddingBottom: 10 }}>
                    <Button
                      loading="true"
                      mode="contained">
                      Ingresando
                    </Button>
                  </View>
                }

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


              <Button
                style={{ marginTop: 15 }}
                color="grey"
                icon="arrow-right"
                compact="true"
                onPress={() => {
                  console.log('Navegacion -> Muro'),
                    navigation.navigate('Muro');
                }}>
                Entrar al Muro (debug)
                </Button>

            </View>
          </View>
        </SafeAreaView>
      </PaperProvider>
    );
  }
}
