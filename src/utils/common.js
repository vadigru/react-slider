import {WindowDimensions} from "../const.js";
export const getSlidesCount = (count = 1) => {
  let windowWidth = window.innerWidth;
  if (count >= 1) {
    if (windowWidth > WindowDimensions.DESKTOP) {
      count = count > 3 ? 3 : count;
    } else if (windowWidth > WindowDimensions.TABLET && windowWidth < WindowDimensions.DESKTOP) {
      count = count < 2 ? count : 2;
    } else if (windowWidth < WindowDimensions.TABLET) {
      count = 1;
    }
  }

  return count;
};

export const getSlideData = (arr) => {
  const newArr = [];
  arr.forEach((it) => newArr.push(it.props.children));
  return newArr;
};

export const getBackground = (arr) => {
  let background = ``;
  switch (true) {
    case Array.isArray(arr):
      arr.some((it) => {
        if (it.props.src) {
          background = it.props.src;
        }
      });
      break;
    default:
      for (let property in arr) {
        if (arr.hasOwnProperty(property)) {
          if (arr[`props`].src) {
            background = arr[`props`].src;
          }
        }
      }
  }
  return background;
};
