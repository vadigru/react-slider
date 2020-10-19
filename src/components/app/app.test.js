import React from "react";
import renderer from "react-test-renderer";

import App from "./app";

it(`Should render App component`, () => {
  const tree = renderer
    .create(
        <App
          width={`1150px`}
          height={`600px`}
          infinite={true}
          caption={true}
          autoplay={true}
          autoplayDelay={5000}
          indicators={true}
          arrows={true}
          adaptiveSlides={true}
          animatedSwipe={true}
          slidesCount={1}
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
