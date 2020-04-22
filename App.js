import React from 'react';
import { AppRegistry } from 'react-native';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native';
import { Button, TextInput, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import PruebaRequestGet from './PruebaRequestGet.js'

/*
// No estoy usando esto ahora, TODO: borrar.

async function getMoviesFromApiAsync() {
  try {
    let response = await fetch('https://reactnative.dev/movies.json');
    let json = await response.json();
    console.log("json.movies");
    console.log(json.movies);
    return json.movies;
  } catch (error) {
    console.error("error");
    console.error(error);
  }
}
*/

export default class HelloWorldApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showTheRequest: false,
    };
  }

  render() {

    return (
    <PaperProvider>

      <SafeAreaView style={styles.safearea}>
        <View style={{ backgroundColor: "midnightblue", flex: 1, padding: 20 }}>

          <View style={styles.headerContainer}>
            <Icon.Button
              color="midnightblue"
              backgroundColor="white"
              size={42}
              name="play"
              onPress={() => console.log('Logo clikeado')}
            >
            </Icon.Button>

            <Text style={styles.headerText}>ChoTuve</Text>
          </View>

          <View style={{ backgroundColor: "black", height: 2 }}></View>

          <View
            style={{
              flexDirection: "column",
              //flex: 1,
              //height: 400,

            }}
          >

            <View style={{
              margin: 10,
              paddingHorizontal: 20,
              paddingVertical: 20,
              backgroundColor: "white"
            }}>

              <TextInput
                style={{ m: 15 }}
                label='Ingrese su Email'
                mode='outlined'
              />

              <TextInput
                style={{ marginTop: 15 }}
                label='Ingrese su Clave'
                mode='outlined'
              />

              <Button
                style={{ marginTop: 15 }}
                icon="send"
                mode="contained"
                onPress={() => { this.setState({ showTheRequest: ! this.state.showTheRequest}) }}
              >
                Ingresar
            </Button>

            </View>

            <View style={{ backgroundColor: "black", height: 2 }}></View>


            {this.state.showTheRequest &&
              <PruebaRequestGet />
            }

          </View>
        </View>
      </SafeAreaView>

    </PaperProvider >
    )

  }
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
  },
  headerContainer: {
    //flex: 1,
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  headerText: {
    color: 'white',
    fontSize: 50,
  },
  center: {
    alignItems: 'center'
  }
})

AppRegistry.registerComponent('main', () => HelloWorldApp);