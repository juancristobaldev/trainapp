import React from "react";
import { RiAddLine } from "react-icons/ri";
import "../styles/AddItem.scss"
import { Container } from "./generals/Container";
import { Text } from "./generals/Text";

const AddItem = ({onClick,widthScreen,darkMode,text}) => {
    return (
        <Container onClick={onClick} 
        className={`add-item ${widthScreen > 650 && "web"} ${ darkMode && "darkMode"}`}>
            <Text
            text={text}
            />
        </Container>
    )
}

export {AddItem}