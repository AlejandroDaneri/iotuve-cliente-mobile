import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { styles } from './utils/AppStyles';

class ChotuveLogo extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      logoColor: "blue",
    };
  }

  toggleLogoColor() {
    var newColor;
    (this.state.logoColor == "midnightblue") ? (newColor = "blue") : (newColor = "midnightblue");
    this.setState({
      logoColor: newColor
    });
  }

  render() {

    return (
      <View style={styles.headerContainer}>
        <Icon.Button
          color={this.state.logoColor}
          backgroundColor="white"
          size={36}
          name="play"
          onPress={() => { this.toggleLogoColor(); console.log('Logo clikeado') }}></Icon.Button>

        <Text style={styles.headerText}>ChoTuve</Text>
      </View>
    );

  }
}

export default ChotuveLogo;