import React from "react";
import { Container } from "../generals/Container";


const List = ({className,style,children}) => {

    return(
        <Container
        className={className}
        style={style}
        >
            {children}
        </Container>
    )
}

export { List }