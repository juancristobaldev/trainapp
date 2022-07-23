import React from "react";

const Button = ({textButton,onClick,className}) => {
    return(
        <button
        className={className}
        onClick={onClick}
        >{textButton}</button>
    )
}

export {Button}