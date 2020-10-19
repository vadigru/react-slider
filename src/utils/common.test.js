import {getSlidesCount, getBackground} from "../utils/common.js";

const mock = {
  props: {
    src: `img/image.jpg`
  }
};

it(`Should get count of slides according window size`, () => {
  expect(getSlidesCount(0, 1150)).toBe(1);
  expect(getSlidesCount(1, 1150)).toBe(1);
  expect(getSlidesCount(2, 1200)).toBe(2);
  expect(getSlidesCount(2, 1920)).toBe(2);
  expect(getSlidesCount(3, 1000)).toBe(2);
  expect(getSlidesCount(3, 1920)).toBe(3);
  expect(getSlidesCount(4, 1920)).toBe(3);
});

it(`Should return a background`, () => {
  expect(getBackground(mock)).toEqual(`img/image.jpg`);
});
