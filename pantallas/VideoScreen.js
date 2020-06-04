import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Appbar, Card, Chip } from 'react-native-paper';
import PruebaPlayVideoFile from '../PruebaPlayVideoFile.js';

export class VideoScreen extends React.Component {

  constructor(props) {
    super(props);

    
    this.state = {
      selectedFile: '',
    };

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

          <Appbar.Content title="Video" />
        </Appbar.Header>

        <Text style={{ fontSize: 30 }}>{this.props.route.params.title}</Text>
        <Text style={{ fontSize: 20 }}>{this.props.route.params.description}</Text>

        <View
          style={{ height: 220, backgroundColor: 'black', marginVertical: 8 }}>

          <PruebaPlayVideoFile
            uri={this.props.route.params.uri ? this.props.route.params.uri : 'content://com.android.providers.downloads.documents/document/14'}
          />
        </View>


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