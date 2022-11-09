import React from "react";
import { Container } from "../generals/Container";

const List = (props) => {

    let arrErrors = false;
    if(props.errors !== undefined && props.errors[0] !== undefined) arrErrors = Object.values(props.errors)
    return(
        <Container
        style={props.style}
        className={`${props.className} ${!props.item.length && 'empty'} ${arrErrors && 'error'}`}
        >
            {!props.item.length && props.onEmpty()}
            {props.item.map(props.render)}
            {props.children}
        </Container>
    )
}

export { List }