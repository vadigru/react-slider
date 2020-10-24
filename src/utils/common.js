import {WindowDimensions, SlidesCount} from "../const.js";

export const getSlidesCount = (count = 1, width) => {
  switch (true) {
    case count === 0:
      return SlidesCount.MOBILE;
    case width >= WindowDimensions.DESKTOP:
      return count > SlidesCount.DESKTOP ? SlidesCount.DESKTOP : count;
    case width >= WindowDimensions.TABLET && width <= WindowDimensions.DESKTOP:
      return count < SlidesCount.TABLET ? count : SlidesCount.TABLET;
    default:
      return SlidesCount.MOBILE;
  }
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
        // if (typeof it !== `object`) {
        //   return;
        // } else
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

export const isMobile = {
  android: () => {
    return navigator.userAgent.match(/android/i);
  },
  blackberry: () => {
    return navigator.userAgent.match(/blackberry/i);
  },
  iOS: () => {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  opera: () => {
    return navigator.userAgent.match(/opera mini/i);
  },
  windows: () => {
    return navigator.userAgent.match(/iemobile/i);
  },
  any: () => {
    return (isMobile.android() || isMobile.blackberry() || isMobile.iOS() || isMobile.opera() || isMobile.windows());
  }
};
