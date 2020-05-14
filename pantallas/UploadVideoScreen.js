import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { List, TextInput, Switch, Paragraph, Divider, Card, Button, Appbar } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import PruebaPlayVideoFile from '../PruebaPlayVideoFile.js';
import AppUtils from '../utils/AppUtils.js';

import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';


export class UploadVideoScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedFile: '',
      appHasPermission: null,
      uploadPhase: 0, // 0 = nada, 1 = video seleccionado, 2 = video subiendo, 3 = video subido;

      videoPublic: false,
      videoTitle: '',
      videoDescription: '',
      visibilityDescription: 'Privado',
    };

    //bindeo de funciones/eventos
    this.clickElegirUnVideo = this.clickElegirUnVideo.bind(this);
    this.uploadSelectedFile = this.uploadSelectedFile.bind(this);

  }

  async uploadSelectedFile() {

    if (this.state.appHasPermission) {

      // RNFS.DocumentDirectoryPath
      // RNFS.DownloadDirectoryPath
      // RNFS.ExternalDirectoryPath
      // RNFS.ExternalStorageDirectoryPath

      console.log("RNFS.DocumentDirectoryPath: " + RNFS.DocumentDirectoryPath);
      console.log("RNFS.DownloadDirectoryPath: " + RNFS.DownloadDirectoryPath);
      console.log("RNFS.ExternalDirectoryPath: " + RNFS.ExternalDirectoryPath);
      console.log("RNFS.ExternalStorageDirectoryPath: " + RNFS.ExternalStorageDirectoryPath);
      //let pathToVideos = RNFS.ExternalStorageDirectoryPath + "/DCIM/Camera";
      let pathToVideos = RNFS.DownloadDirectoryPath;

      //RNFS.readDir(RNFS.DocumentDirectoryPath).then((result) => {
      //RNFS.readDir(RNFS.DownloadDirectoryPath).then((result) => {
      //RNFS.readDir(RNFS.ExternalDirectoryPath).then((result) => {
      RNFS.readDir(pathToVideos).then((result) => {
        console.log('GOT RESULT: ', result);

        var item = result.find(data => data.name === this.state.selectedFile.name);
        if (typeof item !== 'undefined') {

          const pathFileToUpload = item.path;
          const firebaseReferencePath = '/uploads/videos/test/' + AppUtils.generateRandomNumber() + '_' + item.name;

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
            console.log(`${taskSnapshot.bytesTransferred} transferred out of ${item.size}`);
          });

          putFileTask.then((result) => {
            console.log('Video uploaded to the bucket!');
            console.log(result);
            this.setState({
              uploadPhase: 3,
            });

            // aca tengo que hacer el POST del video al APP-Server


          });
        } else {
          console.log("No encuentro el archivo en el directorio");
        }

      }).catch((error) => {
        console.log('------ Error readDir ------');
        console.log(error);
      });

    } else {
      console.log('Dijo que no a otorgar permisos!');
    }

  }

  async selectOneFile() {

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

      //Printing the log related to the file
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);

      //Setting the state to show single file attributes
      this.setState({ selectedFile: res, uploadPhase: 1 });

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

        <View>
          <Card elevation={10} style={styles.cardContainer}>
            <Card.Title
              title="Subir un nuevo video"
            />
            <Divider />
            <Card.Content>

              <Divider />

              {/*To show single file attribute*/}
              <Button
                style={{ marginTop: 15 }}
                icon="video"
                mode="contained"
                onPress={this.clickElegirUnVideo}>
                Elegir un Video
              </Button>

            </Card.Content>
          </Card>
        </View>

        {this.state.selectedFile.uri &&
          <View>
            <Card elevation={10} style={styles.cardContainer}>
              <Card.Title
                title="Datos del video"
              />
              <Divider />
              <Card.Content>

                <Paragraph style={{ paddingVertical: 4 }}>
                  Archivo Seleccionado:{' '}
                  {this.state.selectedFile.name ? this.state.selectedFile.name : ''}
                </Paragraph>


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

                {this.state.uploadPhase == 1 &&
                  <Button
                    style={{ marginTop: 10 }}
                    icon="upload"
                    mode="contained"
                    disabled={this.state.uploadInProgress}
                    onPress={this.uploadSelectedFile}>
                    Subir Video
                </Button>
                }

                {this.state.uploadPhase == 2 &&
                  <View style={{ paddingTop: 20, paddingBottom: 10 }}>
                    <Button
                      loading="true"
                      mode="outlined">
                      Espera, subiendo tu video
                    </Button>
                  </View>
                }

                {this.state.uploadPhase == 3 &&
                  <View style={{ paddingTop: 20, paddingBottom: 10 }}>
                    <Button
                      icon="upload"
                      mode="outlined">
                      Video Subido con éxito
                    </Button>

                    <Paragraph>Nuestro sistema lo está optimizando.</Paragraph>
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

        {this.state.uploadPhase == 1 &&
          <View style={{ height: 220, backgroundColor: 'black', marginVertical: 8 }}>
            <PruebaPlayVideoFile
              uri={this.state.selectedFile.uri ? this.state.selectedFile.uri : ''}
            />
          </View>
        }

      </View>
    );
  }
}


const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
  }
});