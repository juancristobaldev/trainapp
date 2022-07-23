import React, { Children } from "react";
import { Container } from "./generals/Container";

const Title = ({children,onClick,buttonText}) => {
    return (
        <React.Fragment>
            <h2>
                {children}
            </h2>
            <button
            onClick={() => onClick()}
            >
                {buttonText}
            </button>
        </React.Fragment>


    )
}
export {Title}