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
            nameEx:'',
            typeEx:'Peso adicional',
            muscleEx:'Espalda',
            seriesEx:JSON.stringify([])
        }
    )
    const [errors,setErrors] = useState({})

    const [createExercise] = useMutation(CREATE_EXERCISE)
    const [deleteExercise] = useMutation(DELETE_EXERCISE)

    const deleteSomeExercise = async (confirmation) => {
        const {list,updateList} = objectList;
        let filter = list.filter(item => item.select === true)

        if(filter.length > 0  || confirmation){
            
            if(filter.length === 0) filter = [...stateValue.modalDelete.items]

            if(confirmation){
                const deleteOfState = () => {
                    const unSelect = list.filter(item => item.select !== true)
                    updateList(unSelect)
                }
                
                filter.forEach( async (item) => {
                    await deleteExercise({
                        variables:{
                            input:{
                                token:token,
                                nameEx:item.nameEx
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
                setState({...stateValue, modal:true, modalDelete:{boolean:false,items:[]}})
                deleteOfState()   
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
 
        if(dataFormCreateExercise.nameEx.length === 0) newErrors.name = 'Debes ingresar un nombre para tu ejercicio.'
        const index = arrayFusion.findIndex(item => item.nameEx === dataFormCreateExercise.nameEx)
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
                const filt = [...list]

                if(success) console.log('Ejercicio creado con exito')
                if(errors) console.log(errors)

                if(stateValue.listOnCreate.length > 0){
                    stateValue.listOnCreate.forEach( item => {
                        const index = filt.findIndex(filt => filt.nameEx === item.nameEx)
                        filt.splice(index,1)
                    })
                }

                setState({...stateValue, searchValue:'', modalCreate:false, modal:true})
                setTimeout(() => {
                    updateList(filt)
                },50)
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