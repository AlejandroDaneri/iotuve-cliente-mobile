import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Appbar, Card, Chip, Divider, IconButton, Colors, Button } from 'react-native-paper';
import PruebaPlayVideoFile from '../PruebaPlayVideoFile.js';
import { ScrollView } from 'react-native-gesture-handler';
import EndPoints from '../utils/EndPoints.js';
import AppAsyncStorage from '../utils/AppAsyncStorage';
import AppUtils from '../utils/AppUtils.js';

export class VideoScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      videoInfoExpanded: false,

      videoId: this.props.route.params.id,
    };

    this.requestViewVideo = this.requestViewVideo.bind(this);
    this.requestLikeVideo = this.requestLikeVideo.bind(this);
    this.requestDislikeVideo = this.requestDislikeVideo.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount (VideoScreen)');
    this.requestViewVideo();
    //this.requestLikeVideo();
  }

  async requestDislikeVideo() {
    const authToken = await AppAsyncStorage.getTokenFromSession();
    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });
    var myBody = JSON.stringify({});

    fetch(EndPoints.videos + '/' + this.state.videoId + '/dislikes', {
      method: 'POST', headers: myHeaders, body: myBody,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);

        if (responseJson.fullResponse.ok) {
          // todo OK. hacer algo?
          this.props.route.params.count_dislikes = this.props.route.params.count_dislikes + 1;
          this.setState({ });
        } else {
          if (responseJson.fullResponse.status == 401) {
            AppUtils.logout();
            this.props.navigation.navigate("Login");
          } else {
            console.log('que hacer aqui? algo? nada? bla.');
          }
        }
      })
      .catch((error) => {
        console.log('------- error ------');
        console.log(error);
      });
  }

  async requestLikeVideo() {
    const authToken = await AppAsyncStorage.getTokenFromSession();
    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });
    var myBody = JSON.stringify({});

    fetch(EndPoints.videos + '/' + this.state.videoId + '/likes', {
      method: 'POST', headers: myHeaders, body: myBody,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);

        if (responseJson.fullResponse.ok) {
          // todo OK. hacer algo?
          this.props.route.params.count_likes = this.props.route.params.count_likes + 1;
          this.setState({ });
        } else {
          if (responseJson.fullResponse.status == 401) {
            AppUtils.logout();
            this.props.navigation.navigate("Login");
          } else {
            console.log('que hacer aqui? algo? nada? bla.');
          }
        }
      })
      .catch((error) => {
        console.log('------- error ------');
        console.log(error);
      });
  }


  async requestViewVideo() {
    const authToken = await AppAsyncStorage.getTokenFromSession();
    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });
    var myBody = JSON.stringify({});

    fetch(EndPoints.videos + '/' + this.state.videoId + '/views', {
      method: 'POST', headers: myHeaders, body: myBody,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);

        if (responseJson.fullResponse.ok) {
          // todo OK. hacer algo?
        } else {
          if (responseJson.fullResponse.status == 401) {
            AppUtils.logout();
            this.props.navigation.navigate("Login");
          } else {
            console.log('que hacer aqui? algo? nada? bla.');
          }
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

          <Appbar.Content title="Video" />
        </Appbar.Header>

        <View
          style={{ height: 220, backgroundColor: 'black' }}>

          <PruebaPlayVideoFile
            uri={this.props.route.params.uri ? this.props.route.params.uri : 'content://com.android.providers.downloads.documents/document/14'}
          />
        </View>

        <ScrollView>

          <View style={{ backgroundColor: Colors.white, paddingHorizontal: 8 }}>

            <View style={{ marginTop: 8, justifyContent: 'space-between', flexDirection: 'row' }}>
              <View style={styles.actionsLeft}>
                <Chip icon="eye" style={{ marginRight: 4 }}>{this.props.route.params.count_views}</Chip>
                <Chip icon="alarm">00:00</Chip>
              </View>
              <View style={styles.actionsRight}>
                <Chip
                  style={{ marginRight: 4, color: 'red' }}
                  mode='outlined'
                  icon="heart"
                  onPress={() => {
                    console.log('Marcar like');
                    this.requestLikeVideo();
                  }}>{this.props.route.params.count_likes}</Chip>
                <Chip
                  mode='outlined'
                  icon="heart-broken"
                  onPress={() => {
                    console.log('Marcar dislike');
                    this.requestDislikeVideo();
                  }}>{this.props.route.params.count_dislikes}</Chip>
              </View>
            </View>

            <Divider style={{ marginTop: 8 }} />

            <View style={{ justifyContent: 'space-between', alignItems: 'flex-end', flexDirection: 'row', marginBottom: 10 }}>

              <Text style={{ fontSize: 28 }}>{this.props.route.params.title}</Text>

              <Button
                style={{ marginLeft: 10, marginTop: 8 }}
                icon="information"
                mode="outlined"
                color="grey"
                compact="true"
                onPress={() => {
                  this.setState({
                    videoInfoExpanded: !this.state.videoInfoExpanded,
                  });

                }}
              >
                + info
              </Button>

            </View>

            {(this.state.videoInfoExpanded &&

              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 18 }}>{this.props.route.params.description} bla bla blab lablbalb abla</Text>

                <Divider style={{ marginVertical: 8 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Chip icon="calendar">14 de Marzo, 22:30</Chip>
                  <Chip
                    mode='outlined'
                    icon="account"
                    onPress={() => {
                      console.log('Ir a perfil de usuario');
                      navigation.navigate("Profile");
                    }}>usuario1</Chip>
                </View>
              </View>

            )}

          </View>

          <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
            <View style={{ justifyContent: 'flex-start', flexDirection: 'row', marginHorizontal: 8, marginTop: 8 }}>
              <IconButton
                icon="comment"
                color={Colors.grey500}
                size={20}
                onPress={() => console.log('Pressed')}
              />
              <Text style={{ alignSelf: 'center', fontSize: 20 }}>Mensajes:</Text>
            </View>
            <View style={{ justifyContent: 'flex-start', flexDirection: 'row', marginHorizontal: 8, marginTop: 8 }}>

              <Button
                style={{ marginLeft: 10 }}
                icon="comment"
                mode="outlined"
                onPress={() => {
                  console.log('Comentar')
                }}
              >
                Comentar
              </Button>

            </View>
          </View>

          <Card elevation={6} style={styles.cardContainer}>
            <Card.Content>
              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <Chip icon="account">Patricio Estrella</Chip>
                <Chip icon="calendar">12-12-20</Chip>
              </View>
              <Text style={{ marginLeft: 8, marginTop: 8 }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </Text>
            </Card.Content>
          </Card>

          <Card elevation={6} style={styles.cardContainer}>
            <Card.Content>
              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <Chip icon="account">Calamardo</Chip>
                <Chip icon="calendar">16-12-20</Chip>
              </View>
              <Text style={{ marginLeft: 8, marginTop: 8 }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</Text>
            </Card.Content>
          </Card>

          <Card elevation={6} style={styles.cardContainer}>
            <Card.Content>
              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <Chip mode='outlined' icon="account">Bob Esponja</Chip>
                <Chip mode='outlined' icon="calendar">12-12-20</Chip>
              </View>

              <Text style={{ marginLeft: 8, marginTop: 8 }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
            </Card.Content>
          </Card>

        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
  },
  actionsLeft: {
    flex: 1,
    flexDirection: 'row',
  },
  actionsRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});