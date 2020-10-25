import React from "react";
import {configure, mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import VisualizedSettings from "./visualized-settings.jsx";

configure({
  adapter: new Adapter(),
});

const setWidth = jest.fn(() => {});
const setHeight = jest.fn(() => {});
const changeAnimationTime = jest.fn(() => {});
const changeAutoplayDelay = jest.fn(() => {});
const changeSlidesCount = jest.fn(() => {});

const main = mount(
    <VisualizedSettings
      setWidth={setWidth}
      setHeight={setHeight}
      toggleInfinite={() => {}}
      toggleAutoplay={() => {}}
      changeAutoplayDelay={changeAutoplayDelay}
      toggleIndicators={() => {}}
      toggleArrows={() => {}}
      toggleAdaptive={() => {}}
      toggleAnimatedSwipe={() => {}}
      toggleCaption={() => {}}
      changeSlidesCount={changeSlidesCount}
      changeAnimationTime={changeAnimationTime}
      animationTime={1000}
      autoplayDelay={3000}
      isInfinite={true}
      isAutoplay={true}
      isIndicators={true}
      isArrows={true}
      isAdaptive={true}
      isAnimatedSwipe={true}
      isCaption={true}
      slidesToShow={1}
      sliderWidth={1200}
      sliderHeight={600}
    />
);

describe(`onchange`, () => {
  it(`Should call setWidth on change`, () => {
    const mockedEvent = {target: {}};
    const range = main.find(`#wrange`);
    range.simulate(`change`, mockedEvent);
    expect(setWidth).toHaveBeenCalled();
  });

  it(`Should call setHeight on change`, () => {
    const mockedEvent = {target: {}};
    const range = main.find(`#hrange`);
    range.simulate(`change`, mockedEvent);
    expect(setHeight).toHaveBeenCalled();
  });

  it(`Should call changeAnimationTime on change`, () => {
    const mockedEvent = {target: {}};
    const range = main.find(`#animation-time`);
    range.simulate(`change`, mockedEvent);
    expect(changeAnimationTime).toHaveBeenCalled();
  });

  it(`Should call changeAutoplayDelay on change`, () => {
    const mockedEvent = {target: {}};
    const range = main.find(`#autoplay-delay`);
    range.simulate(`change`, mockedEvent);
    expect(changeAutoplayDelay).toHaveBeenCalled();
  });

  it(`Should call changeSlidesCount on change`, () => {
    const mockedEvent = {target: {}};
    const range = main.find(`#slides-count`);
    range.simulate(`change`, mockedEvent);
    expect(changeSlidesCount).toHaveBeenCalled();
  });
});
