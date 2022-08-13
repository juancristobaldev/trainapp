import React, { Children } from "react";
import { Button } from "./generals/Button";
import { Container } from "./generals/Container";

const Title = ({children,onClick,buttonText}) => {
    return (
        <React.Fragment>
            <h3>
                {children}
            </h3>
            <Button
            textButton={buttonText}
            onClick={() => onClick()}
            />
        </React.Fragment>


    )
}
export {Title}