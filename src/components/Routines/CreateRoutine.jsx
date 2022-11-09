import React, { useEffect, useState } from "react";
import { Container } from "../generals/Container";
import { useNavigate } from "react-router-dom";
import { Main } from "../generals/Main";
import { Form } from "../Form/Form";
import { Text } from "../generals/Text";
import { Modal } from "../Modal/Modal";
import { List } from "../Lists/List";
import { FormControl } from "../Form/FormControl";
import { Exercise } from "../Exercises/Exercise";
import { Button } from "../generals/Button";
import { useSeries } from "../../hooks/useSeries";
import { IoMdClose } from "react-icons/io";
import {HiLockClosed} from "react-icons/hi"

import '../../styles/ListSeries.scss'
import '../../styles/CreateRoutine.scss'
import "../../styles/responsive/CreateRoutine.scss"
import '../../styles/Modal.scss'

import Cookies from "universal-cookie/es6";
import { InputSerie } from "../InputSerie";
import { useMutation } from "@apollo/client";
import { CREATE_ROUTINE } from "../../data/mutations";
import { GET_EXERCISES_BY_TOKEN, GET_ROUTINES_AND_USER_BY_TOKEN } from "../../data/query";
import { ListExercises } from "../Exercises/ListExercises";
import { CreateExercise } from "../Exercises/CreateExercise";
import { ModalDelete } from "../Modal/ModalDelete";
import { useList } from "../../hooks/useList";
import { useWidthScreen } from "../../hooks/useWidthScreen";
import { Section } from "../generals/Section";
import { useDarkMode } from "../../hooks/useDarkMode";
import { ModalAreUSure } from "../Modal/ModalAreUSure";
import { useExercises } from "../../hooks/useExercises";

const token = new Cookies().get('session-token')

const CreateRoutine =  () => {

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
            name:'',
            exercises:[],
            timeRecord:'indefinido',
            dones:0
        }
    })

    const redirect = useNavigate()

    const { widthScreen } = useWidthScreen()

    const {
        listForSelect,
        updateListForSelect,
        deleteItem,
    } = useList ("exercises",{state:state,updateState:setState},true,{ nameGql:"getExercisesByToken",gql:GET_EXERCISES_BY_TOKEN,variables:{ variables:{ token:token } } })

    const {
        darkMode
    } = useDarkMode()

    const {
        deleteSomeExercise
    } = useExercises(token,{list:listForSelect,updateList:updateListForSelect},{stateValue:state,setState:setState})


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

        const {exercises,name} = state.dataFormCreate

        if(exercises.length === 0) objError.exercises = 'Debes agregar al menos un ejercicio.'
        if(name.length === 0) objError.name = 'Debes escribir un nombre para tu rutina.'

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
        <Section className={`grid ${widthScreen > 650 && "web"} ${darkMode && "darkMode"}`}>
        <Section className={`section-create-routine ${widthScreen > 650 && "web"}`}>
            <Container className={'header-create-routine'}>
                <Text text={'Rutina nueva.'}/>
                <Button
                className={'cancel-button'}
                    textButton={'Cancelar'}
                    onClick={() => redirect('/')}
                    />
            </Container>
            <Form
            className={'form-create-routine'}
            onSubmit={handleSubmit}
            textSubmit='Crear rutina'>
                <FormControl
                error={[state.errors.name]}
                typeControl={'input'}
                className={'input-name-routine'}
                label={'Ingresa un nombre para tu rutina:'}
                type="text"
                name={'name'}
                placeholder="Nombre de la rutina"
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
                    className={`exercises-list-routine ${darkMode && 'darkMode'}`}
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
                                    <Container className={'delete-serie'}>
                                        <IoMdClose
                                        onClick={() => deleteSeries(serie,exercise)}
                                        />
                                    </Container>
                                    <Text text='-' />
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
                                {
                                widthScreen < 650 &&
                                <Container
                                className={'container-add-serie'}
                                >
                                    <Button 
                                    onClick={(e) => addSerie(e,exercise.idList)}
                                    textButton={'+ Serie'}
                                    />
                                </Container>
                                }
                            </List>
                            {
                                widthScreen > 650 &&
                                <Container
                                className={'container-add-serie'}
                                >
                                    <Button 
                                    onClick={(e) => addSerie(e,exercise.idList)}
                                    textButton={'+ Serie'}
                                    />
                                </Container>
                            }
                    </Exercise>              
                    )}
                />
                </Form>
        </Section>
        <Modal>
            {(state.modal) && 
            <>
                <ListExercises
                    token={token}
                    objectState={{state:state,setState:setState}}
                />
                <Container
                onClick={() => setState({...state, modal:false})}
                className={`back ${darkMode && 'darkMode'}`}/>
            </>
            }
            {state.modalCreate &&
            <>
                <CreateExercise
                token={token}
                objectState={{state:state,setState:setState}}
                />
                <Container className={`back ${darkMode && 'darkMode'}`}
                onClick={() => setState({...state, modalCreate:false})}
                />
            </>
            }
            {state.modalDelete.boolean &&
                <Modal>
                    <ModalAreUSure
                    text={'¿Estas seguro que deseas eliminar estos ejercicios?'}
                    acceptFunction={() => deleteSomeExercise(true,state.modalDelete.items)}
                    cancelFunction={() => setState({...state, modal: true, modalDelete:{
                        boolean:false,
                        items:true
                    }})}
                    />
                    <Container className={`back ${darkMode && 'darkMode'}`}
                    onClick={() => setState({...state, modalDelete:{boolean:false}})}
                    />
             </Modal>
            }
            
        </Modal>
    </Section>
    )
}

export {CreateRoutine}