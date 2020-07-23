/* Import Libs */
import React from 'react';
import { ScrollView, StyleSheet, Image, Text, View } from 'react-native';
import { Button, Divider, Chip, Card, Appbar, ActivityIndicator } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem } from 'react-native-elements';
import axios from 'axios';

/* Import Components */
import VideoEnLista from '../VideoEnLista.js';

/* Import Utils */
import EndPoints from '../utils/EndPoints';
import AppUtils from '../utils/AppUtils';
import AppAsyncStorage from '../utils/AppAsyncStorage.js';

export class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

      userFirstName: '',
      userLastName: '',
      userEmail: '',
      userPhone: '',
      userAvatar: '',
      userStatistics: '',
      userLoginService: true,

      loadingUserVideos: true,

      requestingFriendship: false,
      listUserVideosLoaded: false,
      listUserVideos: [],
    };

    // console.log(props.params.onBack);
    this.requestUserData = this.requestUserData.bind(this);
    this.requestUserVideos = this.requestUserVideos.bind(this);
    this.requestFriendship = this.requestFriendship.bind(this);
  }

  componentWillUnmount() {
    console.log('componentWillUnmount (ProfileScreen)');
    // si descomentamos esta linea, el muro se refresca
    // pero no esta quedando muy bien el "efecto".
    this.props.route.params.onBack();
  }

  componentDidMount() {
    const { username } = this.props.route.params;

    if (username) {
      this.requestVideos(username)
      this.requestUser(username)
    } else {
      this.requestUserData();
      this.requestUserVideos();
    }
  }

  async requestUser(username) {
    const authToken = await AppAsyncStorage.getTokenFromSession();
    console.log(authToken)
    console.log("request user")
    axios.get(EndPoints.users +  "/" + username, {
      headers: { 'X-Auth-Token': authToken },
    })
    .then(response => {
      const {data} = response
      console.log(data)
      this.updateUserData(data);
    })
    .catch(error => {
      if (error.response.status === 401) {
        AppUtils.logout()
        this.props.navigation.navigate("Login")
      }
    })
  }

  async requestVideos(username) {
    const authToken = await AppAsyncStorage.getTokenFromSession();
    axios.get(EndPoints.videos, {
      headers: { 'X-Auth-Token': authToken },
      params: {
        user: username
      }
    })
    .then(response => {
      const { data } = response
      this.setState({
        listUserVideos: data.data,
        listUserVideosLoaded: true,
        loadingUserVideos: false
      });
    })
    .catch(error => {
      if (error.response.status === 401) {
        AppUtils.logout()
        this.props.navigation.navigate("Login")
      }
    })
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
            console.log('que hacer aqui? algo? nada? bla.');
          }
        }
        this.setState({ initialLoading: false })
      })
      .catch((error) => {
        console.log('------- error ------');
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
      userStatistics: data.statistics,
    })
  }

  async requestUserVideos() {
    const sessionData = await AppAsyncStorage.getSession();
    const sessionDataJSON = JSON.parse(sessionData);
    const authToken = await AppAsyncStorage.getTokenFromSession();

    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });
    fetch(EndPoints.videos + '?user=' + sessionDataJSON.session_data.username, {
      //fetch(EndPoints.videos + '?user=' + sessionDataJSON.session_data.id, {
      //fetch(EndPoints.videos, {
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
            onPress={() => { this.props.navigation.goBack() }}
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
              <ListItem
                leftAvatar={{
                  size: 'large',
                  source: { uri: this.state.userAvatar },
                  showEditButton: false,
                  onPress: () => { console.log('Navegacion -> EditProfile'); navigation.navigate('EditProfile') }
                }}
                title={AppUtils.capitalize(this.state.userFirstName) + ' ' + AppUtils.capitalize(this.state.userLastName)}
                titleStyle={{ fontSize: 20, fontWeight: "bold" }}
                subtitle={this.state.userEmail}
              />
              <Divider />
              <Card.Content>

                <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                  <View style={styles.actionsLeft}>
                    <Text>Conexiónes con amigos:</Text>
                  </View>
                  <View style={styles.actionsRight}>
                    <Chip icon="account-multiple">{this.state.userStatistics.friends}</Chip>
                  </View>
                </View>

                <Divider />
                <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                  <View style={styles.actionsLeft}>
                    <Text>Videos subidos / Vistos:</Text>
                  </View>
                  <View style={styles.actionsRight}>
                    <Chip icon="upload" style={{ marginRight: 4 }}>{this.state.userStatistics.uploaded}</Chip>
                    <Chip icon="eye">{this.state.userStatistics.views}</Chip>
                  </View>
                </View>

                <Divider />

                <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                  <View style={styles.actionsLeft}>
                    <Text>Likes / Unlikes:</Text>
                  </View>
                  <View style={styles.actionsRight}>
                    <Chip icon="heart" style={{ marginRight: 4 }}>{this.state.userStatistics.likes}</Chip>
                    <Chip icon="heart-broken">{this.state.userStatistics.dislikes}</Chip>
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
                    //keyExtractor={({ id }, index) => id}
                    renderItem={({ item }) => (
                      <VideoEnLista
                        videoId={item.id}
                        videoTitle={item.title}
                        videoDescription={item.description}
                        videoAuthor={item.description}
                        videoSnapshot={item.media.thumb}
                        videoURI={item.media.url}
                        videoLength="15:15"
                        videoViewCount={item.count_views}
                        favoritesCount={item.count_likes}
                        notFavoritesCount={item.count_dislikes}
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
