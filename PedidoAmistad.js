import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Button, Card, Divider } from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialIcons';

class PedidoAmistad extends Component {
  state = {};

  render() {
    const { navigation } = this.props;

    return (
      <Card
        elevation={10}
        style={styles.cardContainer}
      >

        <View style={{ flexDirection: 'row',}}>
          <Icon name="face" size={46} color='midnightblue' />

          <View style={{ flexDirection: 'column'}}>

          <Text style={{ fontSize: 20, paddingLeft: 16, paddingVertical: 10}}>{this.props.userName}</Text>
          <Text style={{ fontSize: 14, paddingLeft: 16, color: 'grey' }}>Videos: 12</Text>
          <Text style={{ fontSize: 14, paddingLeft: 16, color: 'grey' }}>Amigos: 112</Text>
          <Text style={{ fontSize: 14, paddingLeft: 16, color: 'grey' }}>Solicitud: 16-11-1980</Text>
          </View>
         
        </View>

        <Divider style={{marginTop: 14}}></Divider>

        <Card.Actions>
          <View style={styles.actionsRight}>
            <Button
              style={{ marginLeft: 10 }}
              icon="close"
              color="red"
              mode="outlined"
              onPress={() => {
                console.log('Rechazar')
              }}>
              Rechazar
                  </Button>
            <Button
              style={{ marginLeft: 10 }}
              icon="check"
              mode="outlined"
              onPress={() => {
                console.log('Aceptar')
              }}>
              Aceptar
              </Button>
          </View>
        </Card.Actions>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
    padding: 10,
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

export default PedidoAmistad;
