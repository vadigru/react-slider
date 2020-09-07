import React from "react";
import PropTypes from "prop-types";

class VideoPlayer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.videoRef = React.createRef();
  }

  componentDidMount() {
    const {src, autoPlay} = this.props;
    const video = this.videoRef.current;
    console.log(src);
    if (video) {
      video.src = src;
      video.autoPlay = autoPlay;
      video.muted = true;
    }
  }

  componentWillUnmount() {
    const video = this.videoRef.current;

    if (video) {
      video.src = ``;
      video.autoPlay = null;
      video.muted = null;
    }
  }

  render() {
    const {src, autoPlay} = this.props;
    console.log(src);
    return (
      <video
        ref={this.videoRef}
        src={src}
        autoPlay={autoPlay}
        onClick={this.handleVideoPlay}
        width="100%"
        height="175"
      >
      </video>
    );
  }
}

VideoPlayer.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  src: PropTypes.string.isRequired,
  autoPlay: PropTypes.bool.isRequired
};

export default VideoPlayer;
