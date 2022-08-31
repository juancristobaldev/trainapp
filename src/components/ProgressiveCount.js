import React from "react";
import { useProgressiveCount } from "../hooks/useProgressiveCount";
import { Text } from "./generals/Text";

const ProgressiveCount = ({id}) => {

    const { timeRoutine } = useProgressiveCount()

    return ( 
        <>
            <Text id={id}  text={`Tiempo actual : ${timeRoutine.hour ? `${timeRoutine.hour}:${timeRoutine.min}:${timeRoutine.seg}` : "00:00:00"}`}/>
        </>

    )
}

export { ProgressiveCount }