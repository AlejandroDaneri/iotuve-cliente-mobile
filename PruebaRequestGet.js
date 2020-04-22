import React, { Component } from 'react'
import { ActivityIndicator, View, Text } from 'react-native'

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

      fetch('https://jsonplaceholder.typicode.com/posts/1', {
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

      console.log("render method");
      console.log(hasData);

      return (
         <View>

            {myOutput}

            <Text style={{ color: 'white', padding: 6 }}>
               ID = {this.state.data.id}
            </Text>
            <Text style={{ color: 'white', padding: 6 }}>
               TITLE = {this.state.data.title}
            </Text>
            <Text
               style={{ color: 'white', padding: 6 }}>
               BODY = {this.state.data.body}
            </Text>

         </View>
      )
   }
}
export default PruebaRequestGet