import React from "react";
import {configure, mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Arrows from "./arrows.jsx";

configure({
  adapter: new Adapter(),
});

const indicators = [
  0,
];

describe(`navigation buttons to be pressed`, () => {
  const onRightArrowClick = jest.fn(() => {});
  const onLeftArrowClick = jest.fn(() => {});

  const main = mount(
      <Arrows
        activeSlide={1}
        isInfinite={false}
        isDisabled={false}
        isDragging={true}
        slidesToShow={1}
        indicators={indicators}
        onLeftArrowClick={onLeftArrowClick}
        onRightArrowClick={onRightArrowClick}
      />
  );

  it(`Should previous arrow button be pressed`, () => {
    const prevButton = main.find(`button.arrow-prev`);
    prevButton.props().onClick();
    expect(onLeftArrowClick).toHaveBeenCalledTimes(1);
  });

  it(`Should next arrow button be pressed`, () => {
    const nextButton = main.find(`button.arrow-next`);
    nextButton.props().onClick();
    expect(onRightArrowClick).toHaveBeenCalledTimes(1);
  });
});
