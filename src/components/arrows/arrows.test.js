import React from "react";
import renderer from "react-test-renderer";

import Arrows from "./arrows.jsx";

const indicators = [
  0,
  1,
  2,
];

it(`Should render Arrows component`, () => {
  const tree = renderer
    .create(
        <Arrows
          activeSlide={2}
          isInfinite={true}
          isDisabled={false}
          isDragging={false}
          slidesToShow={2}
          indicators={indicators}
          onLeftArrowClick={() => {}}
          onRightArrowClick={() => {}}
        />,
        {
          createNodeMock: () => {
            return document.createElement(`div`);
          }
        }
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
