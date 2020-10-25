import React from "react";
import renderer from "react-test-renderer";

import Slider from "./slider.jsx";

it(`Should render Slider component`, () => {
  const tree = renderer.create(
      <Slider
        demoMode={false}
        width={1200}
        height={600}
        infinite={true}
        caption={true}
        autoplay={true}
        autoplayDelay={5000}
        indicators={true}
        arrows={true}
        adaptiveSlides={true}
        animatedSwipe={true}
        animationTime={350}
        slidesCount={3}
      >
        <div>
          <h2>slide 1</h2>
        </div>
      </Slider>
  );

  expect(tree).toMatchSnapshot();
});
