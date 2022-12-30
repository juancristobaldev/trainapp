import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Button } from "./generals/Button";
import { Container } from "./generals/Container";

const InputSearch = ({
  name,
  button,
  textSearch,
  onChange,
  classNameDiv,
  classNameSpan,
}) => {
  return (
    <Container className={classNameDiv}>
      <span className={classNameSpan}>
        <input
          name={name}
          type={"text"}
          onChange={onChange}
          placeholder={textSearch}
        />
        <AiOutlineSearch />
      </span>
      {button && (
        <Button
          className={button.className}
          textButton={button.text}
          onClick={button.function}
        />
      )}
    </Container>
  );
};

export { InputSearch };
