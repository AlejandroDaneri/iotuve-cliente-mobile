import React from 'react';
import { PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import { Paragraph, Divider, Card, Chip, Button, Appbar } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import PruebaPlayVideoFile from '../PruebaPlayVideoFile.js';
import AppUtils from '../AppUtils.js';

import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';

export class UploadVideoScreen extends React.Component {

  constructor(props) {
    super(props);

    // VIDEOS de muestra
    // https://pixabay.com/es/videos/fruta-corte-alimentos-saludable-33252/

    this.state = {
      selectedFile: '',
      appHasPermission: null
    };
  }

  async uploadSelectedFile() {

    if (this.state.appHasPermission) {

      // RNFS.DocumentDirectoryPath
      // RNFS.DownloadDirectoryPath
      // RNFS.ExternalDirectoryPath
      // RNFS.ExternalStorageDirectoryPath
      RNFS.readDir(RNFS.DownloadDirectoryPath).then((result) => {
        console.log('GOT RESULT: ', result);
  
        var item = result.find(data => data.name === this.state.selectedFile.name);
        if (typeof item !== 'undefined') {
  
          const pathFileToUpload = item.path;
  
          const reference = firebase.storage().ref('/uploads/videos/test/' + AppUtils.generateRandomNumber() + '_' + item.name);
          console.log('MUESTRO REFERENCE: ');
          console.log(reference);
          reference.putFile({
            pathFileToUpload
          }).then((resultFromFirebase) => {
            console.log('-------- MUESTRO result ---------------');
            console.log(resultFromFirebase);
          }).catch((error) => {
            console.log(error);
          });
  
        }
  
      })

    } else {
      console.log('Dijo que no!');
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
      this.setState({ selectedFile: res });

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
    console.log('clickElegirUnVideo');

    console.log(AppUtils.endpoint_ping);

    var hasPermission = await AppUtils.requestPermissionsAndroid();
    if (hasPermission) {
      console.log('hasPermission');
      this.setState({ appHasPermission: true });
      //this.selectOneFile();
    } else {
      console.log('NO hasPermission');
      this.setState({ appHasPermission: false });
    }
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

          <Appbar.Content title="Nuevo Contenido" />
        </Appbar.Header>

        <View>
          <Card elevation={6} style={styles.cardContainer}>
            <Card.Title
              title="Subir un nuevo video"
            />
            <Divider />
            <Card.Content>
              <Paragraph style={{ paddingVertical: 10 }}>
                Elegí un video de tu celular para subir a ChoTuve
                </Paragraph>

              <Divider />

              {/*To show single file attribute*/}
              <Button
                style={{ marginTop: 15 }}
                icon="video"
                mode="contained"
                onPress={this.clickElegirUnVideo.bind(this)}>
                Elegir un Video
              </Button>

            </Card.Content>
          </Card>
        </View>

        {this.state.selectedFile.uri &&
          <View>
            <Card elevation={6} style={styles.cardContainer}>
              <Card.Title
                title="Datos del video"
              />
              <Divider />
              <Card.Content>
                {/*Showing the data of selected Single file*/}
                <Paragraph style={{ paddingVertical: 4 }}>
                  File Name:{' '}
                  {this.state.selectedFile.name ? this.state.selectedFile.name : ''}
                </Paragraph>

                <Paragraph style={{ paddingVertical: 4 }}>
                  Type: {this.state.selectedFile.type ? this.state.selectedFile.type : ''}
                </Paragraph>

                <Paragraph style={{ paddingVertical: 4 }}>
                  File Size:{' '}
                  {this.state.selectedFile.size ? this.state.selectedFile.size : ''}
                </Paragraph>

                <Paragraph style={{ paddingVertical: 4 }}>
                  URI: {this.state.selectedFile.uri ? this.state.selectedFile.uri : ''}
                </Paragraph>

                <Button
                  style={{ marginTop: 15 }}
                  icon="upload"
                  mode="contained"
                  onPress={this.uploadSelectedFile.bind(this)}>
                  Subir Video
              </Button>

              </Card.Content>
            </Card>
          </View>
        }

        {this.state.selectedFile.uri &&
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