import React from "react"

const Container = ({style,children,className}) => {

    return(

        <div
        className={className}
        style={style}
        >
            {children}
        </div>
        
    )

}

export {Container}