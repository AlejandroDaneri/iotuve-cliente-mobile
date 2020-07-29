/* Import Libs */
import React from 'react';
import { Platform } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { ScrollView, View, FlatList, RefreshControl, Alert } from 'react-native';
import { Appbar } from 'react-native-paper';
import axios from "axios"
import firebase from "react-native-firebase";
import AsyncStorage from '@react-native-community/async-storage';

/* Import Components */
import VideoEnLista from '../VideoEnLista.js';
import CargandoVideos from '../CargandoVideos.js';

/* Import Utils */
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

    if (Platform.OS !== 'ios') {
      // FCM -----------
      this.checkPermission(); //we check if user has permission to receive push.
      this.createNotificationListeners(); // Register all listener for notification 
      //this.createChannel();
      // FCM -----------
    }

    this.requestWallVideos();
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    // If Premission granted proceed towards token fetch
    if (enabled) {
      console.log('checkPermission FCM -> enabled');
      this.getToken();
    } else {
      // If permission hasn’t been granted to our app, request user in requestPermission method. 
      console.log('checkPermission FCM -> NOT enabled');
      this.requestPermission(); // iOS <<<<<<<<
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('fcmToken obtenido del storage local:');
    console.log(fcmToken);

    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      console.log('fcmToken obtenido de firebase:');
      console.log(fcmToken);

      if (fcmToken) {
        // user has a device token, save in the server
        await this.saveFCMToken(fcmToken);
        // user has a device token, save in storage
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  createChannel = () => {
    const channel = new firebase.notifications.Android.Channel(
      CHANNEL_NOTIFICATIONS.CHANNEL_ID,
      CHANNEL_NOTIFICATIONS.CHANNEL_NAME,
      firebase.notifications.Android.Importance.Max
    ).setDescription(CHANNEL_NOTIFICATIONS.CHANNEL_DESCRIPTION);
    firebase.notifications().android.createChannel(channel);
  };

  async createNotificationListeners() {

    // This listener triggered when notification has been received in foreground
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      console.log('onNotification: ', notification);

      const { title, body } = notification;

      const {
        notifications: {
          Android: {
            Priority: { Max }
          }
        }
      } = firebase;

      const localNotification = new firebase.notifications.Notification()
        .setNotificationId(notification.notificationId)
        .setTitle(notification.title)
        .setSubtitle(notification.subtitle)
        .setBody(notification.body);

      if (Platform.OS === 'android') {
        localNotification._android._channelId = notification.data.channelId;
      }

      //notification.android.setChannelId(CHANNEL_NOTIFICATIONS.CHANNEL_ID);
      //      notification.android.setChannelId(notification.data.channelId);
      //notification.android.setPriority(Max);
      //notification.setData(notification.data);

      console.log('Notificacion propia');
      console.log(localNotification);
      //      firebase.notifications().displayNotification(localNotification);

      this.displayNotification(title, body);
      //firebase.notifications().displayNotification(notification);

      //console.log('Notificacion --> AQUI');

    });

    // This listener triggered when app is in backgound and we click, tapped and opened notifiaction
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      // this.displayNotification(title, body);
    });

    // This listener triggered when app is closed and we click,tapped and opened notification 
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      // this.displayNotification(title, body);
    }
  }

  displayNotification(title, body) {
    // we display notification in alert box with title and body
    Alert.alert(
      title, body,
      [
        { text: 'Ok', onPress: () => console.log('displayNotification -> ok pressed') },
      ],
      { cancelable: false },
    );
  }

  async saveFCMToken(token) {
    const authToken = await AppAsyncStorage.getTokenFromSession();
    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });
    var myBody = JSON.stringify({ token: token, });

    console.log(myHeaders);
    console.log(myBody);

    fetch(EndPoints.fcm, {
      method: 'POST',
      headers: myHeaders,
      body: myBody,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        console.log('------- SAVE Server FCM ------');
        AppUtils.printResponseJson(responseJson);
      })
      .catch((error) => {
        console.log('------- error SAVE Server FCM ------');
        console.log(error);
      });
  }

  async userLogout() {
    const authToken = await AppAsyncStorage.getTokenFromSession();
    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });

    // TODO: DELETE del token en app-server
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    var myBody = JSON.stringify({ token: fcmToken, });

    fetch(EndPoints.fcm, {
      method: 'DELETE',
      headers: myHeaders,
      body: myBody,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        console.log('------- DELETE Server FCM ------');
        AppUtils.printResponseJson(responseJson);
      })
      .catch((error) => {
        console.log('------- error DELETE Server FCM ------');
        console.log(error);
      });

    // borro token de firebase
    firebase.messaging().deleteToken();

    // borro session en el app-server
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
        this.setState({ loadingWallVideos: false });
        AppUtils.logout();
      });
    
  }

  async requestWallVideos() {
    const authToken = await AppAsyncStorage.getTokenFromSession();
    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });

    axios.get(EndPoints.videos, {
      headers: { 'X-Auth-Token': authToken },
      params: {
        limit: 50
      }
    })
      .then(response => {
        const { data } = response

        this.setState({
          listWallVideos: data.data,
          listWallVideosLoaded: true,
        });
      })
      .catch((error) => {
        if (error.response.status === 401) {
          AppUtils.logout()
          this.setState({
            listWallVideosLoaded: false
          })
          this.props.navigation.navigate("Login")
        }
      })
      .finally(() => {
        this.setState({ loadingWallVideos: false })
      });
  }

  onRefresh = () => {
    this.onBack();
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: 'midnightblue' }}>
          <Appbar.Content title="Muro" />

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
            icon="logout"
            onPress={() => {
              Alert.alert(
                'Cerrar sesión',
                '¿Estás seguro?',
                [
                  {
                    text: 'No',
                    onPress: () => console.log('Cancelado por el usuario.'),
                    style: 'cancel'
                  },
                  { 
                    text: 'Sí', 
                    onPress: () => {
                      console.log('Logout. Cerrando sesión en el servidor');
                      this.userLogout();
                      console.log('Navegacion -> Login');
                      const replaceAction = StackActions.replace('Login');
                      this.props.navigation.dispatch(replaceAction);
                    },
                    style: 'default'
                  }
                ],
                { cancelable: false }
              );
            }}
          />

        </Appbar.Header>

        <View style={{ flex: 1, marginVertical: 0, backgroundColor: 'white' }}>
          <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={this.onRefresh} />}>

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
                    videoVisibility={item.visibility}
                    dateCreated={item.date_created}
                    videoTitle={item.title}
                    videoDescription={item.description}
                    videoUser={item.user}
                    videoSnapshot={item.media.thumb}
                    videoURI={item.media.url}
                    videoLength={AppUtils.millisToMinutesAndSeconds(item.media.name)}
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
