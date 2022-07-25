import React from "react";
import { Container } from "../generals/Container";

const List = (props) => {
    return(
        <Container
        style={props.style}
        className={props.className}
        >
            {!props.item.length && props.onEmpty()}
            {props.item.map(props.render)}
            {props.children}
        </Container>
    )
}

export { List }