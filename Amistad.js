import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Avatar, Button, Card, Divider, Title, Headline } from 'react-native-paper';
import AppAsyncStorage from './utils/AppAsyncStorage';
import EndPoints from './utils/EndPoints';
import AppUtils from './utils/AppUtils';

class Amistad extends React.Component {

  constructor(props) {
    super(props);

    this.deleteFriendship = this.deleteFriendship.bind(this);
  };

  state = { showCard: true }

  async deleteFriendship() {
    const authToken = await AppAsyncStorage.getTokenFromSession();
    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });

    let friendshipId = this.props.friendshipId;
    console.log(friendshipId);

    fetch(EndPoints.friendships + '/' + friendshipId, {
      method: 'DELETE',
      headers: myHeaders,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        console.log('------- DELETE Server Friendship ------');
        AppUtils.printResponseJson(responseJson);

        this.setState({ showCard: false });

        // Need to check to prevent null exception. 
        this.props.onPress?.(); // Same as this.props.onPress && this.props.onPress();

      })
      .catch((error) => {
        console.log('------- error DELETE Server Friendship ------');
        console.log(error);
      });

  }

  render() {

    const { navigation } = this.props;

    return (

      <View>

        {this.state.showCard &&

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
                    {(this.props.videoCount == 1) ? this.props.videoCount + ' Video' : this.props.videoCount + ' Videos'}
                  </Chip>

                  <Chip icon="account-multiple" style={{ marginLeft: 10 }}>
                    {(this.props.friendsCount == 1) ? this.props.friendsCount + ' Video' : this.props.friendsCount + ' Videos'}
                  </Chip>

                </View>

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
                  onPress={this.deleteFriendship}
                >
                  Borrar
              </Button>

                <Button
                  style={{ marginLeft: 10 }}
                  icon="account"
                  mode="outlined"
                  onPress={() => {
                    console.log('Ir a perfil de usuario ' + this.props.userNameEmail);
                    navigation.push("Profile", {
                      username: this.props.userNameEmail
                    });
                  }}>
                  Ver Perfil
              </Button>

              </View>
            </Card.Actions>
          </Card>

        }

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
