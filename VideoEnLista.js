import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Card } from 'react-native-paper';

class VideoEnLista extends Component {
  state = {};

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //console.log(this.props);
  }

  render() {
    const { navigation } = this.props;

    return (
      <Card
        elevation={10}
        style={styles.cardContainer}
        onPress={() => {
          console.log('press Card');
          navigation.navigate('Video',{
            id: this.props.videoId,
            title: this.props.videoTitle,
            description: this.props.videoDescription,
            uri: this.props.videoURI,
            count_views:  this.props.videoViewCount,
            count_likes: this.props.favoritesCount,
            count_dislikes: this.props.notFavoritesCount,
            user_like: this.props.userLike,
            user_dislike: this.props.userDislike,
          });
        }}>
        <Card.Title
          title={this.props.videoTitle}
          subtitle={this.props.videoAuthor}
        />
        <Card.Cover source={{ uri: this.props.videoSnapshot }} />
        <Card.Actions>
          <View style={styles.actionsLeft}>
            <Chip icon="eye" style={{ marginRight: 4 }}>
              {this.props.videoViewCount}
            </Chip>
            <Chip icon="alarm">{this.props.videoLength}</Chip>
          </View>
          <View style={styles.actionsRight}>
            <Chip icon="heart" style={{ marginRight: 4 }}>
              {this.props.favoritesCount}
            </Chip>
            <Chip icon="heart-broken">{this.props.notFavoritesCount}</Chip>
          </View>
        </Card.Actions>
      </Card>
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
