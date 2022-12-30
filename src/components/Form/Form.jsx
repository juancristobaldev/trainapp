import React from "react";
import { Container } from "../generals/Container";

const Form = ({
  autoComplete,
  method,
  children,
  textSubmit,
  onSubmit,
  className,
  alter,
  onAlter,
}) => {
  return (
    <form
      autoComplete={autoComplete}
      className={className}
      method={method}
      onSubmit={(e) => onSubmit(e)}
    >
      {children}
      <Container className={"container-submit"}>
        <input type={"submit"} value={textSubmit} />
      </Container>
      {alter && onAlter()}
    </form>
  );
};

export { Form };
