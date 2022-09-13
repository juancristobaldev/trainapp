import React, { useState } from "react";
import {AiOutlineSearch} from "react-icons/ai"
import { Container } from "./generals/Container";

const InputSearch = ({textSearch, onChange ,classNameDiv, classNameSpan, data ,item, updateContent}) => {

    const searchExercise = () => {
        if(data){
            let newData 
            if(item) newData = [...JSON.parse(JSON.stringify(data[item]))];
            else newData = [...JSON.parse(JSON.stringify(data))];

            if(!searchValue.length >= 1){
                setListExercisesSelect(newData)
            }
            else{
                let newList = []
                newData.forEach(exercise => {
                    const nameEx = exercise.nameEx.toLowerCase(),
                    searchExercise = searchValue.toLowerCase()
                    if(nameEx.includes(searchExercise)){
                        newList.push(exercise)
                    }
                })
                setListExercisesSelect(newList)
            }
        }
    }

    return ( 
        <Container className={classNameDiv}>
            <span className={classNameSpan}>
                <input
                type={"text"}
                onChange={onChange}
                placeholder={textSearch}
                />
                <AiOutlineSearch/>
            </span>
        </Container>
    )
}

export { InputSearch }