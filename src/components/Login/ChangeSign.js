import React from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../generals/Container";

const ChangeSign = ({text,textButton,route}) => {

    const navigate = useNavigate()

    return(
        <Container>
           <p>{text}</p>
           <button
            onClick={() => navigate(route)}
           >{textButton}</button>
        </Container>
    )
}

export { ChangeSign }