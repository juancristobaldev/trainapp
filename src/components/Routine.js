import React from "react"
import { Container } from "./generals/Container"


const Routine = ({className,style,children}) => {


    return(
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}

export {Routine}