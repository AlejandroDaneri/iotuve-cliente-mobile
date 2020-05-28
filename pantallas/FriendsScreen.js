import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, Appbar, Snackbar, ActivityIndicator } from 'react-native-paper';

import Icon from 'react-native-vector-icons/FontAwesome';

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
    colorTabSolicitudes: 'white',

    isLoadingFriends: true,
    isLoadingFriendsRequests: true,
    dataFriends: [],
    dataFriendsRequest: [],
  };

  _clickTabAmigos() {
    this.setState({
      colorTabAmigos: 'midnightblue',
      colorTabSolicitudes: 'white',
      tabSeleccionada: 'Amigos',
    });
  }
  _clickTabSolicitudes() {
    this.setState({
      colorTabAmigos: 'white',
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

  requestFriends() {
    var myHeaders = new Headers({
      'Content-Type': 'application/json',
    });

    fetch('https://reqres.in/api/users?delay=3', {
      method: 'GET',
      headers: myHeaders,
    })
      .then((response) => response.json().then(json => {
        return {
          data: json,
          fullResponse: response
        }
      }))
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);

        if (responseJson.fullResponse.ok) {
          this.setState({
            dataFriends: responseJson.data.data,
          });
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
    const authToken = await AppAsyncStorage.getTokenFromSession();

    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });

    fetch(EndPoints.friendships, {
      method: 'GET',
      headers: myHeaders,
    })
      .then((response) => response.json().then(json => {
        return {
          data: json,
          fullResponse: response
        }
      }))
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);

        if (responseJson.fullResponse.ok) {
          this.setState({
            dataFriendsRequest: responseJson.data.data,
          });
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

    const { snackBarVisible } = this.state;

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
            mode="contained"
            color={this.state.colorTabAmigos}
            backgroundColor="black"
            onPress={this._clickTabAmigos}
          >
            Amigos (3)
          </Button>

          <Button
            style={{ marginLeft: 10 }}
            icon="voice"
            mode="contained"
            color={this.state.colorTabSolicitudes}
            onPress={this._clickTabSolicitudes}
          >
            Solicitudes (5)
          </Button>

        </View>

        <View style={{ flex: 1, marginVertical: 0 }}>

          {(this.state.isLoadingFriends || this.state.isLoadingFriendsRequests) && <ActivityIndicator style={{ padding: 20 }} />}

          {!this.state.isLoadingFriends && (this.state.tabSeleccionada == 'Amigos') &&

            (
              <View>
                <FlatList
                  data={this.state.dataFriends}
                  keyExtractor={({ id }, index) => id}
                  renderItem={({ item }) => (
                    <Amistad
                      friendsCount={item.id}
                      videoCount={item.id}
                      userName={item.first_name}
                      userAvatar={item.avatar}
                    />
                  )}
                />
              </View>
            )
          }

          {!this.state.isLoadingFriendsRequests && (this.state.tabSeleccionada == 'Solicitudes') &&
            <View>
              <FlatList
                data={this.state.dataFriendsRequest}
                keyExtractor={({ id }, index) => id}
                renderItem={({ item }) => (

                  <PedidoAmistad
                    userName={item.from_user}
                    onPress={this._onToggleSnackBar}
                  />

                )}
              />
            </View>
          }

          <Snackbar
            style={{ backgroundColor: this.state.snackBarBackgroundColor }}
            visible={snackBarVisible}
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
