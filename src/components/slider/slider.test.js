import React from "react";
import renderer from "react-test-renderer";

import Slider from "./slider.jsx";

it(`Should render Slider component`, () => {
  const tree = renderer.create(
      <Slider>
        <div>
          <img className="slide__background" src="img/image.jpg"/>
          <h2>slide 1</h2>
        </div>
      </Slider>
  );

  expect(tree).toMatchSnapshot();
});
