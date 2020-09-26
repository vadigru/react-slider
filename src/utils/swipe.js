

const sensitivity = 20;

let touchPositionStart = null;
let touchPositionCurrent = null;
let touchTimeStart = null;
let touchTimeEnd = null;

const checkAction = (slide, next, prev) => {
  let positionDiff = {
    x: touchPositionStart.x - touchPositionCurrent.x,
  };

  if (Math.abs(positionDiff.x) > sensitivity && touchTimeEnd - touchTimeStart > 150) {
    if (positionDiff.x > 0) {
      next(slide);
    } else {
      prev(slide);
    }
  }
};

export const touchStart = (evt) => {
  touchTimeStart = evt.timeStamp;
  if (evt.type === `mousedown`) {
    evt.preventDefault();
    touchPositionStart = {
      x: evt.clientX,
    };
  } else {
    touchPositionStart = {
      x: evt.changedTouches[0].clientX,
    };
  }

  touchPositionCurrent = {
    x: touchPositionStart.x,
  };
};

export const touchMove = (evt) => {
  if (evt.type === `mousemove`) {
    evt.preventDefault();
    touchPositionCurrent = {
      x: evt.clientX,
    };
  } else {
    touchPositionCurrent = {
      x: evt.changedTouches[0].clientX,
    };
  }
};

export const touchEnd = (evt, slide, next, prev) => {
  touchTimeEnd = evt.timeStamp;
  checkAction(slide, next, prev);
  touchPositionStart = null;
  touchPositionCurrent = null;
};
