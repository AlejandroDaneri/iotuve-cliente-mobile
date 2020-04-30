import React from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import PruebaRequestGet from '../PruebaRequestGet.js';
import VideoEnLista from '../VideoEnLista.js';

export class MuroScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTheRequest: false,
    };
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: 'midnightblue' }}>
          <Appbar.Content title="Muro" />
          <Appbar.Action
            icon="wall"
            color="grey"
            onPress={() => {
              console.log('Navegacion -> Login'), navigation.navigate('Login');
            }}
          />
          <Appbar.Action
            icon="network"
            color="grey"
            onPress={() => {
              this.setState({ showTheRequest: !this.state.showTheRequest });
            }}
          />
          <Appbar.Action
            icon="chat"
            onPress={() => {
              navigation.navigate('Chat');
            }}
          />
          <Appbar.Action
            icon="upload"
            onPress={() => {
              navigation.navigate('UploadVideo');
            }}
          />
          <Appbar.Action
            icon="account"
            onPress={() => {
              navigation.navigate('Perfil');
            }}
          />
          <Appbar.Action
            icon="dots-vertical"
            onPress={() => {
              alert('Mas Acciones');
            }}
          />
        </Appbar.Header>

        <View>{this.state.showTheRequest && <PruebaRequestGet />}</View>

        <View style={{ flex: 1, marginVertical: 0, backgroundColor: 'white' }}>
          <ScrollView>
            <VideoEnLista
              videoTitle="Viaje de pelicula !!"
              videoAuthor="by Juan Marcos"
              videoSnapshot="https://picsum.photos/700"
              videoLength="15:15"
              videoViewCount="123.4k"
              favoritesCount="6"
              notFavoritesCount="1.1k"
              navigation={this.props.navigation}
            />

            <VideoEnLista
              videoTitle="Viaje de pelicula !!"
              videoAuthor="by Juan Marcos"
              videoSnapshot="https://picsum.photos/701"
              videoLength="15:15"
              videoViewCount="123.4k"
              favoritesCount="6"
              notFavoritesCount="1.1k"
              navigation={this.props.navigation}
            />

            <VideoEnLista
              videoTitle="Viaje de pelicula !!"
              videoAuthor="by Juan Marcos"
              videoSnapshot="https://picsum.photos/702"
              videoLength="15:15"
              videoViewCount="123.4k"
              favoritesCount="6"
              notFavoritesCount="1.1k"
              navigation={this.props.navigation}
            />

            <VideoEnLista
              videoTitle="Viaje de pelicula !!"
              videoAuthor="by Juan Marcos"
              videoSnapshot="https://picsum.photos/703"
              videoLength="15:15"
              videoViewCount="123.4k"
              favoritesCount="6"
              notFavoritesCount="1.1k"
              navigation={this.props.navigation}
            />
          </ScrollView>
        </View>
      </View>
    );
  }
}
