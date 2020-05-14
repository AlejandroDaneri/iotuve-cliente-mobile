import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Badge,
  Divider,
  Title,
  Paragraph,
  Chip,
  Card,
  Appbar,
} from 'react-native-paper';
import VideoEnLista from '../VideoEnLista.js';

export class PerfilScreen extends React.Component {
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
              console.log('Navegacion -> Friend Request'),
                navigation.navigate('FriendRequest');
            }}
          />

          <Appbar.Action
            icon="pencil"
            onPress={() => {
              alert('Editar Mi Perfil');
            }}
          />

        </Appbar.Header>

        <ScrollView>
          <View>
            <Card elevation={6} style={styles.cardContainer}>
              <Card.Title
                title="Juan Marcos"
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
              </Card.Content>
            </Card>
          </View>

          <View>
            <Text style={{ fontSize: 30, marginHorizontal: 10, marginTop: 10 }}>
              Listado de tus videos
            </Text>

            <View style={{ flex: 1, marginVertical: 10 }}>
              <VideoEnLista
                videoTitle="Camino del bosque encantado"
                videoAuthor="by Juan Marcos"
                videoSnapshot="https://picsum.photos/710"
                videoLength="15:15"
                videoViewCount="123.4k"
                favoritesCount="6"
                notFavoritesCount="1.1k"
                navigation={this.props.navigation}
              />

              <VideoEnLista
                videoTitle="Titulo video 2"
                videoAuthor="by Juan Marcos"
                videoSnapshot="https://picsum.photos/711"
                videoLength="15:15"
                videoViewCount="123.4k"
                favoritesCount="6"
                notFavoritesCount="1.1k"
                navigation={this.props.navigation}
              />

              <VideoEnLista
                videoTitle="Titulo video 3"
                videoAuthor="by Juan Marcos"
                videoSnapshot="https://picsum.photos/712"
                videoLength="15:15"
                videoViewCount="123.4k"
                favoritesCount="6"
                notFavoritesCount="1.1k"
                navigation={this.props.navigation}
              />

              <VideoEnLista
                videoTitle="Titulo video 4"
                videoAuthor="by Juan Marcos"
                videoSnapshot="https://picsum.photos/713"
                videoLength="15:15"
                videoViewCount="123.4k"
                favoritesCount="6"
                notFavoritesCount="1.1k"
                navigation={this.props.navigation}
              />
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
