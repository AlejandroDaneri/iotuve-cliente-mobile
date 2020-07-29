import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Avatar, Button, Card, Divider, Title, Headline } from 'react-native-paper';

class Amistad extends Component {

  componentDidMount() {
    console.log('componentDidMount (Amistad)');
    console.log(this.props);
  }

  handlePressAccept = () => {
    // Need to check to prevent null exception. 
    this.props.onPress?.(this.props.userName, '1'); // Same as this.props.onPress && this.props.onPress();
  }

  handlePressReject = () => {
    // Need to check to prevent null exception. 
    this.props.onPress?.(this.props.userName, '0'); // Same as this.props.onPress && this.props.onPress();
  }

  render() {

    const { navigation } = this.props;

    return (

      <View>

        <Card
          elevation={10}
          style={styles.cardContainer}
        >

          <View style={{ flexDirection: 'row', }}>

            <Avatar.Image size={56} source={{ uri: this.props.userAvatar }} />

            <View style={{ flex: 1, flexDirection: 'column' }}>

              <Headline style={{ fontSize: 22, paddingLeft: 16, paddingVertical: 10 }}>{this.props.userName}</Headline>

              <View style={{ flexDirection: 'row', }}>
                <Chip icon="video" style={{ marginLeft: 10 }}>
                  {this.props.videoCount} Videos
                </Chip>

                <Chip icon="account-multiple" style={{ marginLeft: 10 }}>
                  {this.props.friendsCount} Amigos
                </Chip>

              </View>

            </View>

          </View>

          <Divider style={{ marginTop: 14 }}></Divider>

          <Card.Actions>
            <View style={styles.actionsRight}>

              <Button
                style={{ marginLeft: 10 }}
                icon="account"
                mode="outlined"
                onPress={() => {
                  console.log('Ir a perfil de usuario '+ this.props.userName);
                  navigation.navigate("Profile", {
                    username: this.props.userName
                  });
                }}>
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
    backgroundColor: 'white'
  },
  actionsRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default Amistad;
