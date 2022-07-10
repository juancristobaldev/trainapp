import React from "react";
import { Container } from "../generals/Container";

const ListExercisesOnPlay = ({array,children}) => {
    return(
        <Container>
            {array.map( item =>  
                <p
                key={item.name}
                >{item.name}</p>
            )}  
        </Container>
    )
}

export { ListExercisesOnPlay }