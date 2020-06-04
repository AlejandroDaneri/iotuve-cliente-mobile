import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Button,
  Divider,
  Chip,
  Card,
  Appbar,
  ActivityIndicator,
} from 'react-native-paper';
import VideoEnLista from '../VideoEnLista.js';

import EndPoints from '../utils/EndPoints';
import AppUtils from '../utils/AppUtils';
import AppAsyncStorage from '../utils/AppAsyncStorage.js';
import { FlatList } from 'react-native-gesture-handler';


export class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loadingUserVideos: true,

      requestingFriendship: false,
      listUserVideosLoaded: false,
      listUserVideos: [],
    };

    this.requestUserVideos = this.requestUserVideos.bind(this);
    this.requestFriendship = this.requestFriendship.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount (ProfileScreen)');
    //this.requestUserProfile();
    this.requestUserVideos();
  }

  async requestUserVideos() {
    const sessionData = await AppAsyncStorage.getSession();
    const sessionDataJSON = JSON.parse(sessionData);
    const authToken = await AppAsyncStorage.getTokenFromSession();

    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });
    /*
      {
        "data": [
          {
            "id": "379824269sd9382ss7",
            "title": "One title",
            "description": "One description",
            "visibility": "private",
            "media": {
              "name": "1282154_Lathe - 4412.mp4",
              "date_created": "2020-05-30T02:36:53.074Z",
              "size": 3215421,
              "type": "video/mp4",
              "video_id": "5ed5a9d87ec7d6351b6a90e2",
              "user_id": "testuser",
              "url": "https://storage.googleapis.com/chotuve-grupo8.appspot.com/uploads/videos/test/1282154_Lathe%20-%204412.mp4.mp4",
              "thumb": "https://storage.googleapis.com/chotuve-grupo8.appspot.com/uploads/videos/test/1282154_Lathe%20-%204412.mp4.mp4"
            },
            "location": {
              "latitude": -58.416572,
              "longitude": -34.6024161
            },
            "statistics": {},
            "user": "testuser",
            "date_created": "2020-06-04T03:08:32Z",
            "date_updated": "2020-06-04T03:08:32Z"
          }
        ]
      }
      */

    //fetch(EndPoints.videos + '?user=' + sessionDataJSON.session_data.username, {
    //fetch(EndPoints.videos + '?user=' + sessionDataJSON.session_data.id, {
    fetch(EndPoints.videos, {
      method: 'GET',
      headers: myHeaders,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);

        if (responseJson.fullResponse.ok) {
          console.log(responseJson.data.data[0]);
          this.setState({
            listUserVideos: responseJson.data.data,
            listUserVideosLoaded: true,
          });
        } else {
          if (responseJson.fullResponse.status == 401) {
            AppUtils.logout();
            this.props.navigation.navigate("Login");
          } else {
            console.log('que hacer aqui?');
          }
        }

      })
      .catch((error) => {
        console.log('------- error ------');
        console.log(error);
      })
      .finally(() => {
        this.setState({ loadingUserVideos: false })
      });

  }

  async requestFriendship() {
    const authToken = await AppAsyncStorage.getTokenFromSession();

    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });

    var myBody = JSON.stringify({
      to_user: "usuario1@gmail.com",
      message: "mensaje clavado",
    });

    fetch(EndPoints.friendships, {
      method: 'POST',
      headers: myHeaders,
      body: myBody,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);

        if (responseJson.fullResponse.ok) {

        } else {
          if (responseJson.fullResponse.status == 401) {
            AppUtils.logout();
            this.props.navigation.navigate("Login");
          } else {
            console.log('que hacer aqui?');
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

          <Appbar.Content title="Mi Perfil" />

          <Appbar.Action
            icon="account-star"
            onPress={() => {
              console.log('Navegacion -> Friends'),
                navigation.navigate('Friends');
            }}
          />

          <Appbar.Action
            icon="pencil"
            onPress={() => {
              //alert('Editar Mi Perfil');
              console.log('Navegacion -> EditProfile'),
                navigation.navigate('EditProfile');
            }}
          />

        </Appbar.Header>

        <ScrollView>
          <View>
            <Card elevation={10} style={styles.cardContainer}>
              <Card.Title
                title="Juan Marcos - usuario1@gmail.com"
                subtitle="Espacio / Campo para otra cosa, descripción, etc"
              />
              <Divider />
              <Card.Content>

                <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                  <View style={styles.actionsLeft}>
                    <Text># Conexiónes con amigos:</Text>
                  </View>
                  <View style={styles.actionsRight}>
                    <Chip icon="account-multiple">12110</Chip>
                  </View>
                </View>

                <Divider />
                <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                  <View style={styles.actionsLeft}>
                    <Text># Videos publicados:</Text>
                  </View>
                  <View style={styles.actionsRight}>
                    <Chip icon="upload">3660</Chip>
                  </View>
                </View>

                <Divider />

                <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                  <View style={styles.actionsLeft}>
                    <Text># Likes / Unlikes:</Text>
                  </View>
                  <View style={styles.actionsRight}>
                    <Chip icon="heart" style={{ marginRight: 4 }}>
                      1150
                    </Chip>
                    <Chip icon="heart-broken">2230</Chip>
                  </View>
                </View>

                <Divider />

                <Button
                  style={{ margin: 10 }}
                  mode="contained"
                  icon="voice"
                  disabled={this.state.uploadPhase > 0 ? "false" : ""}
                  onPress={() => {
                    this.requestFriendship();
                  }}>
                  Solicitar Amistad
                </Button>

              </Card.Content>
            </Card>
          </View>

          <View>
            <Text style={{ fontSize: 30, marginHorizontal: 10, marginTop: 10 }}>
              Listado de tus videos
            </Text>

            <View style={{ flex: 1, marginVertical: 10 }}>

              <View>

                {this.state.loadingUserVideos && <ActivityIndicator style={{ padding: 20 }} />}

                {(this.state.listUserVideosLoaded && this.state.listUserVideos.length > 0 &&
                  <FlatList
                    data={this.state.listUserVideos}
                    keyExtractor={({ id }, index) => id}
                    renderItem={({ item }) => (

                      <VideoEnLista
                        videoTitle={item.title}
                        videoDescription={item.description}
                        videoAuthor={item.description}
                        videoSnapshot={item.media.thumb}
                        videoURI={item.media.url}
                        videoLength="15:15"
                        videoViewCount={item.statistics.views.count}
                        favoritesCount={item.statistics.likes.count}
                        notFavoritesCount={item.statistics.dislikes.count}
                        navigation={this.props.navigation}
                      />
                    )}
                  />
                )}

                {(this.state.listUserVideosLoaded && this.state.listUserVideos.length == 0 &&
                  <View style={{ textAlign: 'center' }}>

                    <Card elevation={10} style={styles.cardContainer}>
                      <Card.Title
                        title="No tenés videos propios"
                        subtitle="Es momento de agregar contenido!"
                      />
                      <Divider />
                      <Card.Content>

                        <Button
                          style={{ margin: 10 }}
                          mode="contained"
                          icon="video"
                          onPress={() => {
                            console.log('Navegacion -> Muro'),
                              console.log('Navegacion -> UploadVideo'),

                              navigation.pop();
                            navigation.navigate('UploadVideo');
                          }}>
                          Subir mi primer video
                        </Button>

                      </Card.Content>
                    </Card>
                  </View>
                )}

              </View>

            </View>
          </View>
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
