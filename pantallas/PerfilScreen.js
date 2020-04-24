import React from 'react';
import { Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';

export class PerfilScreen extends React.Component {

    render() {

        const { navigation } = this.props;
        return (<View style={{ flex: 1, }}>

            <Appbar.Header
                style={{ backgroundColor: 'midnightblue' }}
            >
                <Appbar.BackAction
                    onPress={(props) => { this.props.navigation.goBack(null) }}
                />

                <Appbar.Content
                    title="Mi Perfil"
                />
            </Appbar.Header>

            <Text style={{ fontSize: 30 }}>
                Perfil Screen
            </Text>

        </View>);
    }
}
