import React from "react";
import { Container } from "../generals/Container";

const Serie = ({children,className}) => {
    return(
        <Container className={className}>
            {children}
        </Container>
    )
}

export {Serie}