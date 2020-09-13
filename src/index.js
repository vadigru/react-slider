import React from "react";
import ReactDom from "react-dom";
import App from "./components/app/app.jsx";
import "./css/main.css";
import "./scss/main.scss";

const init = () => {
  ReactDom.render(
      <App
        slidesToShow={1}
        isInfinite={true}
        isCaption={false}
      />,
      document.querySelector(`#root`)
  );
};

init();
