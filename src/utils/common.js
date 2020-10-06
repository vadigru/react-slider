export const getSlidesCount = (count = 1) => {
  let windowWidth = window.innerWidth;
  if (count > 1) {
    if (windowWidth > 1150) {
      count = count;
    } else if (windowWidth > 768 && windowWidth < 1150) {
      count = 2;
    } else if (windowWidth < 768) {
      count = 1;
    }
  }

  return count;
};
