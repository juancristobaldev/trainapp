import React from "react";
import { Container } from "./generals/Container";
import ReactLoading from "react-loading";
import "../styles/Loading.scss";

const Loading = () => {
  return (
    <Container className={"loading"}>
      <ReactLoading type="spokes" />
    </Container>
  );
};

export { Loading };
