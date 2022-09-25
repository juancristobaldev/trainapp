import React, { useState } from "react";
import {AiOutlineSearch} from "react-icons/ai"
import { Container } from "./generals/Container";

const InputSearch = ({name ,textSearch, onChange ,classNameDiv, classNameSpan}) => {

    return ( 
        <Container className={classNameDiv}>
            <span className={classNameSpan}>
                <input
                name={name}
                type={"text"}
                onChange={onChange}
                placeholder={textSearch}
                />
                <AiOutlineSearch/>
            </span>
        </Container>
    )
}

export { InputSearch }