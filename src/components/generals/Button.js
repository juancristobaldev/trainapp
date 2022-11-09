import React from "react";

const Button = ({disable,textButton,onClick,className}) => {
    
    return(
        <button
        disabled={disable && true}
        style={{cursor:"pointer"}}
        className={className}
        onClick={onClick ? onClick : null}
        >{textButton}</button>
    )
}

export {Button}