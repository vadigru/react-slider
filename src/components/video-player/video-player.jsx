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

    if (video) {
      video.src = src;
      video.autoPlay = autoPlay;
      video.muted = true;
      video.loop = true;
    }
  }

  componentWillUnmount() {
    const video = this.videoRef.current;

    if (video) {
      video.src = ``;
      video.autoPlay = null;
      video.muted = null;
      video.loop = null;

    }
  }

  render() {
    const {src, autoPlay = true} = this.props;
    return (
      <video
        ref={this.videoRef}
        src={src}
        autoPlay={autoPlay}
      >
      </video>
    );
  }
}

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  autoPlay: PropTypes.bool.isRequired
};

export default VideoPlayer;
