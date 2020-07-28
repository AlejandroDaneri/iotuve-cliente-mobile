import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Chip, Avatar, Button, Card, Divider, Headline } from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialIcons';
import EndPoints from './utils/EndPoints';
import AppAsyncStorage from './utils/AppAsyncStorage';
import AppUtils from './utils/AppUtils';

class PedidoAmistad extends Component {

  handlePressAccept = () => {
    this.acceptPedidoAmistad();
    // Need to check to prevent null exception. 
    this.props.onPress?.(this.props.fromUserName, '1'); // Same as this.props.onPress && this.props.onPress();
  }

  handlePressReject = () => {
    this.rejectPedidoAmistad();
    // Need to check to prevent null exception. 
    this.props.onPress?.(this.props.fromUserName, '0'); // Same as this.props.onPress && this.props.onPress();
  }

  async acceptPedidoAmistad() {
    const authToken = await AppAsyncStorage.getTokenFromSession();
    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });
    var myBody = JSON.stringify({ status: "approved", });

    let requestId = this.props.requestId;

    fetch(EndPoints.friendships +'/'+ requestId, {
      method: 'PUT',
      headers: myHeaders,
      body: myBody,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        console.log('------- ACCEPT Server Friendship ------');
        AppUtils.printResponseJson(responseJson);
      })
      .catch((error) => {
        console.log('------- error ACCEPT Server Friendship ------');
        console.log(error);
      });
  }

  async rejectPedidoAmistad() {
    const authToken = await AppAsyncStorage.getTokenFromSession();
    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });

    let requestId = this.props.requestId;

    fetch(EndPoints.friendships +'/'+ requestId, {
      method: 'DELETE',
      headers: myHeaders,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        console.log('------- DELETE Server Friendship ------');
        AppUtils.printResponseJson(responseJson);
      })
      .catch((error) => {
        console.log('------- error DELETE Server Friendship ------');
        console.log(error);
      });
  }

  // creo que rejectRequest ... no va mas.
  async rejectRequest() {
    const authToken = await AppAsyncStorage.getTokenFromSession();
    var myHeaders = new Headers({ 'X-Auth-Token': authToken, });

    fetch(EndPoints.friendships +'/', {
      method: 'PUT',
      headers: myHeaders,
      //body: myBody,
    })
      .then((response) => response.json().then(json => {
        return { data: json, fullResponse: response }
      }))
      .then((responseJson) => {
        AppUtils.printResponseJson(responseJson);

        if (responseJson.fullResponse.ok) {
          this.setState({
            dataFriends: responseJson.data.data,
          });
        } else {
          if (responseJson.fullResponse.status == 401) {
            AppUtils.logout();
            this.props.navigation.navigate("Login");
          } else {
            console.log('que hacer aqui?');
          }
        }

      })
      .catch((error) => {
        console.log('------- error ------');
        console.log(error);
      })
      .finally(() => {
        this.setState({ isLoadingFriends: false })
      });

  }

  
  render() {

    return (

      <View>

        <Card
          elevation={10}
          style={styles.cardContainer}
        >

          <View style={{ flexDirection: 'row', }}>
            <Avatar.Image size={56} source={{ uri: 'http://2.bp.blogspot.com/-YUV22Vr-eJQ/U90_xPOgBZI/AAAAAAAAAGA/A-s5lx3uMKU/s1600/bob02.png', }} />

            <View style={{ flexDirection: 'column' }}>

              <Headline style={{ fontSize: 22, paddingLeft: 16, paddingVertical: 10 }}>{this.props.fromUserName}</Headline>

              <View style={{ flexDirection: 'row', }}>
                <Chip icon="video" style={{ marginLeft: 10 }}>
                  12 Videos
                </Chip>

                <Chip icon="account-multiple" style={{ marginLeft: 10 }}>
                  154 Amigos
                </Chip>

              </View>

              <Chip icon="calendar" style={{ marginLeft: 10, marginTop: 8 }}>
                {this.props.requestDate}
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
