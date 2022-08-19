import React from "react";
import { Container } from "../generals/Container";

const Form = ({method,children,textSubmit,onSubmit, className}) => {
    

    return(
        <form 
        className={className}
        method={method}
        onSubmit={e => onSubmit(e)}>
            {children}
            <Container className={'container-submit'}>
                <input type={"submit"} value={textSubmit}/>
            </Container>
        </form>
    )
}

export {Form}