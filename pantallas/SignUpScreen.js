import React from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import {
  Button,
  TextInput,
  Provider as PaperProvider,
  Card
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import { styles } from '../utils/AppStyles';
import AppUtils from '../utils/AppUtils.js';

import { requestPing } from '../networking/ChotuveRequests.js';

import ChotuveLogo from '../ChotuveLogo.js';

export class SignUpScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      processPhase: 0,

      // info del formulario
      userFirstName: '',
      userLastname: '',
      userEmail: '',
      userPhone: '',
      userPassword: ''
    }
  }

  postFormData = () => {

    this.setState({
      processPhase: 1,
    });

    var misHeaders = new Headers({
      //Accept: 'application/json',
      'Content-Type': 'application/json',
      //'X-Auth-Token': '4567890',
    });

    var miBody = JSON.stringify({
      username: this.state.userEmail,
      password: this.state.userPassword,
      first_name: this.state.userFirstName,
      last_name: this.state.userLastname,
      contact: {
        email: this.state.userEmail,
        phone: this.state.userPhone
      }
    })

    
    fetch(AppUtils.endpoint_users, {
      method: 'POST',
      headers: misHeaders,
      body: miBody,
    })
      .then((response) => response.json().then(json => {
        return {
          data: json,
          fullResponse: response
        }
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

    /*
  let respuesta = JSON.stringify({ "avatar": { "url": "https://www.guido.com" }, "contact": { "email": "guido321@gmail.com", "phone": "3456789032" }, "date_created": "2020-05-11T02:54:33.327667", "date_updated": null, "first_name": "Guido", "id": "5eb8be69075ba130c412c074", "last_name": "Laghi", "username": "guido321@gmail.com" });
  console.log(respuesta);
  this.setState({
    data: respuesta,
  });
  */

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

              {this.state.processPhase == 0 &&
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

              {this.state.processPhase == 0 &&
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
        </SafeAreaView>
      </PaperProvider>
    );
  }
}
