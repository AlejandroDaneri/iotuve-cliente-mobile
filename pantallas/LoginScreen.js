import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import {
  Button,
  TextInput,
  Provider as PaperProvider,
} from 'react-native-paper';


import { styles } from '../utils/AppStyles';
import ChotuveLogo from '../ChotuveLogo.js';

export class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      logoColor: "blue",
    };
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
                  label="Ingrese su Email"
                  mode="outlined"
                />

                <TextInput
                  style={{ marginTop: 15 }}
                  label="Ingrese su Clave"
                  mode="outlined"
                />

                <Button
                  style={{ marginTop: 15 }}
                  icon="send"
                  mode="contained"
                  onPress={() => {
                    console.log('Click en boton Ingresar en Login');
                  }}>
                  Ingresar
                </Button>
              </View>
              <View
                style={{
                  margin: 10,
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                  backgroundColor: 'white',
                }}>

                <Button
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
                Entrar al Muro
                </Button>

            </View>
          </View>
        </SafeAreaView>
      </PaperProvider>
    );
  }
}
