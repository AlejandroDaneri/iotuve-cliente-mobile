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

    this.state = {
      processPhase: 0,

      // info del formulario
      userEmail: ''
    }

    this.requestPasswordRecovery = this.requestPasswordRecovery.bind(this);
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
          this.setState({
            processPhase: 0,
          });
        }
      })
      .catch((error) => {
        console.log('------- error ------');
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

              {this.state.processPhase == 0 &&
                <View>

                  <View
                    style={{
                      margin: 10,
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      backgroundColor: 'white',
                    }}>

                    <TextInput
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

                  </View>

                  <Text style={{ fontSize: 24, textAlign: 'center' }}>Clave reseteada, te enviamos un correo</Text>
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
        </SafeAreaView>
      </PaperProvider>
    );
  }
}
