// const sensitivity = 20;

// let touchPositionStart = null;
// let touchPositionCurrent = null;
// let touchTimeStart = null;
// let touchTimeEnd = null;

// const checkAction = (slide, next, prev) => {
//   let positionDiff = {
//     x: touchPositionStart.x - touchPositionCurrent.x,
//     y: touchPositionStart.y - touchPositionCurrent.y
//   };

//   if (Math.abs(positionDiff.x) > Math.abs(positionDiff.y)) {
//     if (Math.abs(positionDiff.x) > sensitivity && touchTimeEnd - touchTimeStart > 150) {
//       if (positionDiff.x > 0) {
//         next(slide);
//       } else {
//         prev(slide);
//       }
//     }
//   }
// };

// export const touchStart = (evt) => {
//   touchTimeStart = evt.timeStamp;
//   if (evt.changedTouches === undefined) {
//     evt.preventDefault();
//     touchPositionStart = {
//       x: evt.clientX,
//       y: evt.clientY,
//     };
//   } else {
//     touchPositionStart = {
//       x: evt.changedTouches[0].clientX,
//       y: evt.changedTouches[0].clientY,
//     };
//   }

//   touchPositionCurrent = {
//     x: touchPositionStart.x,
//     y: touchPositionStart.y
//   };
// };

// export const touchMove = (evt) => {
//   if (evt.changedTouches === undefined) {
//     evt.preventDefault();
//     touchPositionCurrent = {
//       x: evt.clientX,
//       y: evt.clientY,
//     };
//   } else {
//     touchPositionCurrent = {
//       x: evt.changedTouches[0].clientX,
//       y: evt.changedTouches[0].clientY,
//     };
//   }
// };

// export const touchEnd = (evt, slide, next, prev) => {
//   touchTimeEnd = evt.timeStamp;
//   checkAction(slide, next, prev);
//   touchPositionStart = null;
//   touchPositionCurrent = null;
// };

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
