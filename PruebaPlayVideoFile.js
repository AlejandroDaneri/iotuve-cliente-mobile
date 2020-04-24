import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import Video from 'react-native-video';

class PruebaPlayVideoFile extends Component {

   render() {

      // http://techslides.com/demos/sample-videos/small.mp4
      // https://www.radiantmediaplayer.com/media/bbb-360p.mp4

      return (
         <Video
            source={{ uri: "http://techslides.com/demos/sample-videos/small.mp4" }}
            ref={(ref) => {
               this.player = ref
            }}
            style={styles.backgroundVideo}
            resizeMode={'contain'}
            onBuffer={this.onBuffer}
            onError={this.videoError}
         />
      )

   }

}

var styles = StyleSheet.create({
   backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
   },
});

export default PruebaPlayVideoFile