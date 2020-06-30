import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
//import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';

class PruebaPlayVideoFile extends Component {
  render() {
    // http://techslides.com/demos/sample-videos/small.mp4
    // https://www.radiantmediaplayer.com/media/bbb-360p.mp4

    return (
      <VideoPlayer
        source={{ uri: this.props.uri }}
        ref={(ref) => {
          this.player = ref;
        }}
        style={styles.backgroundVideo}
        resizeMode={'contain'}
        onBuffer={this.onBuffer}
        onError={this.videoError}
        showOnStart={false}
        disableVolume={true}
        disableFullscreen={true}
        disableBack={true}
      />
    );
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

export default PruebaPlayVideoFile;
