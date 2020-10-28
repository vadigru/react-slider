import {getSlidesCount, getAdaptiveSlidesCount, getBackground} from "../utils/common.js";

const mock = [{
  props: {
    src: `img/image.jpg`
  }
}];

const mock2 = {
  props: {
    src: `img/image.jpg`
  }
};

it(`Should return count of slides`, () => {
  expect(getSlidesCount(1)).toBe(1);
  expect(getSlidesCount(2)).toBe(2);
  expect(getSlidesCount(3)).toBe(3);
  expect(getSlidesCount(4)).toBe(3);
});

it(`Should return count of slides according window size`, () => {
  expect(getAdaptiveSlidesCount(0, 1150)).toBe(1);
  expect(getAdaptiveSlidesCount(1, 460)).toBe(1);
  expect(getAdaptiveSlidesCount(1, 850)).toBe(1);
  expect(getAdaptiveSlidesCount(1, 1150)).toBe(1);
  expect(getAdaptiveSlidesCount(2, 1200)).toBe(2);
  expect(getAdaptiveSlidesCount(2, 1920)).toBe(2);
  expect(getAdaptiveSlidesCount(3, 1000)).toBe(2);
  expect(getAdaptiveSlidesCount(3, 1920)).toBe(3);
  expect(getAdaptiveSlidesCount(4, 1920)).toBe(3);
});

it(`Should return a background`, () => {
  expect(getBackground(mock)).toEqual(`img/image.jpg`);
  expect(getBackground(mock2)).toBe(`img/image.jpg`);
});
