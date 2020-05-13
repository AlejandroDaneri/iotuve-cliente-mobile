import React from 'react';
import { Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';

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
        
        <View style={{ padding: 30 }}>
          <Text style={{ fontSize: 30 }}>FriendRequestScreen</Text>
        </View>

      </View>
    );
  }
}
