import React from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../generals/Container";

const ChangeSign = ({ className, text, textButton, route }) => {
  const navigate = useNavigate();

  return (
    <Container className={className}>
      <p>{text}</p>
      <button onClick={() => navigate(route)}>{textButton}</button>
    </Container>
  );
};

export { ChangeSign };
