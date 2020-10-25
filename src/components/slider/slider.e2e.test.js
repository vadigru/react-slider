import React from "react";
import {configure, mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Slider from "./slider.jsx";

configure({
  adapter: new Adapter(),
});

const componentDidMountSpy = jest.spyOn(Slider.prototype, `componentDidMount`);
const componentDidUpdateSpy = jest.spyOn(Slider.prototype, `componentDidUpdate`);
const componentWillUnmountSpy = jest.spyOn(Slider.prototype, `componentWillUnmount`);
const touchStartSpy = jest.spyOn(Slider.prototype, `onTouchStart`);
const touchMoveSpy = jest.spyOn(Slider.prototype, `onTouchMove`);
const touchEndSpy = jest.spyOn(Slider.prototype, `onTouchEnd`);

const setUp = () => mount(
    <Slider
      demoMode={true}
      caption={true}
      autoplay={true}
      autoplayDelay={5000}
      indicators={true}
      arrows={true}
      adaptiveSlides={true}
      animatedSwipe={true}
      animationTime={350}
      slidesCount={1}
    >
      <div>
        <h2>slide 1</h2>
      </div>
    </Slider>
);

let component;

beforeEach(() => {
  jest.spyOn(window, `addEventListener`);
  component = setUp();
});

describe(`Lyfecycle methods`, () => {
  it(`Should call componentDidmount once`, () => {
    expect(componentDidMountSpy).toHaveBeenCalledTimes(1);
  });

  it(`Should not call componentWillUnmount when compoonent just mounted`, () => {
    expect(componentDidMountSpy).toHaveBeenCalledTimes(2);
    expect(componentWillUnmountSpy).toHaveBeenCalledTimes(0);
  });

  it(`Should call componentDidUpdate`, () => {
    component.setState();
    expect(componentDidUpdateSpy).toHaveBeenCalled();
  });

  it(`Should call componentWillUnmount`, () => {
    component.unmount();
    expect(componentWillUnmountSpy).toHaveBeenCalledTimes(1);
  });
});

describe(`Mouse and touch events be fired`, () => {
  it(`Should mousedown be fired`, () => {
    const slide = component.find(`div.slides`);
    slide.simulate(`mousedown`);
    expect(touchStartSpy).toHaveBeenCalled();
  });
  it(`Should mousemove be fired`, () => {
    const slide = component.find(`div.slides`);
    slide.simulate(`mousemove`);
    expect(touchMoveSpy).toHaveBeenCalled();
  });
  it(`Should mouseup be fired`, () => {
    const slide = component.find(`div.slides`);
    slide.simulate(`mouseup`);
    expect(touchEndSpy).toHaveBeenCalled();
  });
  it(`Should touchstart be fired`, () => {
    const slide = component.find(`div.slides`);
    slide.simulate(`touchstart`);
    expect(touchStartSpy).toHaveBeenCalled();
  });
  it(`Should touchmove be fired`, () => {
    const slide = component.find(`div.slides`);
    slide.simulate(`touchmove`);
    expect(touchMoveSpy).toHaveBeenCalled();
  });
  it(`Should touchend be fired`, () => {
    const slide = component.find(`div.slides`);
    slide.simulate(`touchend`);
    expect(touchEndSpy).toHaveBeenCalled();
  });
});
