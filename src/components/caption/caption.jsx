import React from "react";
import PropTypes from "prop-types";

const Caption = (props) => {
  const {isCaption = false, children} = props;

  return (
    <span className={`slide__caption ${isCaption ? `` : `slide__caption--off`}`}>
      {children}
    </span>
  );
};

Caption.propTypes = {
  isCaption: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export default Caption;
