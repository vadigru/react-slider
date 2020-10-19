import React from "react";
import {configure, mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import SlideIndicators from "./slide-indicators.jsx";

configure({
  adapter: new Adapter(),
});

const indicators = [
  0,
  1,
  2,
];

it(`Should previous slide button be pressed`, () => {

  const onIndicatorDotClick = jest.fn(() => {});

  const main = mount(
      <SlideIndicators
        activeSlide={2}
        isCaption={false}
        slidesToShow={2}
        indicators={indicators}
        onIndicatorDotClick={onIndicatorDotClick}
      />
  );

  const indicatorDots = main.find(`div.indicators__item`);
  const indicatorInnerDots = main.find(`div.indicators__item-inner`);

  indicatorDots.forEach((dot) => dot.props().onClick());
  indicatorInnerDots.forEach((innerDot) => innerDot.props().onClick());
  expect(onIndicatorDotClick).toHaveBeenCalledTimes(indicatorDots.length + indicatorInnerDots.length);
  expect(onIndicatorDotClick).toHaveBeenCalledTimes(indicatorDots.length + indicatorInnerDots.length);
});
