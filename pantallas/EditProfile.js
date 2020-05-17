import React from 'react';
import { Text, View, Keyboard } from 'react-native';
import { Divider, Card, List, Appbar, Button, TextInput, Colors } from 'react-native-paper';
import UserData from '../UserData';
import AppAsyncStorage from '../utils/AppAsyncStorage';
import EndPoints from '../utils/EndPoints';

export class EditProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editing: false,

      newUserFirstName: '',
      newUserLastName: '',
      newUserEmail: '',
      newUserPhone: '',
    };

    this.postFormData = this.postFormData.bind(this);
    this.postFormDataPassword = this.postFormDataPassword.bind(this);
  }

  async postFormDataPassword() {
    // TODO: aca iria el PATCH de USERS para cambio de clave.
  }

  async postFormData() {

    const authData = await AppAsyncStorage.getToken();
    const authToken = JSON.parse(authData).authToken;

    var myHeaders = new Headers({
      'Content-Type': 'application/json',
      'X-Auth-Token': authToken,
    });

    var myBody = JSON.stringify({
      first_name: this.state.newUserFirstName,
      last_name: this.state.newUserLastName,
      contact: {
        email: this.state.newUserEmail,
        phone: this.state.newUserPhone
      }
    });
    console.log(myHeaders);
    console.log(myBody);

    fetch(EndPoints.users, {
      method: 'PUT',
      headers: myHeaders,
      body: myBody,
    })
      .then((response) => response.json().then(json => {
        return {
          data: json,
          fullResponse: response
        }
      }))
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.fullResponse.ok) {
          console.log(responseJson.fullResponse);
        } else {
          console.log('----------- NOT OK -----------');
          console.log(responseJson.fullResponse);
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
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: 'midnightblue' }}>
          <Appbar.BackAction
            onPress={(props) => {
              this.props.navigation.goBack(null);
            }}
          />

          <Appbar.Content title="Editar Mis Datos" />
        </Appbar.Header>

        <Card elevation={10} style={{ margin: 10, }}>
          <Card.Title title="Datos Actuales" />
          <Card.Content>

            {this.state.editing == false &&
              <View>

                <UserData firstName="Juan" lastName="Gomez" email="juangomez@gmail.com" phone="5621-2617" />

                <Button
                  style={{ margin: 10 }}
                  icon="account"
                  mode="outlined"
                  onPress={() => {
                    this.setState({ editing: true });
                  }}
                >
                  Editar Datos
              </Button>

              </View>
            }


            {this.state.editing == true &&
              <View>

                <View style={{ flexDirection: 'row' }}>
                  <List.Icon color={Colors.blue500} icon="account" />

                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TextInput
                      style={{ padding: 2, flex: 1 }}
                      dense="true"
                      //label="Nombre"
                      mode="outlined"
                      value={this.state.newUserFirstName}
                      onChangeText={(newUserFirstName) => this.setState({ newUserFirstName })}

                    />
                  </View>
                </View>

                <Divider />

                <View style={{ flexDirection: 'row' }}>
                  <List.Icon color={Colors.blue500} icon="account" />

                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TextInput
                      style={{ padding: 2, flex: 1 }}
                      dense="true"
                      //label="Apellido"
                      mode="outlined"
                      value={this.state.newUserLastName}
                      onChangeText={(newUserLastName) => this.setState({ newUserLastName })}
                    />
                  </View>
                </View>

                <Divider />

                <View style={{ flexDirection: 'row' }}>
                  <List.Icon color={Colors.blue500} icon="email" />

                  <TextInput
                    style={{ padding: 2, flex: 1 }}
                    dense="true"
                    //label="Email"
                    mode="outlined"
                    value={this.state.newUserEmail}
                    onChangeText={(newUserEmail) => this.setState({ newUserEmail })}
                  />
                </View>

                <Divider />

                <View style={{ flexDirection: 'row' }}>
                  <List.Icon color={Colors.blue500} icon="phone" />

                  <TextInput
                    style={{ padding: 2, flex: 1 }}
                    dense="true"
                    //label="Teléfono"
                    mode="outlined"
                    value={this.state.newUserPhone}
                    onChangeText={(newUserPhone) => this.setState({ newUserPhone })}
                  />
                </View>


                <Button
                  style={{ margin: 10 }}
                  icon="account"
                  mode="contained"
                  onPress={() => {
                    this.setState({ editing: true });
                    this.postFormData();
                  }}>
                  Confirmar Datos
                </Button>

              </View>
            }

          </Card.Content>
        </Card>


        {
          this.state.editing == false &&

          <Card elevation={10} style={{ margin: 10, }}>
            <Card.Title title="Cambio de Clave" />
            <Card.Content>
              <Button
                style={{ margin: 10 }}
                icon="key"
                mode="outlined"
                onPress={() => {
                  this.setState({ editing: true });
                }}>
                Cambiar Mi Clave
              </Button>
            </Card.Content>
          </Card>
        }

      </View >
    );
  }
}
