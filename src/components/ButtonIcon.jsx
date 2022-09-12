import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button } from "./generals/Button";
import { Container } from "./generals/Container";

const ButtonIcon = ({icon,classNameContainer,onClick,textButton}) => {

    return (
        <Container
        className={classNameContainer}
        >
            {icon}
            <Button
            onClick={() => onClick()}
            textButton={textButton}
            />
        </Container>
    )
}

export {ButtonIcon}