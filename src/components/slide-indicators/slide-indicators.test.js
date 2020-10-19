import React from "react";
import renderer from "react-test-renderer";

import SlideIndicators from "./slide-indicators.jsx";

it(`Should render Arrows component`, () => {
  const indicators = [
    0,
    1,
    2,
  ];

  const tree = renderer
    .create(
        <SlideIndicators
          activeSlide={2}
          isCaption={true}
          slidesToShow={2}
          indicators={indicators}
          onIndicatorDotClick={() => {}}
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
