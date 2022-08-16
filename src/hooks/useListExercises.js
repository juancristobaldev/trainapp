import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { GET_EXERCISES_BY_TOKEN } from "../data/query";


const useListExercises = ( token , listObject ) => {

    const {state,updateState} = listObject
    const [listExercisesSelect,setListExercisesSelect] = useState([]);

    const { data,error } = useQuery(GET_EXERCISES_BY_TOKEN, {
        variables:{
            token:token
        }
    })

    const searchExercise = () => {
        if(data){
            let newData = [...JSON.parse(JSON.stringify(data.getExercisesByToken))];

            if(state.listOnCreate.length > 0){
                state.listOnCreate.forEach( item => {
                    const index = newData.findIndex(filt => filt.nameEx === item.nameEx)
                    newData.splice(index,1)
                })
            }

            if(!state.searchValue.length >= 1){
                setListExercisesSelect(newData)
            }
            else{
                let newList = []
                newData.forEach(exercise => {
                    const nameEx = exercise.nameEx.toLowerCase(),
                    searchExercise = state.searchValue.toLowerCase()
                    if(nameEx.includes(searchExercise)){
                        newList.push(exercise)
                    }
                })
                setListExercisesSelect(newList)
            }
        }
    }

    const getExercises = async () => {
        if(data){
            let dataBack = [...JSON.parse(JSON.stringify(data.getExercisesByToken))];
            dataBack.forEach(item => {
                item['isAdded'] = false;
                item['select'] = false;
            })
            if(state.listOnCreate.length > 0){
                state.listOnCreate.forEach(item => {
                    const index = dataBack.findIndex(itemData => itemData.nameEx === item.nameEx);
                    if(index >= 0) dataBack.splice(index,1)
                })
            }
            setListExercisesSelect(dataBack)
        }
    }

    const selectOfTheList = (name) => {
        const newList = [...listExercisesSelect];

        newList.forEach(item => {
            if(item.nameEx === name){
                if(item.select) item.select = false
                else item.select = true
            } 
        })

        setListExercisesSelect(newList)
    }

    const addExerciseToList = async () => {
        const newList = [...state.listOnCreate]
        const listSelect = [...listExercisesSelect]
        const listSelectFilt = listExercisesSelect.filter(item => item.select === true);

        if(listSelectFilt.length > 0){
            listSelect.forEach(item => {
                if(item.select === true){
                    item.select = false
                    item.isAdded = true
                    item.seriesEx = JSON.parse(item.seriesEx)
                    newList.push(item);
                }
            })
            const filtList = listSelect.filter(item => item.isAdded !== true);
            updateState({...state, listOnCreate:newList})
            setListExercisesSelect(filtList)
        }
    }

    const deleteExerciseOfList = (exercise) => {
        const newList = [...state.listOnCreate]
        const index = newList.findIndex(item => item.nameEx === exercise.nameEx)
        newList.splice(index,1)
        updateState({...state, listOnCreate:newList})
        

    }

    useEffect(() =>{
        getExercises()
        searchExercise()
    },[data,state])

    return {
        error,
        listExercisesSelect,
        deleteExerciseOfList,
        setListExercisesSelect,
        selectOfTheList,
        addExerciseToList,
        getExercises
    }

}

export {useListExercises}