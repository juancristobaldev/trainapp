import React from "react";

const Options = ({ arrayOptions }) => {
  return (
    <React.Fragment>
      {arrayOptions.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </React.Fragment>
  );
};

export { Options };
