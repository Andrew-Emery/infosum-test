import "./styles.css";
import React from "react";

export default () => {
  //Loading wheel, does a barrel roll using css keyframes.
  return (
    <div className="spinner-container">
      <div className="spinner-box">
        <img className="spinner-icon" src="/src/img/spinner.svg" />
        <div className="spinner-text">Loading your data...</div>
      </div>
    </div>
  );
};
