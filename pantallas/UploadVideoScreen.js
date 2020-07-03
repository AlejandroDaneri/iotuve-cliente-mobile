import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { List, TextInput, Switch, Divider, Card, Button, Appbar, Chip, ProgressBar, Colors } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import PruebaPlayVideoFile from '../PruebaPlayVideoFile.js';
import AppUtils from '../utils/AppUtils.js';

import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import EndPoints from '../utils/EndPoints.js';
import AppAsyncStorage from '../utils/AppAsyncStorage.js';
import { Image } from 'react-native-elements';


export class UploadVideoScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      appHasPermission: null,
      uploadPhase: 0, // 0 = nada, 1 = video seleccionado, 2 = video subiendo, 3 = video subido;

      selectedFile: '',
      selectedFilePath: '',
      selectedFileSize: 0,
      uploadPercent100: 0,

      videoPublic: false,
      visibilityDescription: 'Privado',
      videoTitle: '',
      videoDescription: '',
      videoVisibility: 'private',
    };

    //bindeo de funciones/eventos
    this.clickElegirUnVideo = this.clickElegirUnVideo.bind(this);
    this.uploadSelectedFile = this.uploadSelectedFile.bind(this);
    this.postNewVideo = this.postNewVideo.bind(this);
  }

  async postNewVideo(uploadMetadata) {

    const authToken = await AppAsyncStorage.getTokenFromSession();

    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });

    var myBody = JSON.stringify({
      title: this.state.videoTitle,
      description: this.state.videoDescription,
      visibility: this.state.videoVisibility,
      media: {
        "name": uploadMetadata.name,
        "date_created": uploadMetadata.timeCreated,
        "size": uploadMetadata.size,
        "type": uploadMetadata.contentType,
      },
      location: {
        "latitude": -58.416572,
        "longitude": -34.6024161,
      },
    });

    console.log('postNewVideo - 1');

    return new Promise((resolve, reject) => {

      fetch(EndPoints.videos, {
        method: 'POST',
        headers: myHeaders,
        body: myBody,
      })
        .then((response) => response.json().then(json => {
          return { data: json, fullResponse: response }
        }))
        .then((responseJson) => {
          console.log('postNewVideo - 2');
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

  setPathToVideo() {

    let pathToVideos;

    pathToVideos = RNFS.DownloadDirectoryPath;
    RNFS.readDir(pathToVideos).then((result) => {
      var item = result.find(data => data.name === this.state.selectedFile.name);
      if (typeof item !== 'undefined') {
        this.setState({ selectedFilePath: item.path, selectedFileSize: item.size });
      }
    });

    pathToVideos = RNFS.ExternalStorageDirectoryPath + "/DCIM/Camera";
    RNFS.readDir(pathToVideos).then((result) => {
      var item = result.find(data => data.name === this.state.selectedFile.name);
      if (typeof item !== 'undefined') {
        this.setState({ selectedFilePath: item.path, selectedFileSize: item.size });
      }
    });

    pathToVideos = RNFS.ExternalStorageDirectoryPath;
    RNFS.readDir(pathToVideos).then((result) => {
      var item = result.find(data => data.name === this.state.selectedFile.name);
      if (typeof item !== 'undefined') {
        this.setState({ selectedFilePath: item.path, selectedFileSize: item.size });
      }
    });

    pathToVideos = RNFS.DocumentDirectoryPath;
    RNFS.readDir(pathToVideos).then((result) => {
      var item = result.find(data => data.name === this.state.selectedFile.name);
      if (typeof item !== 'undefined') {
        this.setState({ selectedFilePath: item.path, selectedFileSize: item.size });
      }
    });

    pathToVideos = RNFS.ExternalDirectoryPath;
    RNFS.readDir(pathToVideos).then((result) => {
      var item = result.find(data => data.name === this.state.selectedFile.name);
      if (typeof item !== 'undefined') {
        this.setState({ selectedFilePath: item.path, selectedFileSize: item.size });
      }
    });

  }

  async uploadSelectedFile() {

    if (this.state.appHasPermission) {

      const pathFileToUpload = this.state.selectedFilePath;
      const firebaseReferencePath = '/uploads/videos/test/' + AppUtils.generateRandomNumber() + '_' + this.state.selectedFile.name;

      console.log(firebaseReferencePath);
      const reference = firebase.storage().ref(firebaseReferencePath);
      console.log('REFERENCE: ');
      console.log(reference);

      this.setState({
        uploadPhase: 2,
      });

      console.log('pathFileToUpload: ' + pathFileToUpload);

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
        console.log('Video uploaded to the bucket!');
        console.log(firebaseUploadResult);

        this.postNewVideo(firebaseUploadResult.metadata).then((resultAppServer) => {
          console.log('regreso del metodo del postNewVideo();')
          console.log('resultAppServer:');
          console.log(resultAppServer);
          this.setState({
            uploadPhase: 3,
          });
        });

      });


    } else {
      console.log('Dijo que no a otorgar permisos!');
    }

  }

  async selectOneFile() {

    // reseteo el path si es que existia
    this.setState({ uploadFilePath: '' });

    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video], // mp4
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });

      this.setState({ selectedFile: res, uploadPhase: 1 });

      //Printing the log related to the file
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);

      // esta linea setea el path que luego se usara en el upload!
      this.setPathToVideo();

      /*
      RNFS.exists(decodeURIComponent(this.state.selectedFile.name)).then((resultExists) => {
        console.log('*****************');
        console.log(resultExists);
        console.log('*****************');
      }).catch((error) => {
        console.log('-------- Error RNFS.exists ---------------');
        console.log(error);
      });

      RNFS.stat(decodeURIComponent(this.state.selectedFile.name)).then((statResult) => {
        console.log('*****************');
        console.log(statResult);
        console.log('*****************');
      }).catch((error) => {
        console.log('-------- Error RNFS.stat ---------------');
        console.log(error);
      });
      */

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

  async clickElegirUnVideo() {
    var hasPermission = await AppUtils.requestPermissionsAndroid();
    if (hasPermission) {
      console.log('hasPermission');
      this.setState({ appHasPermission: true });
      this.selectOneFile();
    } else {
      console.log('NO hasPermission');
      this.setState({ appHasPermission: false });
    }
  }

  _onToggleSwitch = () => this.setState(state => ({
    videoPublic: !this.state.videoPublic,
    videoVisibility: this.state.videoPublic ? 'private' : 'public',
    visibilityDescription: this.state.videoPublic ? 'Privado' : 'Público',
  }));

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

          <Appbar.Content title="Nuevo Contenido" />
        </Appbar.Header>


        {this.state.uploadPhase == 0 &&
          <View>
            <Card elevation={10} style={styles.cardContainer}>
              <Card.Title
                title="Subir un nuevo video"
              />
              <Divider />
              <Card.Content>

                <Divider />

                <View style={{ alignItems: 'center' }}>
                  <Image
                    style={{ width: 300, height: 300 }}
                    source={require('../images/undraw_video_upload_3d4u.png')}
                  />
                </View>

                {/*To show single file attribute*/}
                <Button
                  style={{ marginTop: 15 }}
                  icon="video"
                  mode="contained"
                  disabled={this.state.uploadPhase > 0 ? "false" : ""}
                  onPress={this.clickElegirUnVideo}>
                  Elegir un Video
              </Button>

              </Card.Content>
            </Card>
          </View>
        }

        {this.state.selectedFile.uri &&
          <View>

            {this.state.uploadPhase == 1 &&
              <Card elevation={10} style={styles.cardContainer}>
                <Chip style={{ margin: 10 }} icon="check">Bien! Ya elegiste el video.</Chip>
                <Chip style={{ marginHorizontal: 10, marginBottom: 10 }} icon="more">Ahora agregá más información asociada.</Chip>
              </Card>
            }

            <Card elevation={10} style={styles.cardContainer}>

              <Card.Title
                title="Tu nuevo contenido"
              />
              <Divider />
              <Card.Content>

                {this.state.uploadPhase == 1 &&
                  <View>
                    <TextInput
                      style={{ paddingVertical: 4 }}
                      dense="true"
                      label="Indicar Título del video"
                      mode="outlined"
                      value={this.state.videoTitle}
                      onChangeText={(videoTitle) => this.setState({ videoTitle })}
                    />

                    <TextInput
                      style={{ paddingVertical: 4 }}
                      dense="true"
                      label="Agregar Descripción"
                      mode="outlined"
                      value={this.state.videoDescription}
                      onChangeText={(videoDescription) => this.setState({ videoDescription })}
                    />

                    <List.Item
                      title="Visibilidad"
                      description={this.state.visibilityDescription}
                      left={props => <List.Icon {...props} icon="lock" />}
                      right={props => <Switch
                        value={this.state.videoPublic}
                        onValueChange={this._onToggleSwitch}
                      />}
                    />

                    <Button
                      style={{ marginTop: 10 }}
                      icon="upload"
                      mode="contained"
                      disabled={this.state.uploadInProgress}
                      onPress={this.uploadSelectedFile}>
                      Subir Video
                      </Button>

                  </View>
                }

                {this.state.uploadPhase == 2 &&
                  <View style={{ paddingTop: 20, paddingBottom: 10 }}>

                    <ProgressBar
                      style={{ height: 10 }}
                      progress={this.state.uploadPercent100 / 100}
                      color={Colors.blue500} />

                    <View style={{ alignItems: 'flex-end', marginBottom: 16, marginTop: 4 }}>
                      <Text style={{ fontSize: 16, marginEnd: 4 }}>{this.state.uploadPercent100} %</Text>
                    </View>

                    <Button
                      loading="true"
                      mode="outlined">
                      Espera, subiendo tu video
                    </Button>
                  </View>
                }

                {this.state.uploadPhase == 3 &&
                  <View style={{ paddingTop: 20, paddingBottom: 10, alignItems: 'center' }}>

                    <Image
                      style={{ width: 300, height: 300 }}
                      source={require('../images/undraw_videographer_nnc7.png')}
                    />

                    <Button
                      icon="upload"
                      mode="outlined">
                      Video Subido con éxito
                    </Button>

                    <Button
                      style={{ marginTop: 15 }}
                      mode="contained"
                      onPress={() => {
                        console.log('Navegacion -> Muro'),
                          navigation.navigate('Muro');
                      }}>
                      Volver a mi muro
                    </Button>
                  </View>
                }

              </Card.Content>
            </Card>
          </View>
        }

        {/*
        {this.state.uploadPhase == 1 &&
          <View style={{ height: 220, backgroundColor: 'black', marginVertical: 8 }}>
            <PruebaPlayVideoFile
              uri={this.state.selectedFile.uri ? this.state.selectedFile.uri : ''}
            />
          </View>
        }
      */}

      </View>
    );
  }
}


const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
  }
});