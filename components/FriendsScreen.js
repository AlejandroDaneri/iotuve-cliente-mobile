import React from 'react';
import { View, Image } from 'react-native';
import { Button, Appbar, Snackbar, ActivityIndicator, Headline, Paragraph } from 'react-native-paper';
import moment from 'moment';

import PedidoAmistad from '../PedidoAmistad.js';
import Amistad from '../Amistad.js';
import { FlatList } from 'react-native-gesture-handler';
import AppUtils from '../utils/AppUtils.js';
import EndPoints from '../utils/EndPoints.js';
import AppAsyncStorage from '../utils/AppAsyncStorage.js';

export class FriendsScreen extends React.Component {

  constructor(props) {
    super(props);

    this._onToggleSnackBar = this._onToggleSnackBar.bind(this);
    this._onDismissSnackBar = this._onDismissSnackBar.bind(this);
    this._clickTabSolicitudes = this._clickTabSolicitudes.bind(this);
    this._clickTabAmigos = this._clickTabAmigos.bind(this);

    this.requestFriends = this.requestFriends.bind(this);
    this.requestFriendsRequests = this.requestFriendsRequests.bind(this);
  };

  state = {
    snackBarVisible: false,
    snackBarText: '',
    snackBarBackgroundColor: 'blue',

    tabSeleccionada: 'Amigos',
    colorTabAmigos: 'midnightblue',
    colorTabSolicitudes: 'lightgrey',

    isLoadingFriends: true,
    isLoadingFriendsRequests: true,
    dataFriends: [],
    dataFriendsRequest: [],
  };

  _clickTabAmigos() {
    this.setState({
      colorTabAmigos: 'midnightblue',
      colorTabSolicitudes: 'lightgrey',
      tabSeleccionada: 'Amigos',
    });
  }
  _clickTabSolicitudes() {
    this.setState({
      colorTabAmigos: 'lightgrey',
      colorTabSolicitudes: 'midnightblue',
      tabSeleccionada: 'Solicitudes',
    });
  }

  _onToggleSnackBar(name, action) {
    this._onDismissSnackBar();

    let color;
    let texto;

    if (action == 1) {
      color = 'blue';
      texto = name + ' :: Aceptado';
    } else {
      color = 'red';
      texto = name + ' :: Rechazado';
    }

    this.setState({
      snackBarBackgroundColor: color,
      snackBarVisible: !this.state.snackBarVisible,
      snackBarText: texto,
    });
  }

  _onDismissSnackBar() {
    this.setState({
      snackBarVisible: false
    });
  }

  async requestFriends() {
    const sessionData = await AppAsyncStorage.getSession();
    const sessionDataJSON = JSON.parse(sessionData);
    const authToken = await AppAsyncStorage.getTokenFromSession();

    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });

    fetch(EndPoints.users + '/' + sessionDataJSON.session_data.username + '/friends', {
      method: 'GET',
      headers: myHeaders,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);
        if (responseJson.fullResponse.ok) {
          this.setState({
            dataFriends: responseJson.data.friends,
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
        this.setState({ isLoadingFriends: false })
      });

  }

  async requestFriendsRequests() {
    const sessionData = await AppAsyncStorage.getSession();
    const sessionDataJSON = JSON.parse(sessionData);
    const authToken = await AppAsyncStorage.getTokenFromSession();

    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });

    fetch(EndPoints.friendships + '?status=pending&to_user=' + sessionDataJSON.session_data.username, {
      method: 'GET',
      headers: myHeaders,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);

        if (responseJson.fullResponse.ok) {
          this.setState({
            dataFriendsRequest: responseJson.data.data,
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
        this.setState({ isLoadingFriendsRequests: false })
      });

  }

  componentDidMount() {
    this.requestFriends();
    this.requestFriendsRequests();
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

          <Appbar.Content title="Amistades" />
        </Appbar.Header>

        <View style={{ justifyContent: 'center', paddingVertical: 10, flexDirection: 'row', marginVertical: 0, backgroundColor: 'darkslateblue' }}>

          <Button
            style={{ marginLeft: 10 }}
            icon="account-multiple"
            mode={this.state.tabSeleccionada.toLowerCase() == "amigos" ? "contained" : "outlined"}
            color={this.state.colorTabAmigos}
            backgroundColor="black"
            onPress={this._clickTabAmigos}
          >
            Amigos ({this.state.dataFriends.length})
          </Button>

          <Button
            style={{ marginLeft: 10 }}
            icon="account-search"
            mode={this.state.tabSeleccionada.toLowerCase() == "solicitudes" ? "contained" : "outlined"}
            color={this.state.colorTabSolicitudes}
            onPress={this._clickTabSolicitudes}
          >
            Solicitudes ({this.state.dataFriendsRequest.length})
          </Button>

        </View>

        <View style={{ flex: 1, marginVertical: 0, backgroundColor: 'white' }}>

          {(this.state.isLoadingFriends || this.state.isLoadingFriendsRequests) && <ActivityIndicator style={{ padding: 20 }} />}

          {!(this.state.isLoadingFriends || this.state.isLoadingFriendsRequests) && (this.state.tabSeleccionada == 'Amigos') &&

            (
              <View>
                {(this.state.dataFriends.length > 0 &&
                  <FlatList
                    data={this.state.dataFriends}
                    keyExtractor={({ id }, index) => id}
                    renderItem={({ item }) => (
                      <Amistad
                        navigation={this.props.navigation}
                        friendsCount={item.user.statistics.friends}
                        videoCount={item.user.statistics.uploaded}
                        userName={item.user.first_name +' '+ item.user.last_name}
                        userAvatar={item.user.avatar.url}
                      />
                    )}
                  />
                )}

                {(this.state.dataFriends.length == 0 &&

                  <View style={{ alignItems: 'center', padding: 20 }}>
                    <Headline>No hay amigos en tu lista</Headline>
                    <Paragraph>Empezá a conectarte con otros usuarios</Paragraph>
                    <Image
                      style={{ width: 300, height: 300 }}
                      source={require('../images/undraw_friends_ocka.png')}
                    />
                  </View>

                )}

              </View>
            )
          }

          {!(this.state.isLoadingFriends || this.state.isLoadingFriendsRequests) && (this.state.tabSeleccionada == 'Solicitudes') &&
            <View>

              {(this.state.dataFriendsRequest.length > 0 &&
                <FlatList
                  data={this.state.dataFriendsRequest}
                  keyExtractor={({ id }, index) => id}
                  renderItem={({ item }) => (

                    <PedidoAmistad
                      requestId={item.id}
                      friendsCount={item.from_user.statistics.friends}
                      videoCount={item.from_user.statistics.uploaded}
                      requestStatus={item.status}
                      requestDate={moment(item.date_created).format("DD-MM-YYYY  hh:mm:ss")}
                      fromUserName={item.from_user.first_name + ' ' + item.from_user.last_name}
                      userAvatar={item.from_user.avatar.url}
                      //message={item.message}
                      //onPress={this._onToggleSnackBar}
                    />

                  )}
                />
              )}

              {(this.state.dataFriendsRequest.length == 0 &&
                  <View style={{ alignItems: 'center', padding: 20 }}>
                  <Headline>Nada por hacer</Headline>
                  <Paragraph>No hay solicitudes pendientes</Paragraph>
                  <Image
                    style={{ width: 300, height: 300 }}
                    source={require('../images/undraw_a_moment_to_relax_bbpa.png')}
                  />
                </View>
              )}

            </View>
          }

          <Snackbar
            style={{ backgroundColor: this.state.snackBarBackgroundColor, elevation: 20 }}
            visible={this.state.snackBarVisible}
            duration={2000}
            onDismiss={this._onDismissSnackBar}
            action={{
              label: 'OK',
              onPress: () => {
                // Do something
                this._onDismissSnackBar();
              },
            }}
          >
            {this.state.snackBarText}
          </Snackbar>

        </View>

      </View >
    );
  }
}
