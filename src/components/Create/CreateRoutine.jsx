import React, { useEffect, useState } from "react";
import { Container } from "../generals/Container";
import { useNavigate } from "react-router-dom";
import { Main } from "../generals/Main";
import { Form } from "../Form/Form";
import { Text } from "../generals/Text";
import { Modal } from "../Modal/Modal";
import { List } from "../Lists/List";
import { FormControl } from "../Form/FormControl";
import { getErrorsForm } from "../functions/getFormsError";
import { Exercise } from "../Exercise";
import { Button } from "../generals/Button";
import { useListExercises } from "../../hooks/useListExercises";
import { useExercises } from "../../hooks/useExercises";
import { useSeries } from "../../hooks/useSeries";
import { IoMdClose } from "react-icons/io";
import { GrClose } from "react-icons/gr";
import { Serie } from "../Serie";
import {HiLockClosed} from "react-icons/hi"

import '../../styles/ListSeries.scss'
import '../../styles/CreateRoutine.scss'
import '../../styles/Modal.scss'

import Cookies from "universal-cookie/es6";
import { InputSerie } from "../InputSerie";
import { useMutation } from "@apollo/client";
import { CREATE_ROUTINE } from "../../data/mutations";
import { GET_ROUTINES_AND_USER_BY_TOKEN } from "../../data/query";
import { ListExercises } from "../Lists/ListExercises";
import { CreateExercise } from "./CreateExercise";
import { ModalDelete } from "../Modal/ModalDelete";

const token = new Cookies().get('session-token')

const CreateRoutine =  ( ) => {

    const [createRoutine] = useMutation(CREATE_ROUTINE)

    const [state,setState] = useState({
        listOnCreate:[],
        modal:false,
        modalErrors:{error:false,errors:[]},
        modalCreate:false,
        modalDelete:{boolean:false,items:[]},
        searchValue:'',
        totalData:0,
        errors:{},
        dataFormCreate:{
            token:token,
            nameRoutine:'',
            exercises:[],
            timeRecord:'indefinido',
            dones:0
        }
    })

    console.log(state.dataFormCreate)

    const redirect = useNavigate()

    const {
        deleteExerciseOfList,
    } = useListExercises (token,{state:state,updateState:setState},state.listOnCreate)

    const {
        addSerie,
        deleteSeries,
        classControl
    } = useSeries({state:state,updateState:setState})


    const getDataRoutine = async (e,name,objEx) => {
        const newData = {...state.dataFormCreate};
        const newList = [...state.listOnCreate]

        if(name !== 'nameRoutine'){
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


    const handleSubmit = async (e,confirmation) => {
        e.preventDefault();
        const objError = {}

        const {exercises,nameRoutine} = state.dataFormCreate

       if(exercises.length === 0) objError.exercises = 'Debes agregar al menos un ejercicio.'
       if(nameRoutine.length === 0) objError.nameRoutine = 'Debes escribir un nombre para tu rutina.'

       const errorsForm = Object.values(objError)

        if(errorsForm.length === 0){

            const inputVariables = {...state.dataFormCreate, exercises:JSON.stringify(state.dataFormCreate.exercises)}
            
            await createRoutine({
                variables:{
                    input:{
                        ...inputVariables
                    }
                },
                refetchQueries:[{query:GET_ROUTINES_AND_USER_BY_TOKEN,variables:{
                    token:token
                }}]
            }).then( ({data}) => {
                const { errors, success } = data.createRoutine
                if(errors) console.log(errors)
                if(success) console.log('Rutina creada con exito')
            })

            redirect('/')

        }else{ 
            setState({...state, modalErrors:{error:true,errors:errorsForm}, errors:objError})
        }
    }
    useEffect(() => {
        setState({...state, modalErrors:{error:false,errors:{}},errors:{}})
    },[state.dataFormCreate,state.listOnCreate,state.modal,state.modalCreate])

    return(
        <>
        <Container className={'header-create-routine'}>
            <Text text={'Estas creando una rutina:'}/>
            <Container className={'close-button'}>
                <IoMdClose
                onClick={() => redirect('/')}
                />
            </Container>
        </Container>
        <Main className={'main-create-routine'}>
            <Form
            className={'form-create-routine'}
            onSubmit={handleSubmit}
            textSubmit='Crear rutina'>
                <FormControl
                error={[state.errors.nameRoutine]}
                typeControl={'input'}
                className={'input-name-routine'}
                type="text"
                name={'nameRoutine'}
                placeholder="Nombre de la rutina"
                onChange={getDataRoutine}
                />
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
                        deleteExerciseOfList={deleteExerciseOfList}
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
                                    <Text text='-' />
                                    <>
                                        {exercise.typeEx === 'Peso adicional' || exercise.typeEx === 'Peso asistido' ?
                                        <React.Fragment>
                                            <InputSerie
                                                className={'input-type'}
                                                style={{width:"35%"}}
                                                name={exercise.nameEx}
                                                idList={exercise.idList}
                                                type="number"
                                                objEx={{nameInput:'other',idList:exercise.idList,serie:serie.idSerie}}
                                                onChange={getDataRoutine}                                        
                                            />
                                            <InputSerie
                                                className={'input-reps'}
                                                style={{width:"35%"}}
                                                name={exercise.nameEx}
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
                                            name={exercise.nameEx}
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
                                            name={exercise.nameEx}
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
                <Container className={'container-add-new-exercise'}>
                    <Button
                    onClick={() => setState({...state, modal:!state.modal})}
                    textButton='Agregar un ejercicio'
                    />
                </Container>
                <footer>
                    <p className="p-doit">
                        <span>Do</span>It
                    </p>
                </footer>
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

export {CreateRoutine}