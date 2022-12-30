import React from "react";

const InputSerie = ({
  value,
  placeholder,
  className,
  style,
  name,
  onChange,
  type,
  objEx,
}) => {
  return (
    <input
      value={value}
      placeholder={placeholder}
      className={className}
      style={style}
      name={name}
      type={type}
      onChange={(e) => onChange(e, name, objEx)}
    />
  );
};

export { InputSerie };
