import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import { Popover } from "../Popover";

const Routine = ({
  classNameContainer,
  classNameHeader,
  header,
  style,
  children,
  popOver,
  childrenPopover,
  routine,
  darkMode,
  backinfo,
  sandwichFunction,
  sandwichMode,
}) => {
  const [popover, updatePopover] = useState(false);

  return (
    <>
      {routine && (
        <Container className={classNameContainer}>
          {header ? (
            header
          ) : (
            <Container
              onClick={
                sandwichMode
                  ? () => {
                      sandwichFunction({
                        ...backinfo,
                        active: !backinfo.active,
                        id: routine.id,
                      });
                    }
                  : null
              }
              className={classNameHeader}
            >
              <Text text={routine.name} />
              <Container style={{ position: "relative" }}>
                {popOver && (
                  <>
                    <BsThreeDots
                      cursor={"pointer"}
                      onClick={() => updatePopover(true)}
                    />
                    {popover && (
                      <Popover
                        darkMode={darkMode}
                        unPopover={() => updatePopover(false)}
                      >
                        {childrenPopover}
                      </Popover>
                    )}
                  </>
                )}
              </Container>
            </Container>
          )}
          {children}
        </Container>
      )}
    </>
  );
};

export { Routine };
