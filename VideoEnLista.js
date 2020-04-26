import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Card } from 'react-native-paper';

class VideoEnLista extends Component {
  state = {};

  render() {
    const { navigation } = this.props;

    return (
      <Card
        elevation={6}
        style={styles.cardContainer}
        onPress={() => {
          console.log('press Card');
          //this.props.navigation.navigate('Video');
          navigation.navigate('Video');
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
