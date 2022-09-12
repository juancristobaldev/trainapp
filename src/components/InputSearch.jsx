import React from "react";
import {AiOutlineSearch} from "react-icons/ai"
import { Container } from "./generals/Container";

const InputSearch = ({textSearch, classNameDiv, classNameSpan}) => {
    return ( 
        <Container className={classNameDiv}>
            <span className={classNameSpan}>
                <input
                placeholder={textSearch}
                />
                <AiOutlineSearch/>
            </span>
        </Container>
    )
}

export { InputSearch }