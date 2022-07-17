import React from "react";
import { Exercise } from "../Exercise";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import { ListSeries } from "./ListSeries";

const ListExercisesOnPlay = ({list,setList,children,getDataRoutine}) => {

    return(
        <Container>
            {list.map( item =>
                    <Exercise
                    getDataRoutine={getDataRoutine}
                    key={item.nameEx}
                    item={item}
                    list={list}
                    setList={setList}
                    />
            )}
        </Container>
    )
}

export { ListExercisesOnPlay }