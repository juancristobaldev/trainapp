import React from "react";
import { Container } from "../generals/Container";

const Create = ({className ,children}) => {
    return (
        <Container
        className={className}
        >
            {children}
        </Container>
    )
}

export {Create}