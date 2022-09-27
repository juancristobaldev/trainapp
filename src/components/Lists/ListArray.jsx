import React from "react";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";

const ListArray = (props) => {
    console.log(props.data)
    return (
    <Container className={props.className}>
        {props.data === undefined && <Text text={props.textOnError}/>}
        {props.data.length === 0  && <Text text={props.textOnEmpty}/>}
        {props.data.length > 0 && props.data.map(props.render)}
    </Container>
    )
}

export { ListArray }