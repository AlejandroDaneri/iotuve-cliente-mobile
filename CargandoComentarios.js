import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

class CargandoComentarios extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <View style={{ alignItems: 'center', padding: 20 }}>

        <ActivityIndicator size="large" style={{ padding: 20 }} />
        <Text style={{ fontSize: 20, padding: 20 }}>Cargando Comentarios</Text>

      </View>
    );

  }
}

export default CargandoComentarios;