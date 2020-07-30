import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Chip, Card, Button, Divider, List } from 'react-native-paper';
import EndPoints from './utils/EndPoints';
import AppAsyncStorage from './utils/AppAsyncStorage';
import AppUtils from './utils/AppUtils';

class VideoEnLista extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = {
      videoVisible: true,

      videoTitle: props.videoTitle,
      videoDescription: props.videoDescription,
      videoVisibility: props.videoVisibility,
      
    }
  }

  componentDidMount() {
    //console.log(this.props.dateCreated);
  }

  async deleteVideo(videoId) {

    const authToken = await AppAsyncStorage.getTokenFromSession();
    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });

    console.log('Borrando video...');
    fetch(EndPoints.videos + "/" + videoId, {
      method: 'DELETE',
      headers: myHeaders,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);
        this.setState({
          videoVisible: false
        });
      })
      .catch((error) => {
        console.log('------- error ------');
        console.log(error);
      })
      .finally(() => {
      });
  }

  render() {
    const { navigation } = this.props;

    return (
      <View>

        {(this.state.videoVisible &&
          <Card
            elevation={10}
            style={styles.cardContainer}
            onPress={() => {
              console.log('press Card');
              navigation.navigate('Video', {
                id: this.props.videoId,
                title: this.state.videoTitle,
                description: this.state.videoDescription,
                dateCreated: this.props.dateCreated,
                user: this.props.videoUser,
                uri: this.props.videoURI,
                videoLength: this.props.videoLength,
                count_views: this.props.videoViewCount,
                count_likes: this.props.favoritesCount,
                count_dislikes: this.props.notFavoritesCount,
                user_like: this.props.userLike,
                user_dislike: this.props.userDislike,
              });
            }}>
            <Card.Title
              title={this.state.videoTitle}
              subtitle={this.props.videoAuthor}
            />
            <Card.Cover source={{ uri: this.props.videoSnapshot }} />
            <Card.Actions>
              <View style={{ flexDirection: 'column', alignItems: "stretch", flex: 1 }}>

                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.actionsLeft}>
                    <Chip icon="eye" style={{ marginRight: 4 }}>
                      {this.props.videoViewCount}
                    </Chip>
                    <Chip icon="alarm">{this.props.videoLength}</Chip>
                  </View>
                  <View style={styles.actionsRight}>
                    <Chip
                      style={{ marginRight: 4 }}
                      icon="heart"
                      selectedColor={(this.props.userLike) ? 'blue' : 'black'}
                    >
                      {this.props.favoritesCount}
                    </Chip>
                    <Chip
                      icon="heart-broken"
                      selectedColor={(this.props.userDislike) ? 'blue' : 'black'}
                    >{this.props.notFavoritesCount}</Chip>
                  </View>
                </View>

                {this.props.ownerVideo &&
                  <View style={{ paddingVertical: 10 }}>
                    <Divider />

                    <View>
                      <List.Item
                        title={(this.state.videoVisibility == 'public' ? 'Video Público' : 'Video Privado')}
                        left={props => <List.Icon {...props} icon="lock" />}
                      />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 4 }}>
                      <Button
                        mode="contained"
                        icon="video"
                        onPress={() => {
                          navigation.navigate("EditVideo", {
                            allVideoInfo: this.props,
                            updateVideoInfo: item => {
                              this.setState({
                                videoVisibility: item.videoVisibility,
                                videoTitle: item.videoTitle,
                                videoDescription: item.videoDescription
                              })
                            },
                          });
                        }}
                      >
                        Editar Video
                      </Button>

                      <Button
                        style={{ backgroundColor: '#CC0000' }}
                        mode="contained"
                        icon="delete"
                        onPress={() => {
                          Alert.alert(
                            'Borrar video',
                            '¿Confirma eliminar este video en forma permanente?',
                            [
                              {
                                text: 'No',
                                onPress: () => console.log('Cancelado por el usuario.'),
                                style: 'cancel'
                              },
                              {
                                text: 'Sí',
                                onPress: () => this.deleteVideo(this.props.videoId),
                                style: 'default'
                              }
                            ],
                            { cancelable: false }
                          );
                        }}
                      >
                        Borrar
                      </Button>
                    </View>
                  </View>
                }

              </View>
            </Card.Actions>
          </Card>
        )}

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

export default VideoEnLista;
