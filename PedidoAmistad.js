import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Chip, Avatar, Button, Card, Divider, Headline } from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialIcons';

class PedidoAmistad extends Component {

  handlePressAccept = () => {
    // Need to check to prevent null exception. 
    this.props.onPress?.(this.props.userName, '1'); // Same as this.props.onPress && this.props.onPress();
  }

  handlePressReject = () => {
    // Need to check to prevent null exception. 
    this.props.onPress?.(this.props.userName, '0'); // Same as this.props.onPress && this.props.onPress();
  }

  render() {

    return (

      <View>

        <Card
          elevation={10}
          style={styles.cardContainer}
        >

          <View style={{ flexDirection: 'row', }}>
            <Avatar.Text size={56} label={this.props.userName.charAt(0)} />

            <View style={{ flexDirection: 'column' }}>

              <Headline style={{ fontSize: 22, paddingLeft: 16, paddingVertical: 10 }}>{this.props.userName}</Headline>

              <View style={{ flexDirection: 'row', }}>
                <Chip icon="video" style={{ marginLeft: 10 }}>
                  12 Videos
                </Chip>

                <Chip icon="account-multiple" style={{ marginLeft: 10 }}>
                  154 Amigos
                </Chip>

              </View>

              <Chip icon="voice" style={{ marginLeft: 10, marginTop: 8 }}>
                Solicitud: 16-11-1980
              </Chip>

            </View>

          </View>

          <Divider style={{ marginTop: 14 }}></Divider>

          <Card.Actions>
            <View style={styles.actionsRight}>

              <Button
                style={{ marginLeft: 10 }}
                icon="close"
                color="red"
                mode="outlined"
                onPress={this.handlePressReject}
              >
                Rechazar
              </Button>

              <Button
                style={{ marginLeft: 10 }}
                icon="check"
                mode="outlined"
                onPress={this.handlePressAccept}
              >
                Aceptar
              </Button>

            </View>
          </Card.Actions>
        </Card>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
    padding: 10,
  },
  actionsRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default PedidoAmistad;
