import React from 'react';
import { SafeAreaView, View } from 'react-native';
import {
  Button,
  TextInput,
  Provider as PaperProvider,
} from 'react-native-paper';

import { styles } from '../utils/AppStyles';
import ChotuveLogo from '../ChotuveLogo.js';

export class SignUpScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      userLastname: '',
      userEmail: '',
      userPhone: '',
      userPassword: ''
    }
  }

  postFormData = () => {
    console.log('fetchData');

    /*
      {
         "name": "morpheus",
         "job": "leader"
     }
      */
    // "https://reactnative.dev/movies.json"
    // https://reqres.in/api/users

    fetch("https://reqres.in/api/users", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.userName,
        lastname: this.state.userLastname,
        email: this.state.userEmail,
        phone: this.state.userPhone,
        phone: this.state.userPassword,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          data: responseJson,
          loading: false,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };


  render() {
    const { navigation } = this.props;
    console.log('render - LoginScreen');

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
                  paddingVertical: 10,
                  backgroundColor: 'white',
                }}>

                <TextInput
                  dense="true"
                  label="Ingrese su Nombre"
                  mode="outlined"
                  onChangeText={(userName) => this.setState({ userName })}
                />

                <TextInput
                  style={{ paddingVertical: 4 }}
                  dense="true"
                  label="Ingrese su Apellido"
                  mode="outlined"
                  onChangeText={(userLastname) => this.setState({ userLastname })}
                />

                <TextInput
                  style={{ paddingVertical: 4 }}
                  dense="true"
                  label="Ingrese su Email"
                  mode="outlined"
                  onChangeText={(userEmail) => this.setState({ userEmail })}
                />

                <TextInput
                  style={{ paddingVertical: 4 }}
                  dense="true"
                  label="Ingrese su Teléfono"
                  mode="outlined"
                  onChangeText={(userPhone) => this.setState({ userPhone })}
                />

                <TextInput
                  style={{ paddingVertical: 4 }}
                  dense="true"
                  label="Ingrese su Clave"
                  mode="outlined"
                  secureTextEntry={true}
                  onChangeText={(userPassword) => this.setState({ userPassword })}
                />

                <Button
                  style={{ marginTop: 15 }}
                  icon="send"
                  mode="contained"
                  onPress={() => {
                    this.postFormData();
                    console.log('Click en boton Ingresar en Login');
                  }}>
                  Crear Nuevo Usuario
                </Button>

              </View>


              <Button
                style={{ marginTop: 15 }}
                color="grey"
                icon="play"
                compact="true"
                onPress={() => {
                  console.log('Navegacion -> Login'),
                    navigation.navigate('Login');
                }}>
                Volver a Login (debug)
                </Button>

            </View>
          </View>
        </SafeAreaView>
      </PaperProvider>
    );
  }
}
