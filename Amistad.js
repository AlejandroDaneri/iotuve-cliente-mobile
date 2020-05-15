import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Button, Card, Divider } from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialIcons';

class Amistad extends Component {

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
            <Icon name="face" size={46} color='midnightblue' />

            <View style={{ flexDirection: 'column' }}>

              <Text style={{ fontSize: 20, paddingLeft: 16, paddingVertical: 10 }}>{this.props.userName}</Text>
              <Text style={{ fontSize: 14, paddingLeft: 16, color: 'grey' }}>Videos: 12</Text>
              <Text style={{ fontSize: 14, paddingLeft: 16, color: 'grey' }}>Amigos: 112</Text>
            </View>

          </View>

          <Divider style={{ marginTop: 14 }}></Divider>

          <Card.Actions>
            <View style={styles.actionsRight}>

              <Button
                style={{ marginLeft: 10 }}
                icon="account"
                mode="outlined"
              >
                Ver Perfil
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

export default Amistad;
