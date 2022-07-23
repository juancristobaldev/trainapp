import React from "react";

const Form = ({method,children,textSubmit,onSubmit}) => {
    

    return(
        <form 
        method={method}
        onSubmit={e => onSubmit(e)}>
            {children}
            <input type={"submit"} value={textSubmit}/>
        </form>
    )
}

export {Form}