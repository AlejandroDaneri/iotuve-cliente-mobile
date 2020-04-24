import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Chip, Card, Appbar, Button, Title, Paragraph } from 'react-native-paper';
import PruebaRequestGet from './PruebaRequestGet.js';
import PruebaPlayVideoFile from './PruebaPlayVideoFile.js';
import Video from 'react-native-video';
import VideoEnLista from './VideoEnLista.js';

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

                        <VideoEnLista
                            videoTitle="Viaje de pelicula !!" videoAuthor="by Juan Marcos" videoSnapshot="https://picsum.photos/700"
                            videoLength="15:15" videoViewCount="123.4k" favoritesCount="6" notFavoritesCount="1.1k" />

                        <VideoEnLista
                            videoTitle="Viaje de pelicula !!" videoAuthor="by Juan Marcos" videoSnapshot="https://picsum.photos/701"
                            videoLength="15:15" videoViewCount="123.4k" favoritesCount="6" notFavoritesCount="1.1k" />

                        <VideoEnLista
                            videoTitle="Viaje de pelicula !!" videoAuthor="by Juan Marcos" videoSnapshot="https://picsum.photos/702"
                            videoLength="15:15" videoViewCount="123.4k" favoritesCount="6" notFavoritesCount="1.1k" />

                        <VideoEnLista
                            videoTitle="Viaje de pelicula !!" videoAuthor="by Juan Marcos" videoSnapshot="https://picsum.photos/703"
                            videoLength="15:15" videoViewCount="123.4k" favoritesCount="6" notFavoritesCount="1.1k" />

                        <VideoEnLista
                            videoTitle="Viaje de pelicula !!" videoAuthor="by Juan Marcos" videoSnapshot="https://picsum.photos/704"
                            videoLength="15:15" videoViewCount="123.4k" favoritesCount="6" notFavoritesCount="1.1k" />


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
