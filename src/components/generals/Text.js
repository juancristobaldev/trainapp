import React from "react";
import '../../styles/Text.scss'


const Text = ({className, text, onClick}) => {

    return onClick ? 
    <p
    onClick={() => onClick(text)}
    className={className}
    >
        {text}
    </p> 
    :
    <p
    className={className}
    >
        {text}
    </p>

}

export { Text }