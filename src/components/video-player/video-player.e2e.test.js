import React from "react";
import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import VideoPlayer from "./video-player.jsx";

Enzyme.configure({
  adapter: new Adapter()
});

const mock = {
  posterUrl: `https://url.com/poster.jpg`,
  previewUrl: `https://url.com/preview/video.mp4`,
};

it(`Should change VideoPlayer state on click`, () => {
  const {previewUrl} = mock;

  const spy = jest
    .spyOn(window.HTMLMediaElement.prototype, `play`)
    .mockImplementation(() => {});

  const videoPlayer = mount(
      <VideoPlayer
        isPlaying={false}
        src={previewUrl}
        autoPlay={false}
      />
  );

  expect(videoPlayer.prop(`isPlaying`)).toBe(false);
  expect(spy).toHaveBeenCalledTimes(0);
  spy.mockRestore();
});
