import React from 'react';
import { StackActions } from '@react-navigation/native';

import { ScrollView, View, FlatList } from 'react-native';
import { Appbar } from 'react-native-paper';
import VideoEnLista from '../VideoEnLista.js';

import AppAsyncStorage from '../utils/AppAsyncStorage.js';
import AppUtils from '../utils/AppUtils.js';
import EndPoints from '../utils/EndPoints.js';
import CargandoVideos from '../CargandoVideos.js';

export class MuroScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingWallVideos: true,

      listWallVideosLoaded: false,
      listWallVideos: [],
    };

    this.requestWallVideos = this.requestWallVideos.bind(this);
    this.onBack = this.onBack.bind(this);
  }

  onBack() {
    // funcion para hacer callback cuando se regresa a esta pantalla 
    // y se haga un refresh del listado de videos
    
    console.log('onBack (MuroScreen)');
    this.setState({
      loadingWallVideos: true,
      listWallVideosLoaded: false,
    });
    this.requestWallVideos();
  }

  componentDidMount() {
    console.log('componentDidMount (MuroScreen)');
    this.requestWallVideos();
  }

  async userLogout() {
    const authToken = await AppAsyncStorage.getTokenFromSession();
    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });

    fetch(EndPoints.sessions, {
      method: 'DELETE',
      headers: myHeaders,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);
      })
      .catch((error) => {
        console.log('------- error ------');
        console.log(error);
      })
      .finally(() => {
        this.setState({ loadingWallVideos: false })
      });
    AppUtils.logout();
  }

  async requestWallVideos() {
    const authToken = await AppAsyncStorage.getTokenFromSession();
    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });

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
            listWallVideos: responseJson.data.data,
            listWallVideosLoaded: true,
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
        this.setState({ loadingWallVideos: false })
      });
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: 'midnightblue' }}>
          <Appbar.Content title="Muro" />
          <Appbar.Action
            icon="arrow-left"
            color="grey"
            onPress={() => {
              console.log('Logout. Cerrando sesión en el servidor');
              this.userLogout();
              console.log('Navegacion -> Login');
              const replaceAction = StackActions.replace('Login');
              this.props.navigation.dispatch(replaceAction);
            }}
          />
          <Appbar.Action
            icon="chat"
            onPress={() => {
              console.log('Navegacion -> Chat'),
                navigation.navigate('Chat');
            }}
          />
          <Appbar.Action
            icon="upload"
            onPress={() => {
              console.log('Navegacion -> UploadVideo'),
                navigation.navigate('UploadVideo');
            }}
          />
          <Appbar.Action
            icon="account"
            onPress={() => {
              console.log('Navegacion -> Profile'),
                navigation.navigate("Profile", { onBack: this.onBack });
            }
            } />

          <Appbar.Action
            icon="dots-vertical"
            onPress={() => {
              alert('Mas Acciones, Config, Etc');
            }}
          />
        </Appbar.Header>

        <View style={{ flex: 1, marginVertical: 0, backgroundColor: 'white' }}>
          <ScrollView>

            {this.state.loadingWallVideos &&
              <CargandoVideos />
            }

            {(this.state.listWallVideosLoaded && this.state.listWallVideos.length > 0 &&
              <FlatList
                data={this.state.listWallVideos}
                keyExtractor={({ id }, index) => id}
                renderItem={({ item }) => (

                  <VideoEnLista
                    videoId={item.id}
                    videoTitle={item.title}
                    videoDescription={item.description}
                    videoAuthor={item.description}
                    videoSnapshot={item.media.thumb}
                    videoURI={item.media.url}
                    videoLength="00:00"
                    videoViewCount={item.count_views}
                    favoritesCount={item.count_likes}
                    notFavoritesCount={item.count_dislikes}
                    userLike={item.user_like}
                    userDislike={item.user_dislike}
                    navigation={this.props.navigation}
                  />
                )}
              />
            )}

          </ScrollView>
        </View>
      </View>
    );
  }
}
