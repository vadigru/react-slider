import React from "react";
import renderer from "react-test-renderer";

import VisualizedSettings from "./visualized-settings.jsx";

it(`Should render VisualizedSettings component`, () => {
  const tree = renderer
    .create(
        <VisualizedSettings
          setWidth={() => {}}
          setHeight={() => {}}
          toggleInfinite={() => {}}
          toggleAutoplay={() => {}}
          changeAutoplayDelay={() => {}}
          toggleIndicators={() => {}}
          toggleArrows={() => {}}
          toggleAdaptive={() => {}}
          toggleAnimatedSwipe={() => {}}
          toggleCaption={() => {}}
          changeSlidesCount={() => {}}
          changeAnimationTime={() => {}}
          animationTime={1000}
          autoplayDelay={3000}
          isInfinite={true}
          isAutoplay={false}
          isIndicators={true}
          isArrows={true}
          isAdaptive={false}
          isAnimatedSwipe={false}
          isCaption={false}
          slidesToShow={1}
          sliderWidth={1200}
          sliderHeight={600}
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
