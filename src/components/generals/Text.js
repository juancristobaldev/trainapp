import React from "react";
import '../../styles/Text.scss'


const Text = ({className, style, text, onClick}) => {

    return onClick ? 
    <p
    style={style}
    onClick={() => onClick(text)}
    className={className}
    >
        {text}
    </p> 
    :
    <p
    style={style}
    className={className}
    >
        {text}
    </p>

}

export { Text }