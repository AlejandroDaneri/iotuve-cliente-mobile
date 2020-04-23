import React from 'react';
import { Text, View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import PruebaRequestGet from './PruebaRequestGet.js';

export class MuroScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showTheRequest: false,
        };
    }

    render() {

        const { navigation } = this.props;


        return (

            <View style={{ flex: 1, }}>

                <Appbar.Header
                    style={{ backgroundColor: 'midnightblue' }}
                >
                    <Appbar.Content
                        title="Mis Videos - Muro"
                    />
                    <Appbar.Action icon="chat" onPress={() => {
                        navigation.navigate('Chat');
                    }} />
                    <Appbar.Action icon="settings" onPress={() => {
                        navigation.navigate('Perfil');
                    }} />
                    <Appbar.Action icon="dots-vertical" onPress={() => {
                        alert('Mas Acciones')
                    }} />
                </Appbar.Header>

                <View
                    style={{ padding: 20 }}
                >
                    <Text style={{ fontSize: 30 }}>
                        Muro Screen
            </Text>

                    <Button style={{ marginTop: 15 }} color="red" icon="wall" mode="contained" onPress={() => {
                        console.log("Navegacion -> Login"),
                            navigation.navigate('Login');
                    }}>
                        Ir al Login
            </Button>

                    <Button style={{ marginTop: 15 }} icon="network" mode="contained" onPress={() => { this.setState({ showTheRequest: !this.state.showTheRequest }); }}>
                        Ping Request
            </Button>


                    {this.state.showTheRequest &&
                        <PruebaRequestGet />}
                </View>

            </View>);
    }
}
