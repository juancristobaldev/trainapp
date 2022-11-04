import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { HiLockClosed } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie/es6";
import { GET_EXERCISES_BY_TOKEN, GET_ROUTINES_FOLDERS_USER_BY_TOKEN, GET_ROUTINE_BY_ID } from "../../data/query";
import { useList } from "../../hooks/useList";
import { useSeries } from "../../hooks/useSeries";
import { CreateExercise } from "../Exercises/CreateExercise";
import { Exercise } from "../Exercises/Exercise";
import { ListExercises } from "../Exercises/ListExercises";
import { Form } from "../Form/Form";
import { Button } from "../generals/Button";
import { Container } from "../generals/Container";
import { Main } from "../generals/Main";
import { Text } from "../generals/Text";
import { InputSerie } from "../InputSerie";
import { List } from "../Lists/List";
import { Modal } from "../Modal/Modal";
import { ModalDelete } from "../Modal/ModalDelete";
import { FormControl } from "../Form/FormControl";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_FOLDER, UPDATE_ROUTINE, UPDATE_USER } from "../../data/mutations";
import { useContext } from "react";
import { DataContext } from "../../context/DataProvider";
import { useDarkMode } from "../../hooks/useDarkMode";

import '../../styles/ListSeries.scss'
import '../../styles/CreateRoutine.scss'
import '../../styles/Modal.scss'

const token = new Cookies().get('session-token')




const ModifyRoutine = ({routine}) => {
    
    const [state,setState] = useState({
        listOnCreate:[],
        dataRoutine:{},
        modal:false,
        modalErrors:{error:false,errors:[]},
        modalCreate:false,
        modalDelete:{boolean:false,items:[]},
        searchValue:'',
        totalData:0,
        errors:{},
        dataFormCreate:{
            id:routine.routine.id,
            name:routine.routine.name,
            exercises:[],
            timeRecord:routine.routine.timeRecord,
            dones:routine.routine.dones
        }
    })

    const [updateRoutine] = useMutation(UPDATE_ROUTINE),
    [updateFolder] = useMutation(UPDATE_FOLDER),
    [updateUser] = useMutation(UPDATE_USER)

    const redirect = useNavigate()

    const { data,loading,error } = useQuery(GET_ROUTINE_BY_ID, {
        variables:{
            id:routine.id
        }
    })

    const {darkMode} = useDarkMode()

    const { folders, me } = useContext(DataContext)

    const {
        deleteItem,
    } = useList ("exercises",{state:state,updateState:setState},true,{ nameGql:"getExercisesByToken",gql:GET_EXERCISES_BY_TOKEN,variables:{ variables:{ token:token } } })

    const {
        addSerie,
        deleteSeries,
        classControl
    } = useSeries({state:state,updateState:setState})


    const getDataRoutine = async (e,name,objEx) => {
        const newData = {...state.dataFormCreate};
        const newList = [...state.listOnCreate]

        if(name !== 'name'){
            const {nameInput,idList,serie} = objEx
            await newList.forEach(item => {
                if(item.idList === idList){
                    const indexSerie = item.seriesEx.findIndex(item => item.idSerie === serie)
                    item.seriesEx[indexSerie][nameInput] = e.target.value;
                }
            })
            newData.exercises = newList
        }else newData[name] = e.target.value
        
        setState({...state, dataFormCreate:newData})
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const objError = {}
        const dataRoutine = {...state.dataFormCreate}

        const {exercises,name} = state.dataFormCreate

        if(exercises.length === 0) objError.exercises = 'Debes agregar al menos un ejercicio.'
        if(name.length === 0) objError.name = 'Debes escribir un nombre para tu rutina.'

        const errorsForm = Object.values(objError)

        if(errorsForm.length === 0){

            folders.forEach( async folder => {
                const content = JSON.parse(folder.content)
                for(var i = 0; i < content.length; i++){
                    if(content[i].id === dataRoutine.id)   {
                        let newContent = [...content]
                        newContent[i] = {...dataRoutine, exercises: JSON.stringify(dataRoutine.exercises)}
                        const variables = {
                            input:{
                                id:folder.id,
                                name:folder.name,
                                content:JSON.stringify(newContent)
                            }
                        }

                        await updateFolder({
                            variables:{...variables}
                        }).then(({data}) => {
                            const {errors,success} = data.updateFolder
                            if(errors.length) console.log(error)
                            else console.log('exito')
                        })
                    } 
                }
            })

            let last_workouts = JSON.parse(me.last_workouts)
            for(var i = 0; i < last_workouts.length; i++){
                if(last_workouts[i].id === state.dataRoutine.id){ 
                    last_workouts[i] = {...dataRoutine}
                    updateUser({
                        variables:{
                            input:{
                                id:me.id,
                                last_workouts:JSON.stringify(last_workouts)
                            }
                        }
                    })
                }
            }

            await updateRoutine({
                variables:{
                    input:{
                        ...dataRoutine,
                        exercises:JSON.stringify(dataRoutine.exercises)
                    }
                }
            }).then( ({data}) => {
                const {error,success} = data.updateRoutine
                if(error) console.log(error)
                if(success){
                    redirect('/')
                    window.location.reload()
                }
            })

        }else{ 
            setState({...state, modalErrors:{error:true,errors:errorsForm}, errors:objError})
        }
    }
    useEffect(() => {
        if(error) console.log(error)
        if(!loading){
            let newListOnCreate = [...JSON.parse(data.getRoutineById[0].exercises)]
            newListOnCreate.forEach(item => {
                item.seriesEx.forEach(serie => {
                    const lastSerie = serie.other ? `${serie.other} Kg / ${serie.reps} Reps` : serie.time ? `${serie.time} Min` : `${serie.reps} Reps`
                    serie["lastMoment"] = lastSerie
                })
            })

            setState(
                {...state, 
                dataRoutine:data.getRoutineById[0], 
                dataFormCreate:{...state.dataFormCreate, exercises:JSON.parse(data.getRoutineById[0].exercises)},
                listOnCreate:newListOnCreate
                }
            )

        }
    },[data])


    return( <>
        <Main className={'section-create-routine'}>
            <Container className={'header-create-routine'}>
                <Text text={'Editar rutina'}/>
                <Button
                className={'cancel-button'}
                    textButton={'Cancelar'}
                    onClick={() => redirect('/')}
                    />
            </Container>
            <Form
            className={'form-create-routine'}
            onSubmit={handleSubmit}
            textSubmit='Actualizar rutina'>
                <FormControl
                error={[state.errors.name]}
                typeControl={'input'}
                className={'input-name-routine'}
                type="text"
                name={'name'}
                placeholder={routine.routine.name}
                onChange={getDataRoutine}
                />
                <Container className={'container-add-exercise'}>
                    <Text text={'Ejercicios:'}/>
                    <Button
                    onClick={() => setState({...state, modal:!state.modal})}
                    textButton='+ Ejercicio'
                    />
                </Container>
                <List
                    errors={[state.errors.exercises]}
                    className={'exercises-list-routine'}
                    item={state.listOnCreate}
                    onEmpty={() => 
                        <Container className={'empty-list-routine'}>
                            <Text text='No has agregado ningun ejercicio'/>
                        </Container>
                    }
                    render={ exercise => (
                        <Exercise 
                        key={exercise.idList}
                        item={exercise}
                        deleteExerciseOfList={deleteItem}
                        >
                            <List
                            className='listSerie'
                            style={{
                                display:"flex",
                                justifyContent:'space-around',
                                flexDirection:"column",
                            }}
                            item={exercise.seriesEx}
                            onEmpty={() => <Text className={'first-serie'} text={'Agrega tu primera serie'}/>}
                            render={ serie => (
                                <Container
                                key={serie.idSerie}
                                className={classControl(exercise.typeEx) + ' serie'}
                                >
                                    <IoMdClose
                                    onClick={() => deleteSeries(serie,exercise)}
                                    />
                                    <Text text={serie.lastMoment} />
                                    <>
                                        {exercise.typeEx === 'Peso adicional' || exercise.typeEx === 'Peso asistido' ?
                                        <React.Fragment>
                                            <InputSerie
                                                className={'input-type'}
                                                style={{width:"35%"}}
                                                name={exercise.name}
                                                idList={exercise.idList}
                                                type="number"
                                                objEx={{nameInput:'other',idList:exercise.idList,serie:serie.idSerie}}
                                                onChange={getDataRoutine}                                        
                                            />
                                            <InputSerie
                                                className={'input-reps'}
                                                style={{width:"35%"}}
                                                name={exercise.name}
                                                objEx={{nameInput:'reps',idList:exercise.idList,serie:serie.idSerie}}
                                                onChange={getDataRoutine}
                                                type="number"
                                            />
                                        </React.Fragment>
                                        :
                                        exercise.typeEx === 'Duracion' ?
                                            <InputSerie
                                            className={'input-duracion'}
                                            className='inputSerie'
                                            name={exercise.name}
                                            idList={exercise.idList}
                                            objEx={{nameInput:'time',idList:exercise.idList,serie:serie.idSerie}}
                                            onChange={getDataRoutine}
                                            style={{width:"50%"}}
                                            type="time"
                                            />
                                        :
                                            <InputSerie
                                            className={'input-reps'}
                                            className='inputSerie'
                                            name={exercise.name}
                                            idList={exercise.idList}
                                            objEx={{nameInput:'reps',idList:exercise.idList,serie:serie.idSerie}}
                                            onChange={getDataRoutine}
                                            style={{width:"35%"}}
                                            type="number"
                                            />
                                        }
                                        <Container className={'lock'}>
                                            <HiLockClosed/>
                                        </Container>
                                    </>
                                </Container>
                            )}
                            >
                                <Container
                                className={'container-add-serie'}
                                >
                                    <Button 
                                    onClick={(e) => addSerie(e,exercise.idList)}
                                    textButton={'+ Serie'}
                                    />
                                </Container>
                            </List>
                    </Exercise>                 
                    )}
                />
                </Form>
        </Main>
        <Modal>
            {state.modal && 
            <>
                <ListExercises
                    token={token}
                    objectState={{state:state,setState:setState}}
                />
                <Container
                onClick={() => setState({...state, modal:false})}
                className={'back'}/>
            </>
            }
            {state.modalCreate &&
            <>
                <CreateExercise
                token={token}
                objectState={{state:state,setState:setState}}
                />
                <Container className={'back'}
                onClick={() => setState({...state, modalCreate:false})}
                />
            </>
            }
            {state.modalDelete.boolean &&
                <Modal>
                    <ModalDelete
                    exercise={true}
                    token={token}
                    objectState={{state:state,setState:setState}}
                    />
                    <Container className={'back'}
                    />
             </Modal>
            }
            
        </Modal>
    </>
    )
}

export {ModifyRoutine}