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
const touchStartSpy = jest.spyOn(Slider.prototype, `touchStart`);
const touchMoveSpy = jest.spyOn(Slider.prototype, `touchMove`);
const touchEndSpy = jest.spyOn(Slider.prototype, `touchEnd`);

const setUp = () => mount(
    <Slider>
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
    const slide = component.find(`div.slide`);
    slide.simulate(`mousedown`);
    expect(touchStartSpy).toHaveBeenCalled();
  });
  it(`Should mousemove be fired`, () => {
    const slide = component.find(`div.slide`);
    slide.simulate(`mousemove`);
    expect(touchMoveSpy).toHaveBeenCalled();
  });
  it(`Should mouseup be fired`, () => {
    const slide = component.find(`div.slide`);
    slide.simulate(`mouseup`);
    expect(touchEndSpy).toHaveBeenCalled();
  });
  it(`Should touchstart be fired`, () => {
    const slide = component.find(`div.slide`);
    slide.simulate(`touchstart`);
    expect(touchStartSpy).toHaveBeenCalled();
  });
  it(`Should touchmove be fired`, () => {
    const slide = component.find(`div.slide`);
    slide.simulate(`touchmove`);
    expect(touchMoveSpy).toHaveBeenCalled();
  });
  it(`Should touchend be fired`, () => {
    const slide = component.find(`div.slide`);
    slide.simulate(`touchend`);
    expect(touchEndSpy).toHaveBeenCalled();
  });

  it(`Should mouseout be fired`, () => {
    const spy = jest.spyOn(Slider.prototype, `resumeAutoplay`);
    const slide = component.find(`div.slide`);

    slide.simulate(`mouseout`);
    expect(spy).toHaveBeenCalled();
  });
});
