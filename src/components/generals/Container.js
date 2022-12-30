import React from "react";

const Container = ({ onClick, style, children, className }) => {
  return (
    <div onClick={onClick} className={className} style={style}>
      {children}
    </div>
  );
};

export { Container };
