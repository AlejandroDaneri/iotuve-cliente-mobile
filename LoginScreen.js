import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { Button, TextInput, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './App';

export class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { navigation } = this.props;
        console.log("render - LoginScreen");

        return (<PaperProvider>

            <SafeAreaView style={styles.safearea}>
                <View style={{ backgroundColor: "midnightblue", flex: 1, padding: 20 }}>

                    <View style={styles.headerContainer}>
                        <Icon.Button color="midnightblue" backgroundColor="white" size={42} name="play" onPress={() => console.log('Logo clikeado')}>
                        </Icon.Button>

                        <Text style={styles.headerText}>ChoTuve</Text>
                    </View>

                    <View style={{ backgroundColor: "black", height: 2 }}></View>

                    <View style={{
                        flexDirection: "column",
                    }}>

                        <View style={{
                            margin: 10,
                            paddingHorizontal: 20,
                            paddingVertical: 20,
                            backgroundColor: "white"
                        }}>

                            <TextInput style={{ m: 15 }} label='Ingrese su Email' mode='outlined' />

                            <TextInput style={{ marginTop: 15 }} label='Ingrese su Clave' mode='outlined' />

                            <Button style={{ marginTop: 15 }} icon="send" mode="contained" onPress={() => {
                                console.log("Click en boton Ingresar en Login");
                            }}>
                                Ingresar
                            </Button>

                            <Button style={{ marginTop: 15 }} color="red" icon="wall" mode="contained" onPress={() => {
                                console.log("Navegacion -> Muro"),
                                    navigation.navigate('Muro');
                            }}>
                                Navegar al Muro
                            </Button>

                        </View>

                        <View style={{ backgroundColor: "black", height: 2 }}></View>

                    </View>
                </View>
            </SafeAreaView>

        </PaperProvider>);
    }
}
