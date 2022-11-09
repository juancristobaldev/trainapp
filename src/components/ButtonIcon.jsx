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
            <input
            onClick={() => onClick()}
            value={textButton}
            type={'button'}
            />
        </Container>
    )
}

export {ButtonIcon}