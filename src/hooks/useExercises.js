import React, { useEffect, useState } from "react";
import { getErrorsForm } from "../components/functions/getFormsError";
import { CREATE_EXERCISE, DELETE_EXERCISE } from "../data/mutations";
import { useMutation } from "@apollo/client";
import { GET_EXERCISES_BY_TOKEN } from "../data/query";

const useExercises = (token,objectList,state) => {

    const {stateValue,setState} = state

    const [ dataFormCreateExercise, setDataFormCreateExercise ] = useState(
        {
            token:token,
            name:'',
            typeEx:'Peso adicional',
            muscleEx:'Espalda',
            seriesEx:JSON.stringify([])
        }
    )
    const [errors,setErrors] = useState({})

    const [createExercise] = useMutation(CREATE_EXERCISE)
    const [deleteExercise] = useMutation(DELETE_EXERCISE)

    const deleteSomeExercise = async (confirmation,itemsDelete) => {
        const {list,updateList} = objectList;
        let filter = list.filter(item => item.select === true)

        if(filter.length > 0  || confirmation){
            
            if(filter.length === 0) filter = [...stateValue.modalDelete.items]

            if(confirmation){

                const deleteOfState = async () => {
                    const listFilt = [...list]
                    await itemsDelete.forEach(itemDelete => {
                        const index = listFilt.findIndex(itemList => itemList.id === itemDelete.id)
                        if(index >= 0) listFilt.splice(index,1)
                    })
                    updateList(listFilt)
                }
                
                filter.forEach( async (item) => {
                    await deleteExercise({
                        variables:{
                            input:{
                                token:token,
                                name:item.name
                            }
                        },
                        refetchQueries:[{query:GET_EXERCISES_BY_TOKEN,variables:{
                            token:token
                        }}]
                    }).then( async ({data}) => {

                        const { errors, success } = data.deleteExercise
    
                        if(errors) console.log(errors )
                        if(success) console.log('Ejercicio/s eliminados correctamente')
    
                    })
                })
                await deleteOfState()   
                setState({...stateValue, modal:true, modalDelete:{boolean:false,items:[]}})

            }else{
                const objDelete = {
                    boolean:true,
                    items:[]
                }
                filter.forEach(item => {
                    objDelete.items.push(item)
                })
                setState({...stateValue, modal: false,modalDelete:objDelete})
            }
        }
    }

    const handleChange = (e,name) => {
        const newData = {...dataFormCreateExercise};
        newData[name] = e.target.value
        setDataFormCreateExercise(newData)
    }

    const createNewExercise = async (e) => {
        e.preventDefault();
        const newErrors = {}
        const {list,updateList} = objectList;
        const {stateValue,setState} = state

        const arrayFusion = [...list, ...stateValue.listOnCreate]
 
        if(dataFormCreateExercise.name.length === 0) newErrors.name = 'Debes ingresar un nombre para tu ejercicio.'
        const index = arrayFusion.findIndex(item => item.name === dataFormCreateExercise.name)
        if(index >= 0) newErrors.alreadyExist = 'Ya creaste un ejercicio con este nombre.'

        const arrErrors = Object.values(newErrors)

        if(arrErrors.length > 0){
            setErrors(newErrors)
        }else{
            await createExercise({
                variables: {
                    input: {...dataFormCreateExercise},
                },
                refetchQueries:[{query: GET_EXERCISES_BY_TOKEN,variables:{
                    token:token
                }}]
            }).then( async ({data}) => {
                const {errors,success} = data.createExercise;
                const listForSelect = [...list]
                listForSelect.push({...dataFormCreateExercise, seriesEx:JSON.parse(dataFormCreateExercise.seriesEx)})

                console.log(listForSelect)

                if(success) console.log('Ejercicio creado con exito')
                if(errors.length) console.log(errors)
                
                updateList(listForSelect)
                setState({...stateValue, modalCreate:false, modal:true})
            })
        } 
    }

    
    useEffect(() => {
        setErrors({})
    },[dataFormCreateExercise,stateValue.modal,stateValue.modalCreate])


    return {
        createNewExercise,
        deleteSomeExercise,
        handleChange,
        errors,
        setErrors,    }
}

export {useExercises}