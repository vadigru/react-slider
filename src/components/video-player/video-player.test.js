import React from "react";
import renderer from "react-test-renderer";
import VideoPlayer from "./video-player.jsx";

const mock = {
  posterUrl: `https://url.com/poster.jpg`,
  previewUrl: `https://url.com/preview/video.mp4`,
};

it(`Should render VideoPlayer component`, () => {
  const {previewUrl} = mock;
  const tree = renderer
    .create(
        <VideoPlayer
          isPlaying={false}
          src={previewUrl}
          autoPlay={true}
        />)
  .toJSON();

  expect(tree).toMatchSnapshot();
});
