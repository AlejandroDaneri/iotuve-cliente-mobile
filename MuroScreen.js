import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Chip, Card, Appbar, Button, Title, Paragraph } from 'react-native-paper';
import PruebaRequestGet from './PruebaRequestGet.js';
import PruebaPlayVideoFile from './PruebaPlayVideoFile.js';
import Video from 'react-native-video';

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
                        title="Muro"
                    />
                    <Appbar.Action icon="network" onPress={() => {
                        this.setState({ showTheRequest: !this.state.showTheRequest });
                    }} />
                    <Appbar.Action icon="wall" onPress={() => {
                        console.log("Navegacion -> Login"),
                            navigation.navigate('Login');
                    }} />
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

                <View>
                    {this.state.showTheRequest &&
                        <PruebaRequestGet />}
                </View>

                <View style={{ flex: 1, marginVertical: 10, backgroundColor: "white" }}>

                    <ScrollView>

                        <Card elevation={6} style={{ margin: 10 }}>
                            <Card.Title title="Viaje de pelicula !!" subtitle="by Juan Marcos" />
                            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                            <Card.Actions>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Chip icon="eye" style={{ marginRight: 4 }}>92.2k</Chip>
                                    <Chip icon="alarm">1:13:54</Chip>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <Chip icon="heart" style={{ marginRight: 4 }}>115</Chip>
                                    <Chip icon="heart-broken">1.1k</Chip>
                                </View>
                            </Card.Actions>
                        </Card>

                        <Card elevation={6} style={{ margin: 10 }}>
                            <Card.Title title="Viaje de pelicula !!" subtitle="by Juan Marcos" />
                            <Card.Cover source={{ uri: 'https://picsum.photos/701' }} />
                            <Card.Actions>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Chip icon="eye" style={{ marginRight: 4 }}>92.2k</Chip>
                                    <Chip icon="alarm">1:13:54</Chip>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <Chip icon="heart" style={{ marginRight: 4 }}>115</Chip>
                                    <Chip icon="heart-broken">1.1k</Chip>
                                </View>

                            </Card.Actions>
                        </Card>

                        <Card elevation={6} style={{ margin: 10 }}>
                            <Card.Title title="Viaje de pelicula !!" subtitle="by Juan Marcos" />
                            <Card.Cover source={{ uri: 'https://picsum.photos/702' }} />
                            <Card.Actions>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Chip icon="eye" style={{ marginRight: 4 }}>92.2k</Chip>
                                    <Chip icon="alarm">1:13:54</Chip>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <Chip icon="heart" style={{ marginRight: 4 }}>115</Chip>
                                    <Chip icon="heart-broken">1.1k</Chip>
                                </View>

                            </Card.Actions>
                        </Card>

                        <Card elevation={6} style={{ margin: 10 }}>
                            <Card.Title title="Viaje de pelicula !!" subtitle="by Juan Marcos" />
                            <Card.Cover source={{ uri: 'https://picsum.photos/703' }} />
                            <Card.Actions>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Chip icon="eye" style={{ marginRight: 4 }}>92.2k</Chip>
                                    <Chip icon="alarm">1:13:54</Chip>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <Chip icon="heart" style={{ marginRight: 4 }}>115</Chip>
                                    <Chip icon="heart-broken">1.1k</Chip>
                                </View>

                            </Card.Actions>
                        </Card>

                        <View style={{ height: 220, backgroundColor: "black", marginVertical: 8 }}>
                            <PruebaPlayVideoFile></PruebaPlayVideoFile>
                        </View>
                        <View style={{ height: 200, backgroundColor: "black", marginVertical: 8 }}>
                            <PruebaPlayVideoFile></PruebaPlayVideoFile>
                        </View>
                        <View style={{ height: 200, backgroundColor: "black", marginVertical: 8 }}>
                            <PruebaPlayVideoFile></PruebaPlayVideoFile>
                        </View>

                    </ScrollView>

                </View>




            </View>

        );
    }
}
