import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, Appbar, Snackbar } from 'react-native-paper';

import Icon from 'react-native-vector-icons/FontAwesome';

import PedidoAmistad from '../PedidoAmistad.js';
import Amistad from '../Amistad.js';

export class FriendsScreen extends React.Component {

  constructor(props) {
    super(props);

    this._onToggleSnackBar = this._onToggleSnackBar.bind(this);
    this._onDismissSnackBar = this._onDismissSnackBar.bind(this);
    this._clickTabSolicitudes = this._clickTabSolicitudes.bind(this);
    this._clickTabAmigos = this._clickTabAmigos.bind(this);
  };

  state = {
    snackBarVisible: false,
    snackBarText: '',
    snackBarBackgroundColor: 'blue',

    tabSeleccionada: 'Amigos',
    colorTabAmigos: 'midnightblue',
    colorTabSolicitudes: 'white',
  };

  _clickTabAmigos() {
    this.setState({
      colorTabAmigos: 'midnightblue',
      colorTabSolicitudes: 'white',
      tabSeleccionada: 'Amigos',
    });
  }
  _clickTabSolicitudes() {
    this.setState({
      colorTabAmigos: 'white',
      colorTabSolicitudes: 'midnightblue',
      tabSeleccionada: 'Solicitudes',
    });
  }

  _onToggleSnackBar(name, action) {
    this._onDismissSnackBar();

    let color;
    let texto;

    if (action == 1) {
      color = 'blue';
      texto = name + ' :: Aceptado';
    } else {
      color = 'red';
      texto = name + ' :: Rechazado';
    }

    this.setState({
      snackBarBackgroundColor: color,
      snackBarVisible: !this.state.snackBarVisible,
      snackBarText: texto,

    });
  }

  _onDismissSnackBar() {
    this.setState({
      snackBarVisible: false
    });
  }

  render() {
    const { navigation } = this.props;

    const { snackBarVisible } = this.state;

    return (

      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: 'midnightblue' }}>
          <Appbar.BackAction
            onPress={(props) => {
              this.props.navigation.goBack(null);
            }}
          />

          <Appbar.Content title="Amistades" />
        </Appbar.Header>

        <View style={{ justifyContent: 'center', paddingVertical: 10, flexDirection: 'row', marginVertical: 0, backgroundColor: 'darkslateblue' }}>

          <Button
            style={{ marginLeft: 10 }}
            icon="account-multiple"
            mode="contained"
            color={this.state.colorTabAmigos}
            backgroundColor="black"
            onPress={this._clickTabAmigos}
          >
            Amigos (3)
          </Button>

          <Button
            style={{ marginLeft: 10 }}
            icon="account-check"
            mode="contained"
            color={this.state.colorTabSolicitudes}
            onPress={this._clickTabSolicitudes}
          >
            Solicitudes (5)
          </Button>

        </View>

        <View style={{ flex: 1, marginVertical: 0, backgroundColor: 'white' }}>

          {this.state.tabSeleccionada == 'Amigos' &&
            <ScrollView>

              <Amistad
                userName="Bob Esponja"
              />

              <Amistad
                userName="Patricio"
              />

              <Amistad
                userName="Calamardo"
              />

            </ScrollView>
          }

          {this.state.tabSeleccionada == 'Solicitudes' &&
            <ScrollView>

              <PedidoAmistad
                userName="Don Cangrejo"
                onPress={this._onToggleSnackBar}
              />
              <PedidoAmistad
                userName="Arenita"
                onPress={this._onToggleSnackBar} />
              <PedidoAmistad
                userName="Plancton"
                onPress={this._onToggleSnackBar} />
              <PedidoAmistad
                userName="Perlita"
                onPress={this._onToggleSnackBar} />
              <PedidoAmistad
                userName="Gary"
                onPress={this._onToggleSnackBar} />

            </ScrollView>
          }

          <Snackbar
            style={{ backgroundColor: this.state.snackBarBackgroundColor }}
            visible={snackBarVisible}
            duration={2000}
            onDismiss={this._onDismissSnackBar}
            action={{
              label: 'OK',
              onPress: () => {
                // Do something
                this._onDismissSnackBar();
              },
            }}
          >
            {this.state.snackBarText}
          </Snackbar>

        </View>

      </View >
    );
  }
}
