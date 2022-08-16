import React, { useEffect, useState } from "react";
import { getErrorsForm } from "../components/functions/getFormsError";
import { CREATE_EXERCISE, DELETE_EXERCISE } from "../data/mutations";
import { useMutation } from "@apollo/client";
import { GET_EXERCISES_BY_TOKEN } from "../data/query";

const useExercises = (token,objectList,state) => {

    const [ dataFormCreateExercise, setDataFormCreateExercise ] = useState(
        {
            token:token,
            nameEx:'',
            typeEx:'Peso adicional',
            muscleEx:'Espalda',
            seriesEx:JSON.stringify([])
        }
    )

    const [modalDelete,setModalDelete] = useState({
        boolean:false,
        items:[]
    })

    const [errors,setErrors] = useState({error:false,errors:[]})

    const [createExercise] = useMutation(CREATE_EXERCISE)
    const [deleteExercise] = useMutation(DELETE_EXERCISE)

    const deleteSomeExercise = async (confirmation) => {

        const {list,updateList} = objectList;

        const filter = list.filter(item => item.select === true)
        if(filter.length > 0){
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

    const createNewExercise = async (e) => {
        e.preventDefault();
        const {list,updateList} = objectList;
        const {stateValue,setState} = state

        const arrayFusion = [...list, ...stateValue.listOnCreate]
        const searchError = [
            {property:dataFormCreateExercise.nameEx, error:'Debes escribir un nombre para tu ejercicio'}
        ]
        const { errorsForm } = getErrorsForm(searchError)
        const index = arrayFusion.findIndex(item => item.nameEx === dataFormCreateExercise.nameEx)

        if(index >= 0) errorsForm.push('Este ejercicio ya existe en tu lista');
        if(errorsForm.length){
            setErrors({error:true,errors:errorsForm})
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
        createNewExercise,
        deleteSomeExercise,
        handleChange,
        errors,
        setErrors,
        modalDelete,setModalDelete
    }
}

export {useExercises}