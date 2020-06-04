import React from 'react';
import { StackActions } from '@react-navigation/native';

import { ScrollView, View, FlatList } from 'react-native';
import { Appbar, ActivityIndicator } from 'react-native-paper';
import PruebaRequestGet from '../PruebaRequestGet.js';
import VideoEnLista from '../VideoEnLista.js';

import AppAsyncStorage from '../utils/AppAsyncStorage.js';
import AppUtils from '../utils/AppUtils.js';
import EndPoints from '../utils/EndPoints.js';

export class MuroScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingWallVideos: true,
      listWallVideosLoaded: false,

      listWallVideos: [],
    };

    this.requestWallVideos = this.requestWallVideos.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount (MuroScreen)');
    this.requestWallVideos();
  }

  async requestWallVideos() {
    const sessionData = await AppAsyncStorage.getSession();
    const sessionDataJSON = JSON.parse(sessionData);
    const authToken = await AppAsyncStorage.getTokenFromSession();

    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });
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
              AppUtils.logout();
              console.log('Navegacion -> Login');

              const replaceAction = StackActions.replace('Login');
              this.props.navigation.dispatch(replaceAction);
            }}
          />
          <Appbar.Action
            icon="network"
            color="grey"
            disabled="true"
            onPress={() => {
              this.setState({ showTheRequest: !this.state.showTheRequest });
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
                navigation.navigate('Profile');
            }}
          />
          <Appbar.Action
            icon="dots-vertical"
            onPress={() => {
              alert('Mas Acciones, Config, Etc');
            }}
          />
        </Appbar.Header>

        <View style={{ flex: 1, marginVertical: 0, backgroundColor: 'white' }}>
          <ScrollView>

            {this.state.loadingWallVideos && <ActivityIndicator style={{ padding: 20 }} />}

            {(this.state.listWallVideosLoaded && this.state.listWallVideos.length > 0 &&
              <FlatList
                data={this.state.listWallVideos}
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

          </ScrollView>
        </View>
      </View>
    );
  }
}
