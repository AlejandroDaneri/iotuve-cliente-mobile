import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

class CargandoVideos extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <View style={{ alignItems: 'center', padding: 20 }}>

        <ActivityIndicator size="large" style={{ padding: 20 }} />

        <Text style={{ fontSize: 20, padding: 20 }}>Cargando Videos</Text>

        <Icon.Button
          color="white"
          backgroundColor="midnightblue"
          size={64}
          name="play"
          onPress={() => { this.toggleLogoColor(); console.log('Logo clikeado') }}></Icon.Button>

      </View>
    );

  }
}

export default CargandoVideos;