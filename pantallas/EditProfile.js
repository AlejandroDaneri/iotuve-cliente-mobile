import React from 'react';
import { Text, View } from 'react-native';
import { Divider, Card, List, Appbar } from 'react-native-paper';

export class EditProfileScreen extends React.Component {

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: 'midnightblue' }}>
          <Appbar.BackAction
            onPress={(props) => {
              this.props.navigation.goBack(null);
            }}
          />

          <Appbar.Content title="Editar Mis Datos" />
        </Appbar.Header>


        <Card elevation={10} style={{margin: 10,}}>

          <Card.Content>

            <List.Item
              title="Juan"
              left={props => <List.Icon {...props} icon="account" />}
            />
            <Divider />

            <List.Item
              title="Marcos"
              left={props => <List.Icon {...props} icon="account" />}
            />

            <Divider />
            <List.Item
              title="juanmarcos@gmail.com"
              left={props => <List.Icon {...props} icon="email" />}
            />

            <Divider />
            <List.Item
              title="5454-5454"
              left={props => <List.Icon {...props} icon="phone" />}
            />
          </Card.Content>
        </Card>

      </View>
    );
  }
}
