import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';
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
        return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

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

        </View>);
    }
}
