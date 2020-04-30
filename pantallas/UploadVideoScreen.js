import React from 'react';
import { Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';

export class UploadVideoScreen extends React.Component {
  change(x) {
    return x * 10;
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

          <Appbar.Content title="Subir Nuevo Video" />
        </Appbar.Header>

        <Text style={{ fontSize: 30 }}>Subir Nuevo Video</Text>
      </View>
    );
  }
}
