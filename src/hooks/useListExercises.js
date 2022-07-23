import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie/es6";
import { useGet } from "./useGet";


const useListExercises = ( user, listObject ) => {

    const {state,updateState} = listObject
    const { data,loading } = useGet(`http://localhost:3001/api/select/exercises/user/${user.id}`)

    const [listExercisesSelect,setListExercisesSelect] = useState([]);

    const getExercises = async () => {
        if(!loading){
            let dataBack = [...data];
        
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

    useEffect(() =>{
        getExercises()
    },[data])

    return {
        listExercisesSelect,
        setListExercisesSelect,
        selectOfTheList,
        addExerciseToList,
        getExercises
    }

}

export {useListExercises}