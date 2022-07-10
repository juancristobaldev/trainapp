import React from "react"

const Container = ({children,className}) => {

    return(

        <div
        className={className}
        >
            {children}
        </div>
        
    )

}

export {Container}