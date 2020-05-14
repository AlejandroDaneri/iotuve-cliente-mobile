import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, Appbar } from 'react-native-paper';

import Icon from 'react-native-vector-icons/FontAwesome';

import PedidoAmistad from '../PedidoAmistad.js';

export class FriendRequestScreen extends React.Component {

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

          <Appbar.Content title="Solicitudes de amistad" />
        </Appbar.Header>

        <View style={{ flex: 1, marginVertical: 0, backgroundColor: 'white' }}>
          <ScrollView>

            <PedidoAmistad
              userName="Juancito Romero" />
            <PedidoAmistad
              userName="Pedrito" />
            <PedidoAmistad
              userName="Roberto Gimenez Moralez Pietro Juarez Centurion" />
            <PedidoAmistad
              userName="Roberto Gimenez Moralez Pietro I" />
            <PedidoAmistad
              userName="Roberto Gimenez Pietro II" />
            <PedidoAmistad
              userName="Roberto Moralez Pietro" />
            <PedidoAmistad
              userName="Gimenez Moralez Pietro" />

          </ScrollView>
        </View>

      </View >
    );
  }
}
