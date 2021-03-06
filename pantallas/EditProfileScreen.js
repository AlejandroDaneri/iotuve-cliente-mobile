import React from 'react';
import { SafeAreaView, Text, View, Keyboard } from 'react-native';
import { Snackbar, Provider as PaperProvider, Divider, Card, List, Appbar, Button, TextInput, Colors, ActivityIndicator } from 'react-native-paper';
import UserData from '../UserData';
import AppAsyncStorage from '../utils/AppAsyncStorage';
import EndPoints from '../utils/EndPoints';
import AppUtils from '../utils/AppUtils';

import { styles } from '../utils/AppStyles';

export class EditProfileScreen extends React.Component {

  constructor(props) {
    super(props);

    this._onToggleSnackBar = this._onToggleSnackBar.bind(this);
    this._onDismissSnackBar = this._onDismissSnackBar.bind(this);

    this.state = {
      processPhase: 0,
      initialLoading: true,

      snackBarVisible: false,
      snackBarText: '',
      snackBarBackgroundColor: '#CC0000',

      editingUserData: false,
      editingUserPassword: false,

      userFirstName: '',
      userLastName: '',
      userEmail: '',
      userPhone: '',
      userAvatar: '',
      userLoginService: true,

      newUserFirstName: '',
      newUserLastName: '',
      newUserEmail: '',
      newUserPhone: '',
      newUserPassword: '',
      newUserAvatar: '',

      //Generic process error message
      process_error_msg: 'Error desconocido'
    };

    this.postFormData = this.postFormData.bind(this);
    this.postFormDataPassword = this.postFormDataPassword.bind(this);
    this.requestUserData = this.requestUserData.bind(this);
    this.updateUserData = this.updateUserData.bind(this);
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

  componentDidMount() {
    console.log('componentDidMount (EditProfileScreen)');
    this.requestUserData();
  }

  async requestUserData() {
    const sessionData = await AppAsyncStorage.getSession();
    const sessionDataJSON = JSON.parse(sessionData);
    const authToken = await AppAsyncStorage.getTokenFromSession();

    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });

    fetch(EndPoints.users + '/' + sessionDataJSON.session_data.username, {
      method: 'GET',
      headers: myHeaders,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);

        if (responseJson.fullResponse.ok) {
          this.updateUserData(responseJson.data);
        } else {
          if (responseJson.fullResponse.status == 401) {
            AppUtils.logout();
            this.props.navigation.navigate("Login");
          } else {
            this.state.process_error_msg = 'Error desconocido'
            this._onToggleSnackBar(this.state.process_error_msg);
          }
        }
        this.setState({ initialLoading: false })
      })
      .catch((error) => {
        console.log('------- error ------');
        this.state.process_error_msg = 'Error desconocido'
        this._onToggleSnackBar(this.state.process_error_msg);
        console.log(error);
      });
  }

  updateUserData(data) {
    this.setState({
      userFirstName: data.first_name,
      userLastName: data.last_name,
      userEmail: data.contact.email,
      userPhone: data.contact.phone,
      userAvatar: data.avatar.url,

      userLoginService: data.login_service,

      newUserFirstName: data.first_name,
      newUserLastName: data.last_name,
      newUserEmail: data.contact.email,
      newUserPhone: data.contact.phone,
      newUserAvatar: data.avatar.url,
    })
  }

  async postFormData() {
    const sessionData = await AppAsyncStorage.getSession();
    const sessionDataJSON = JSON.parse(sessionData);
    const authToken = await AppAsyncStorage.getTokenFromSession();

    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });

    var myBody = JSON.stringify({
      first_name: this.state.newUserFirstName,
      last_name: this.state.newUserLastName,
      contact: {
        email: this.state.newUserEmail,
        phone: this.state.newUserPhone
      },
      avatar: {
        url: this.state.newUserAvatar
      },
    });

    fetch(EndPoints.users + '/' + sessionDataJSON.session_data.username, {
      method: 'PUT',
      headers: myHeaders,
      body: myBody,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);

        if (responseJson.fullResponse.ok) {
          this.updateUserData(responseJson.data);
          this.setState({ editingUserData: false })
        } else {
          if (responseJson.fullResponse.status == 401) {
            AppUtils.logout();
            this.props.navigation.navigate("Login");
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
          }
        }
      })
      .catch((error) => {
        console.log('------- error ------');
        this.state.process_error_msg = 'Error desconocido'
        this._onToggleSnackBar(this.state.process_error_msg);
        console.log(error);
      });
  }

  async postFormDataPassword() {
    const sessionData = await AppAsyncStorage.getSession();
    const sessionDataJSON = JSON.parse(sessionData);
    const authToken = await AppAsyncStorage.getTokenFromSession();

    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });

    var myBody = JSON.stringify({
      op: "replace",
      path: "/password",
      value: this.state.newUserPassword,
    });

    fetch(EndPoints.users + '/' + sessionDataJSON.session_data.username, {
      method: 'PATCH',
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
        AppUtils.printResponseJson(responseJson);

        if (responseJson.fullResponse.ok) {
          // cuando cambio la clave, y estuvo todo OK. hago algo especial?
          this.setState({ editingUserData: false })
        } else {
          if (responseJson.fullResponse.status == 401) {
            AppUtils.logout();
            this.props.navigation.navigate("Login");
          } else {
            this.state.process_error_msg = 'Error desconocido'
            if ((responseJson.fullResponse.status == 400) && (responseJson.data.code == -1)) {
              this.state.process_error_msg = 'Por favor, verificá los datos ingresados';
            }
            this._onToggleSnackBar(this.state.process_error_msg);
          }
        }
      })
      .catch((error) => {
        console.log('------- error ------');
        this.state.process_error_msg = 'Error desconocido'
        this._onToggleSnackBar(this.state.process_error_msg);
        console.log(error);
      });
  }


  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <PaperProvider>
          <SafeAreaView style={styles.safearea}>
            <Appbar.Header style={{ backgroundColor: 'midnightblue' }}>
              <Appbar.BackAction
                onPress={(props) => {
                  this.props.navigation.goBack(null);
                }}
              />

              <Appbar.Content title="Editar Mis Datos" />
            </Appbar.Header>

            {this.state.initialLoading && <ActivityIndicator style={{ padding: 20 }} />}
            
            {this.state.editingUserPassword == false &&
            <Card elevation={10} style={{ margin: 10 }}>
              <Card.Title title="Datos Actuales" />
              <Card.Content>

                {this.state.editingUserData == false && this.state.editingUserPassword == false &&
                  <View>
                    <UserData
                      firstName={this.state.userFirstName}
                      lastName={this.state.userLastName}
                      email={this.state.userEmail}
                      phone={this.state.userPhone}
                      avatar={this.state.userAvatar}
                    />

                    <Button
                      style={{ margin: 10 }}
                      icon="account"
                      mode="outlined"
                      onPress={() => {
                        this.setState({ editingUserData: true, editingUserPassword: false });
                      }}
                    >
                      Editar Datos
                    </Button>
                  </View>
                }

                {this.state.editingUserData == true &&
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
                        disabled="true"
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
                      mode="contained"
                      onPress={() => {
                        this.postFormData();
                        this.setState({ editingUserData: false, editingUserPassword: false });
                      }}>
                      Confirmar Datos
                    </Button>

                    <Button
                      style={{ margin: 10 }}
                      mode="contained"
                      color="red"
                      onPress={() => {
                        this.setState({ editingUserData: false, editingUserPassword: false });
                      }}>
                      Cancelar
                    </Button>
                  </View>
                }

              </Card.Content>
            </Card>
            }

            {((this.state.editingUserData == false) && (this.state.userLoginService == false)) &&

              <Card elevation={10} style={{ margin: 10 }}>
                <Card.Title title="Cambio de Clave" />
                <Card.Content>

                  {this.state.editingUserPassword == false && this.state.editingUserData == false &&
                    <Button
                      style={{ margin: 10 }}
                      icon="key"
                      mode="outlined"
                      onPress={() => {
                        this.setState({ editingUserPassword: true, editingUserData: false });
                      }}>
                      Cambiar Mi Clave
                  </Button>
                  }

                  {this.state.editingUserPassword == true &&
                    <View>

                      <View style={{ flexDirection: 'row' }}>
                        <List.Icon color={Colors.blue500} icon="key" />

                        <View style={{ flex: 1, flexDirection: 'row' }}>
                          <TextInput
                            style={{ padding: 2, flex: 1 }}
                            secureTextEntry={true}
                            autoCapitalize="none"
                            dense="true"
                            //label="Nombre"
                            mode="outlined"
                            onChangeText={(newUserPassword) => this.setState({ newUserPassword })}
                          />
                        </View>
                      </View>

                      <Button
                        style={{ margin: 10 }}
                        mode="contained"
                        onPress={() => {
                          this.postFormDataPassword();
                          this.setState({ editingUserData: false, editingUserPassword: false });
                        }}>
                        Confirmar Clave
                    </Button>
                      <Button
                        style={{ margin: 10 }}
                        mode="contained"
                        color="red"
                        onPress={() => {
                          this.setState({ editingUserData: false, editingUserPassword: false });
                        }}>
                        Cancelar
                    </Button>

                    </View >
                  }
                </Card.Content>
              </Card>
            }

            <Snackbar
              style={{ backgroundColor: this.state.snackBarBackgroundColor, elevation: 20 }}
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
      </View >
    );
  }
}
