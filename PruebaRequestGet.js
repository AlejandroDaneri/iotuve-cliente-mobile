import React, { Component } from 'react';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  Text,
} from 'react-native';
import { List } from 'react-native-paper';

import AppUtils from './utils/AppUtils.js';

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
    data: '',
  };

  // llamo a fetchData, pero con un delay de unos segundos para mostrar "efecto loading"
  delayedFetchData = () =>
    setTimeout(() => {
      console.log('setTimeout');

      this.fetchData();
      this.setState({ loading: false });
    }, 2000);

  fetchData = () => {
    console.log('fetchData');

    /*
      {
         "name": "morpheus",
         "job": "leader"
     }
      */
    // "https://reactnative.dev/movies.json"
    // https://reqres.in/api/users
    // global.endpoint_ping

    /*  Ejemplo con POST
      fetch("https://reqres.in/api/users", {
         method: 'POST',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            name: 'guido',
            job: 'mobile dev',
         }),
      })
      */

    /*
  getPing(
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  ).then((responseJson) => { // status 200 comes here
    // data => // do something with data.id, data.user
    console.log(responseJson);
    this.setState({
      data: responseJson,
      loading: false,
    });
  })
    .catch((error) => { // status 400, 500 comes here
      // error =>  // here error.reason will give me further info, i also want to know whether status was 400 or 500 etc
      console.error(error);
    });
    */

    var misHeaders = new Headers({
      //Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Auth-Token': '4567890',
    });

    fetch(AppUtils.endpoint_users, {
      method: 'GET',
      headers: misHeaders,
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((responseJson) => {
        console.log("----------------------------");
        console.log(responseJson);
        console.log("----------------------------");

        /*
        this.setState({
          data: responseJson,
          loading: false,
        });
        */

      })
      .catch((error) => {
        console.log("--------error-------------");
        console.error(error);
      });
  };

  componentDidMount = () => {
    this.delayedFetchData();
  };

  render() {
    var hasData = this.state.loading != false;
    let myOutput;
    if (hasData) {
      myOutput = <ActivityIndicator size="large" color="#0000ff" />;
    } else {
      myOutput = (
        <Text style={{ color: 'black', padding: 6, fontSize: 18 }}>
          Data via request / endpoint:
        </Text>
      );
    }

    console.log('render method - PruebaRequestGet.js');
    console.log(hasData);
    console.log('DATA');
    console.log(this.state.data.movies);

    return (
      <View style={{ margin: 20, padding: 20, backgroundColor: 'azure' }}>
        {myOutput}

        <Text style={{ color: 'black', padding: 6 }}>
          CODE = {this.state.data.code}
        </Text>
        <Text style={{ color: 'black', padding: 6 }}>
          MESSAGE = {this.state.data.message}
        </Text>
        <Text style={{ color: 'black', padding: 6 }}>
          STATUS = {this.state.data.status}
        </Text>

        {this.state.data.movies != null && (
          <View style={{ height: 200, backgroundColor: 'white' }}>
            <FlatList
              data={this.state.data.movies}
              renderItem={({ item }) => (
                <List.Item
                  title={item.title}
                  description={item.releaseYear}
                  left={(props) => <List.Icon {...props} icon="movie" />}
                />
              )}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default PruebaRequestGet;
