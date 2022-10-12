import React from "react";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";

const ListArray = (props) => {

    let arrErrors = false;
    if(props.errors !== undefined && props.errors[0] !== undefined) arrErrors = Object.values(props.errors)
    return (
    <Container className={`${props.className} ${arrErrors && 'error'}`}>
        {props.data === undefined && props.onError()}
        {props.data.length === 0  && props.onEmpty()}
        {props.data.length > 0 && props.data.map(props.render)}
    </Container>
    )
}

export { ListArray }