import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { GET_EXERCISES_BY_TOKEN } from "../data/query";


const useListExercises = ( token , listObject ) => {

    const {state,updateState} = listObject
    const [listExercisesSelect,setListExercisesSelect] = useState([]);
    const [listOriginal,setListOriginal] = useState([])

    const { data,error } = useQuery(GET_EXERCISES_BY_TOKEN, {
        variables:{
            token:token
        }
    })

    const searchExercise = () => {
        if(data){
            let newData = [...JSON.parse(JSON.stringify(data.getExercisesByToken))];

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
        const newFormCreate  = {...state.dataFormCreate}

        if(listSelectFilt.length > 0){
            
            await listSelect.forEach(item => {
                if(item.select === true){
                    item.select = false
                    item.seriesEx = JSON.parse(item.seriesEx)

                    newList.push(item)
                    newFormCreate.exercises.push(item)
                }
            })

            for(var i = 0; i < newList.length; i++){
                newList[i].idList = i
            }

            updateState({...state, listOnCreate:newList, modal:false, dataFormCreate:newFormCreate})
        }
    }

    const deleteExerciseOfList = (exercise) => {
        const newList = [...state.listOnCreate]
        const newFormCreate = {...state.dataFormCreate}

        const index = newList.findIndex(item => item.idList === exercise.idList)

        newFormCreate.exercises.splice(index,1)
        newList.splice(index,1)

        updateState({...state, listOnCreate:newList, dataFormCreate:newFormCreate})
    }

    useEffect(() =>{
        getExercises()
        searchExercise()
    },[data,state])

    return {
        listOriginal,
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