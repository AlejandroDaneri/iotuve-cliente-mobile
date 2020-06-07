import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Appbar, Card, Chip, Divider, IconButton, Colors } from 'react-native-paper';
import PruebaPlayVideoFile from '../PruebaPlayVideoFile.js';
import { ScrollView } from 'react-native-gesture-handler';

export class VideoScreen extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      selectedFile: '',
    };

  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: 'midnightblue' }}>
          <Appbar.BackAction
            onPress={(props) => {
              this.props.navigation.goBack(null);
            }}
          />

          <Appbar.Content title="Video" />
        </Appbar.Header>

        <View
          style={{ height: 220, backgroundColor: 'black' }}>

          <PruebaPlayVideoFile
            uri={this.props.route.params.uri ? this.props.route.params.uri : 'content://com.android.providers.downloads.documents/document/14'}
          />
        </View>

        <ScrollView>

          <View style={{ backgroundColor: Colors.grey50, paddingHorizontal: 8 }}>

            <View style={{ marginTop: 8, justifyContent: 'space-between', flexDirection: 'row' }}>
              <View style={styles.actionsLeft}>
                <Chip icon="eye" style={{ marginRight: 4 }}>1234</Chip>
                <Chip icon="alarm">11:22</Chip>
              </View>
              <View style={styles.actionsRight}>
                <Chip icon="heart" style={{ marginRight: 4 }}>123</Chip>
                <Chip icon="heart-broken">35</Chip>
              </View>
            </View>

            <Divider style={{ marginTop: 8 }} />

            <Text style={{ fontSize: 30 }}>{this.props.route.params.title}</Text>
            <Text style={{ fontSize: 18 }}>{this.props.route.params.description}</Text>

            <Divider style={{ marginVertical: 8 }} />

            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <Chip icon="account">usuario1</Chip>
              <Chip icon="calendar">14 de Marzo, 22:30</Chip>
            </View>
            <Divider style={{ marginTop: 8, backgroundColor: Colors.black }} />
          </View>

          <View style={{ justifyContent: 'flex-start', flexDirection: 'row', marginHorizontal:8, marginTop: 8 }}>
            <IconButton
              icon="comment"
              color={Colors.grey500}
              size={20}
              onPress={() => console.log('Pressed')}
            />
            <Text style={{alignSelf: 'center', fontSize: 20 }}>Comentarios:</Text>
          </View>

          <Card elevation={6} style={styles.cardContainer}>
            <Card.Content>
              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <Chip mode='outlined' icon="account">Patricio Estrella</Chip>
                <Chip mode='outlined' icon="calendar">12-12-20</Chip>
              </View>
              <Text style={{ marginLeft: 8, marginTop: 8 }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </Text>
            </Card.Content>
          </Card>

          <Card elevation={6} style={styles.cardContainer}>
            <Card.Content>
              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <Chip mode='outlined' icon="account">Calamardo</Chip>
                <Chip mode='outlined' icon="calendar">16-12-20</Chip>
              </View>
              <Text style={{ marginLeft: 8, marginTop: 8 }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</Text>
            </Card.Content>
          </Card>

          <Card elevation={6} style={styles.cardContainer}>
            <Card.Content>
              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <Chip mode='outlined' icon="account">Bob Esponja</Chip>
                <Chip mode='outlined' icon="calendar">12-12-20</Chip>
              </View>

              <Text style={{ marginLeft: 8, marginTop: 8 }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
            </Card.Content>
          </Card>

        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
  },
  actionsLeft: {
    flex: 1,
    flexDirection: 'row',
  },
  actionsRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});