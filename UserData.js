import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Divider, List } from 'react-native-paper';
import { Avatar } from 'react-native-elements';

class UserData extends Component {

  render() {

    return (
      <View>

        <List.Item
          title={this.props.firstName}
          left={props => <List.Icon {...props} icon="account" />}
        />
        <Divider />

        <List.Item
          title={this.props.lastName}
          left={props => <List.Icon {...props} icon="account" />}
        />

        <Divider />
        <List.Item
          title={this.props.email}
          left={props => <List.Icon {...props} icon="email" />}
        />

        <Divider />
        <List.Item
          title={this.props.phone}
          left={props => <List.Icon {...props} icon="phone" />}
        />

        <Divider />
        <View style={{ alignItems: 'center', padding: 10 }}>
          {/* <Avatar.Text size={56} label={this.props.firstName.charAt(0)} /> */}
          <Avatar
            rounded
            size='large'
            source={{
              uri: this.props.avatar
            }}
            onPress = {() => console.log("Tap on avatar. Change avatar?")}
          />

        </View>

      </View>
    );
  }
}


export default UserData;
