import React from 'react';
import { StyleSheet, Text, View, Keyboard } from 'react-native';
import { Appbar, TextInput, Button, List, Switch, Card, Divider } from 'react-native-paper';
import EndPoints from '../utils/EndPoints';
import AppUtils from '../utils/AppUtils';
import AppAsyncStorage from '../utils/AppAsyncStorage';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export class EditVideoScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      editPhase: 0, // 0 = nada, 1 = video modificado
      videoTitleOriginal: '',

      videoPublic: false,
      visibilityDescription: 'Privado',
      videoId: null,
      videoTitle: '',
      videoDescription: '',
      videoVisibility: 'private',
    };

    this.editVideoMetaData = this.editVideoMetaData.bind(this);

  }

  componentDidMount() {
    const { allVideoInfo } = this.props.route.params;

    this.setState({
      videoId: allVideoInfo.videoId,
      videoTitle: allVideoInfo.videoTitle,
      videoTitleOriginal: allVideoInfo.videoTitle,
      videoDescription: allVideoInfo.videoDescription,

      videoVisibility: allVideoInfo.videoVisibility,
      videoPublic: allVideoInfo.videoVisibility == 'public',
      visibilityDescription: allVideoInfo.videoVisibility == 'private' ? 'Privado' : 'Público',
    })
  }


  async editVideoMetaData() {
    const authToken = await AppAsyncStorage.getTokenFromSession();
    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });
    var myBody = JSON.stringify({
      title: this.state.videoTitle,
      description: this.state.videoDescription,
      visibility: this.state.videoVisibility,
    });

    let videoId = this.state.videoId;

    fetch(EndPoints.videos + '/' + videoId, {
      method: 'PUT',
      headers: myHeaders,
      body: myBody,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        console.log('------- EDIT Server Video ------');
        AppUtils.printResponseJson(responseJson);
        
        // devolucion de datos a la pantalla de perfil (que es la unica por la cual se llega aca)
        let itemData = {
          videoVisibility: responseJson.data.visibility,
          videoTitle: responseJson.data.title,
          videoDescription: responseJson.data.description,
        };
        const { route } = this.props;
        const params = route.params;
        params.updateVideoInfo(itemData);

        this.setState({
          editPhase: 1,
        })
      })
      .catch((error) => {
        console.log('------- error EDIT Server Video ------');
        console.log(error);
      });
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

          <Appbar.Content title="Editar Video" />
        </Appbar.Header>

        <Card elevation={10} style={styles.cardContainer}>
          <Card.Title
            title={this.state.videoTitleOriginal}
          />
          <Divider />
          <Card.Content>

            <View>
              <TextInput
                style={{ paddingVertical: 4 }}
                dense="true"
                label="Título del video"
                mode="outlined"
                value={this.state.videoTitle}
                onChangeText={(videoTitle) => this.setState({ videoTitle })}
              />

              <TextInput
                style={{ paddingVertical: 4 }}
                dense="true"
                label="Descripción"
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
              {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
                <Button
                  style={{ marginTop: 10 }}
                  icon="video"
                  mode="contained"
                  disabled={(((this.state.videoTitle == '') || (this.state.videoDescription == '') || (this.state.uploadInProgress)) ? true : false)}
                  onPress={this.editVideoMetaData}>
                  Actualizar Video
                      </Button>
              {/* </TouchableWithoutFeedback> */}

            </View>
          </Card.Content>

        </Card>

        {this.state.editPhase == 1 &&
          <Card elevation={10} style={styles.cardContainer}>
            <Divider />
            <Card.Content>
              <View>

                <Button
                  style={{ marginTop: 15 }}
                  icon="video"
                  mode="outlined">
                  Video Actualizado con Exito
                </Button>

                <Button
                  style={{ marginTop: 15 }}
                  mode="contained"
                  onPress={() => {
                    console.log('Navegacion -> Profile'),
                      navigation.navigate('Profile');
                  }}>
                  Volver a mi perfil
                </Button>

              </View>
            </Card.Content>
          </Card>
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