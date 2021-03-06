import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
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

        <Image
          style={{ width: 300, height: 300 }}
          source={require('./images/undraw_youtube_tutorial_2gn3.png')}
        />

      </View>
    );

  }
}

export default CargandoVideos;