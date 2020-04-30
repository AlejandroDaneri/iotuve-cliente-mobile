import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Paragraph, Divider, Card, Chip, Button, Appbar } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import PruebaPlayVideoFile from '../PruebaPlayVideoFile.js';

export class UploadVideoScreen extends React.Component {

  constructor(props) {
    super(props);

    // VIDEOS de muestra
    //https://pixabay.com/es/videos/fruta-corte-alimentos-saludable-33252/

    //Initialization of the state to store the selected file related attribute
    this.state = {
      singleFile: '',
    };
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
      //Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
      //Setting the state to show single file attributes
      this.setState({ singleFile: res });
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
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
                onPress={this.selectOneFile.bind(this)}>
                Elegir un Video
              </Button>

            </Card.Content>
          </Card>
        </View>

        {this.state.singleFile.uri &&
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
                  {this.state.singleFile.name ? this.state.singleFile.name : ''}
                </Paragraph>

                <Paragraph style={{ paddingVertical: 4 }}>
                Type: {this.state.singleFile.type ? this.state.singleFile.type : ''}
                </Paragraph>

                <Paragraph style={{ paddingVertical: 4 }}>
                File Size:{' '}
                  {this.state.singleFile.size ? this.state.singleFile.size : ''}
                </Paragraph>

                <Paragraph style={{ paddingVertical: 4 }}>
                URI: {this.state.singleFile.uri ? this.state.singleFile.uri : ''}
                </Paragraph>

              </Card.Content>
            </Card>
          </View>
        }

        {this.state.singleFile.uri &&
          <View style={{ height: 220, backgroundColor: 'black', marginVertical: 8 }}>
            <PruebaPlayVideoFile
              uri={this.state.singleFile.uri ? this.state.singleFile.uri : ''}
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