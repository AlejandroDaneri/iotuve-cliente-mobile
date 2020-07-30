import React from 'react';
import { SafeAreaView, Text, View, Keyboard } from 'react-native';
import { Snackbar, Provider as PaperProvider, Divider, Card, List, Appbar, Button, TextInput, Colors, ActivityIndicator } from 'react-native-paper';
import UserData from '../UserData';
import AppAsyncStorage from '../utils/AppAsyncStorage';
import EndPoints from '../utils/EndPoints';
import AppUtils from '../utils/AppUtils';

import firebase from '@react-native-firebase/app';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

import { styles } from '../utils/AppStyles';

export class EditProfileScreen extends React.Component {

  constructor(props) {
    super(props);

    this._onToggleSnackBar = this._onToggleSnackBar.bind(this);
    this._onDismissSnackBar = this._onDismissSnackBar.bind(this);

    //bindeo de funciones/eventos
    this.clickElegirUnaImagen = this.clickElegirUnaImagen.bind(this);
    this.uploadSelectedFile = this.uploadSelectedFile.bind(this);

    this.state = {
      processPhase: 0,
      uploadPhase: 0, // 0 = nada, 1 = avatar seleccionado, 2 = avatar subiendo, 3 = avatar subido;

      selectedFile: '',
      selectedFilePath: '',
      selectedFileSize: 0,
      uploadPercent100: 0,

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
      newUserPasswordConfirm: '',
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

  async clickElegirUnaImagen() {
    //var hasPermission = await AppUtils.requestPermissionsAndroid();
    var hasPermission = await AppUtils.checkPermissionsLibrary();
    if (hasPermission) {
      console.log('hasPermission');
      this.setState({ appHasPermission: true });
      this.selectOneFile();
    } else {
      console.log('NO hasPermission');
      this.setState({ appHasPermission: false });
    }
  }

  setPathToAvatar() {

    let pathToAvatar;

    if (Platform.OS === 'ios') {
      console.log('Set path to videos: iOS');
      pathToAvatar = '';
      this.setState({ selectedFilePath: this.state.selectedFile.uri, selectedFileSize: this.state.selectedFile.size });
    } else {
      console.log('Set path to videos: Android');
      pathToAvatar = RNFS.DownloadDirectoryPath;
      RNFS.readDir(pathToAvatar).then((result) => {
        var item = result.find(data => data.name === this.state.selectedFile.name);
        if (typeof item !== 'undefined') {
          this.setState({ selectedFilePath: item.path, selectedFileSize: item.size });
        }
      });

      pathToAvatar = RNFS.ExternalStorageDirectoryPath + "/DCIM/Camera";
      RNFS.readDir(pathToAvatar).then((result) => {
        var item = result.find(data => data.name === this.state.selectedFile.name);
        if (typeof item !== 'undefined') {
          this.setState({ selectedFilePath: item.path, selectedFileSize: item.size });
        }
      });

      pathToAvatar = RNFS.ExternalStorageDirectoryPath;
      RNFS.readDir(pathToAvatar).then((result) => {
        var item = result.find(data => data.name === this.state.selectedFile.name);
        if (typeof item !== 'undefined') {
          this.setState({ selectedFilePath: item.path, selectedFileSize: item.size });
        }
      });

      pathToAvatar = RNFS.DocumentDirectoryPath;
      RNFS.readDir(pathToAvatar).then((result) => {
        var item = result.find(data => data.name === this.state.selectedFile.name);
        if (typeof item !== 'undefined') {
          this.setState({ selectedFilePath: item.path, selectedFileSize: item.size });
        }
      });

      pathToAvatar = RNFS.ExternalDirectoryPath;
      RNFS.readDir(pathToAvatar).then((result) => {
        var item = result.find(data => data.name === this.state.selectedFile.name);
        if (typeof item !== 'undefined') {
          this.setState({ selectedFilePath: item.path, selectedFileSize: item.size });
        }
      });
    }

  }

  delayedUpload = () =>
    setTimeout(() => {
      this.uploadSelectedFile();
    }, 2000);

  async selectOneFile() {

    // reseteo el path si es que existia
    this.setState({ uploadFilePath: '' });

    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images], // mp4
      });

      this.setState({
        selectedFile: res,
        uploadPhase: 1
      });

      //Printing the log related to the file
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);

      // esta linea setea el path que luego se usara en el upload!

      this.setPathToAvatar();

      // timer o wait
      this.delayedUpload();


    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        alert('Accion Canceleda');
      } else {
        //For Unknown Error
        alert('Error desconocido: ' + JSON.stringify(err));
        throw err;
      }
    }
  }

  async postNewAvatar(uploadMetadata) {

    const sessionData = await AppAsyncStorage.getSession();
    const sessionDataJSON = JSON.parse(sessionData);
    const authToken = await AppAsyncStorage.getTokenFromSession();
    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });
    var myBody = JSON.stringify({ name: uploadMetadata.name, });

    console.log('postNewAvatar - 1');

    return new Promise((resolve, reject) => {

      fetch(EndPoints.users + '/' + sessionDataJSON.session_data.username + '/avatars', {
        method: 'POST',
        headers: myHeaders,
        body: myBody,
      })
        .then((response) => response.json().then(json => {
          return { data: json, fullResponse: response }
        }))
        .then((responseJson) => {
          console.log('postNewAvatar - 2');
          AppUtils.printResponseJson(responseJson);

          if (responseJson.fullResponse.ok) {

            // aca estoy cuando el app-server me respondio con exito sobre el post del video.
            this.setState({
              uploadPhase: 3,
            });

            resolve(responseJson);
          } else {
            if (responseJson.fullResponse.status == 401) {
              AppUtils.logout();
              this.props.navigation.navigate("Login");
            } else {
              // aca estoy cuando el app-server me respondio con error sobre el post del video.
              this.setState({
                uploadPhase: 3,
              });

              console.log('que hacer aqui?');
            }
          }

        })
        .catch((error) => {
          console.log('------- error ------');
          console.log(error);
        })
        .finally(() => {
          this.setState({ isLoadingFriendsRequests: false })
        });
    })
  }

  async uploadSelectedFile() {

    if (this.state.appHasPermission) {

      const pathFileToUpload = this.state.selectedFilePath;
      console.log('pathFileToUpload: ' + pathFileToUpload);

      // Construimos el path con la duration
      const firebaseReferenceName = AppUtils.generateRandomNumber() + '_' + this.state.selectedFile.name;
      const firebaseReferencePath = '/uploads/videos/test/' + firebaseReferenceName;
      console.log('Firebase path: ' + firebaseReferencePath);

      const reference = firebase.storage().ref(firebaseReferencePath);
      console.log('REFERENCE: ');
      console.log(reference);

      this.setState({
        uploadPhase: 2,
      });

      const putFileTask = reference.putFile(
        pathFileToUpload
      );

      putFileTask.on('state_changed', taskSnapshot => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ` + this.state.selectedFileSize);
        let currentUploadPercent = ((taskSnapshot.bytesTransferred / this.state.selectedFileSize).toFixed(2)) * 100;
        currentUploadPercent = Math.round(currentUploadPercent);
        this.setState({
          uploadPercent100: currentUploadPercent,
        })
      });

      putFileTask.then((firebaseUploadResult) => {
        console.log('Avatar uploaded to the bucket!');
        console.log(firebaseUploadResult);

        //Sincronizamos la respuesta entre Android e iOS
        console.log('Nombre a enviar a AppServer: ' + firebaseReferenceName);
        var appServerMetadata = firebaseUploadResult.metadata;
        appServerMetadata.name = firebaseReferenceName;


        this.postNewAvatar(appServerMetadata).then((resultAppServer) => {
          console.log('regreso del metodo del postNewAvatar();')
//          console.log('resultAppServer:');
//          console.log(resultAppServer);
          this.setState({
            uploadPhase: 3,
            userAvatar: resultAppServer.data.url,
          });

          const { route } = this.props;
          const params = route.params;
          params.replaceProfileAvatar(resultAppServer.data.url);
        });


      });

    } else {
      console.log('Dijo que no a otorgar permisos!');
    }

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
    });

    
    const { route } = this.props;
    const params = route.params;
    let itemData = {
      firstName: data.first_name,
      lastName: data.last_name,
      };
    params.replaceDataAvatar(itemData);
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

        this.state.newUserPassword = '';
        this.state.newUserPasswordConfirm = '';
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

            <View style={{ backgroundColor: 'white' }}>

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

                        {this.state.uploadPhase == 0 &&
                          <Button
                            style={{ margin: 6 }}
                            icon="image"
                            mode="outlined"
                            onPress={() => {
                              this.clickElegirUnaImagen();
                            }}
                          >
                            Elegir Nuevo Avatar
                        </Button>
                        }

                        {((this.state.uploadPhase == 1) || (this.state.uploadPhase == 2)) &&
                          <ActivityIndicator style={{ padding: 10 }} />
                        }

                        <Button
                          style={{ margin: 6 }}
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
                          color="#CC0000"
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
                              label="Nueva contraseña"
                              mode="outlined"
                              onChangeText={(newUserPassword) => this.setState({ newUserPassword })}
                            />
                          </View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                          <List.Icon color={Colors.blue500} icon="key" />

                          <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TextInput
                              style={{ padding: 2, flex: 1 }}
                              secureTextEntry={true}
                              autoCapitalize="none"
                              dense="true"
                              label="Confirmar contraseña"
                              mode="outlined"
                              onChangeText={(newUserPasswordConfirm) => this.setState({ newUserPasswordConfirm })}
                            />
                          </View>
                        </View>

                        <Button
                          style={{ margin: 10 }}
                          mode="contained"
                          disabled={(((this.state.newUserPassword == '') || (this.state.newUserPasswordConfirm == '')) ? true : false)}
                          onPress={() => {
                            if (this.state.newUserPassword === this.state.newUserPasswordConfirm) {
                              this.postFormDataPassword();
                              this.setState({ editingUserData: false, editingUserPassword: false });
                            }
                            else {
                              console.log('Las claves ingresadas no coinciden');
                              this._onToggleSnackBar('Las claves ingresadas no coinciden');
                            }
                          }}>
                          Confirmar Clave
                    </Button>
                        <Button
                          style={{ margin: 10 }}
                          mode="contained"
                          color="#CC0000"
                          onPress={() => {
                            this.state.newUserPassword = '';
                            this.state.newUserPasswordConfirm = '';
                            this.setState({ editingUserData: false, editingUserPassword: false });
                          }}>
                          Cancelar
                    </Button>

                      </View >
                    }
                  </Card.Content>
                </Card>
              }

            </View>

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
