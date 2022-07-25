import React, { useEffect, useState } from "react";
import { getErrorsForm } from "../components/functions/getFormsError";

const useExercises = (user,objectList,state) => {

    const [ dataFormCreateExercise, setDataFormCreateExercise ] = useState(
        {
            id:user.id,
            name:'',
            muscle:'Espalda',
            type:'Peso adicional'
        }
    )

    const [modalDelete,setModalDelete] = useState({
        boolean:false,
        items:[]
    })
    const [errors,setErrors] = useState({error:false,errors:[]})

    const deleteExercise = async (confirmation) => {

        const {list,updateList} = objectList;

        const filter = list.filter(item => item.select === true)
        if(filter.length > 0){
            if(confirmation){
                const requestOption = {
                    method:'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(filter)
                };

                const deleteOfState = () => {
                    const unSelect = list.filter(item => item.select !== true)
                    updateList(unSelect)
                }
                
                const response = await fetch(`http://localhost:3001/api/exercises/delete-exercise/${user.id}`, requestOption);
                response.json()
                .then(data => data === true &&
                    setModalDelete({
                        boolean:false,
                        items:[]
                    })
                )
                deleteOfState()   
            }else{
                const objDelete = {
                    boolean:true,
                    items:[]
                }
                filter.forEach(items => {
                    objDelete.items.push(items.nameEx)
                })
                setModalDelete(objDelete)
            }
        }
    }

    const handleChange = (e,name) => {
        const newData = {...dataFormCreateExercise};
        newData[name] = e.target.value
        setDataFormCreateExercise(newData)
    }

    const createExercise = async (e) => {
        e.preventDefault();
        const {list,updateList} = objectList;
        const {stateValue,setState} = state

        const arrayFusion = [...list, ...stateValue.listOnCreate]
        const searchError = [
            {property:dataFormCreateExercise.name, error:'Debes escribir un nombre para tu ejercicio'}
        ]
        const { errorsForm } = getErrorsForm(searchError)
        const index = arrayFusion.findIndex(item => item.nameEx === dataFormCreateExercise.name)

        if(index >= 0) errorsForm.push('Este ejercicio ya existe en tu lista');
        if(errorsForm.length){
            setErrors({error:true,errors:errorsForm})
        }else{
            const requestOption = {
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataFormCreateExercise)
            };
            const response = await fetch('http://localhost:3001/api/exercises/create-exercise', requestOption);
            response.json()
            .then( data => {
                const filt = [...data]
                if(stateValue.listOnCreate.length > 0){
                    stateValue.listOnCreate.forEach( item => {
                        const index = filt.findIndex(filt => filt.nameEx === item.nameEx)
                        filt.splice(index,1)
                    })
                }
                setState({...stateValue, searchValue:''})
                setTimeout(() => {
                    updateList(filt)
                },50)
            })
        } 
    }
    
    useEffect(() => {
        setErrors({})
    },[dataFormCreateExercise])


    return {
        createExercise,
        deleteExercise,
        handleChange,
        errors,
        setErrors,
        modalDelete,setModalDelete
    }
}

export {useExercises}