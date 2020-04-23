import React, { Component } from 'react'
import { ActivityIndicator, View, Text } from 'react-native'


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

class PruebaRequestGet extends Component {
   state = {
      loading: true,
      data: ''
   }

   // llamo a fetchData, pero con un delay de unos segundos para mostrar "efecto loading"
   delayedFetchData = () => setTimeout(() => {
      console.log("setTimeout");

      this.fetchData();
      this.setState({ loading: false })

   }, 2000)


   fetchData = () => {
      console.log("fetchData");

      fetch("https://reactnative.dev/movies.json", {
         method: 'GET'
      })
         .then((response) => response.json())
         .then((responseJson) => {
            console.log(responseJson);
            this.setState({
               data: responseJson,
               loading: false,
            })
         })
         .catch((error) => {
            console.error(error);
         });
   }

   componentDidMount = () => {
      this.delayedFetchData();
   }

   render() {

      var hasData = (this.state.loading != false);
      let myOutput;
      if (hasData) {
         myOutput = <ActivityIndicator size="large" color="#0000ff" />
      } else {
         myOutput = <Text style={{ color: 'white', padding: 6, fontSize: 18 }}>Info traida por request:</Text>
      }

      console.log("render method - PruebaRequestGet.js");
      console.log(hasData);
      console.log("DATA");
      console.log(this.state.data);
      console.log(this.state.code);

      return (
         <View
         style={{margin: 20, padding: 20,backgroundColor: "black"}}
         >

            {myOutput}

            <Text style={{ color: 'white', padding: 6 }}>
               CODE = {this.state.data.title}
            </Text>
            <Text style={{ color: 'white', padding: 6 }}>
               MESSAGE = {this.state.data.message}
            </Text>
            <Text
               style={{ color: 'white', padding: 6 }}>
               STATUS = {this.state.data.status}
            </Text>

         </View>
      )
   }
}
export default PruebaRequestGet