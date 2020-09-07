import React from "react";

const Caption = (props) => {
  return (
    <span className={`slide__caption ${!props.caption ? `slide__caption--off` : ``}`}>
      {props.children}
    </span>
  );
};

export default Caption;
