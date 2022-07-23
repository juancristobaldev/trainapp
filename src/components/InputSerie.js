import React from "react";

const InputSerie = ({className,style,name,onChange,type,objEx}) => {
    return (
        <input
        className={className}
        style={style}
        name={name}
        type={type}
        onChange={(e) => onChange(e,name,objEx)}
        />
    )
}

export {InputSerie}