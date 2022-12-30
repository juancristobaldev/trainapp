import React from "react";
import "../../styles/Text.scss";

const Text = ({ id, className, style, text, onClick }) => {
  return onClick ? (
    <p
      id={id}
      style={style}
      onClick={() => onClick(text)}
      className={className}
    >
      {text}
    </p>
  ) : (
    <p id={id} style={style} className={className}>
      {text}
    </p>
  );
};

export { Text };
