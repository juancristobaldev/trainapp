import React from "react";
import { Container } from "./generals/Container";

import "../styles/Popover.scss";
import { Text } from "./generals/Text";

const Popover = ({ children, unPopover, darkMode }) => {
  console.log(darkMode);
  return (
    <>
      <Container onClick={unPopover} className={"backPopover"} />
      <Container className={`popover ${darkMode && "darkMode"}`}>
        <Text className={"title"} text={"Menu"} />
        {children}
      </Container>
    </>
  );
};

export { Popover };
