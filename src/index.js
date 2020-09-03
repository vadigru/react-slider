import React from "react";
import ReactDom from "react-dom";
import App from "./components/app/app.jsx";
import "./css/main.css";
import "./scss/main.scss";

const init = () => {
  ReactDom.render(
      <App />,
      document.querySelector(`#root`)
  );
};

init();
