import React from 'react';
import { Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import PruebaPlayVideoFile from '../PruebaPlayVideoFile.js';

export class VideoScreen extends React.Component {
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

        <Text style={{ fontSize: 30 }}>Video Screen</Text>

        <View
          style={{ height: 220, backgroundColor: 'black', marginVertical: 8 }}>
          <PruebaPlayVideoFile></PruebaPlayVideoFile>
        </View>
      </View>
    );
  }
}
