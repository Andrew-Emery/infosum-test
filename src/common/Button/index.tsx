import React from "react";

interface ButtonPropsModel {
  color: string;
  text: string;
  onClick: any;
  onHover: any;
}

const Button = ({ color, text, onClick, onHover }: ButtonPropsModel) => {
  //Just a reusable button with predetermined CSS
  return (
    <button
      style={{ backgroundColor: color, color: "white" }}
      className="btn"
      onClick={onClick}
      onMouseOver={onHover}
    >
      {text}
    </button>
  );
};

// Set the default properties
Button.defaultProps = {
  color: "#13294b",
};

export default Button;
