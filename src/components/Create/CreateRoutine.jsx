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
import { Create } from "./Create";
import { Options } from "../Form/Options";
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
import { ListApi } from "../Lists/ListApi";
import { useMutation } from "@apollo/client";
import { CREATE_ROUTINE } from "../../data/mutations";
import { GET_ROUTINES_AND_USER_BY_TOKEN } from "../../data/query";
import CheckBox from "../Checkbox";

const token = new Cookies().get('session-token')

const CreateRoutine =  ( ) => {

    const [createRoutine] = useMutation(CREATE_ROUTINE)

    const [state,setState] = useState({
        listOnCreate:[],
        modal:false,
        modalErrors:{error:false,errors:[]},
        modalCreate:false,
        searchValue:'',
        totalData:0,
        dataFormCreate:{
            token:token,
            nameRoutine:'',
            exercises:[],
            timeRecord:'00:00',
            dones:0
        }
    })

    console.log(state.modalErrors)

    const redirect = useNavigate()

    const {
        error,
        loading,
        listExercisesSelect,
        deleteExerciseOfList,
        setListExercisesSelect,
        selectOfTheList,
        addExerciseToList,
    } = useListExercises (token,{state:state,updateState:setState})

    const {
        errors,
        handleChange,
        createNewExercise,
        deleteSomeExercise,
        modalDelete,
        setModalDelete,
    } = useExercises(token,{list:listExercisesSelect,updateList:setListExercisesSelect},{stateValue:state,setState:setState})

    const {
        addSerie,
        deleteSeries,
        classControl
    } = useSeries({state:state,updateState:setState})


    const getDataRoutine = async (e,name,objEx) => {

        const newData = {...state.dataFormCreate};
        const newList = [...state.listOnCreate]

        if(name !== 'nameRoutine'){
            const {nameInput,serie} = objEx
            await newList.forEach(item => {
                if(item.nameEx === name){
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

        const {exercises,nameRoutine} = state.dataFormCreate

        const posiblyErrors = [
            {property:exercises,error:'Debes agregar al menos un ejercicio'},
            {property:nameRoutine,error:'Debes escribir un nombre para la rutina'}
        ]

        const {errorsForm} = getErrorsForm(posiblyErrors)

        if(errorsForm.length === 0){

            const inputVariables = {...state.dataFormCreate, exercises:JSON.stringify(state.dataFormCreate.exercises)}
            console.log(inputVariables)

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
            setState({...state, modalErrors:{error:true,errors:errorsForm}})
        }
    }

    const totalSelectItem = listExercisesSelect.filter(item => item.select === true).length

    useEffect(() => {
        setState({...state, modalErrors:{error:false,errors:[]}})
    },[state.dataFormCreate,state.listOnCreate,state.modal,state.modalCreate])

    return(
        <Main className={'main-create-routine'}>
            <Container className={'header-create-routine'}>
                <Text text={'Estas creando una rutina:'}/>
                <GrClose
                cursor={'pointer'}
                onClick={() => redirect('/')}
                />
            </Container>
            <Form
            className={'form-create-routine'}
            onSubmit={handleSubmit}
            textSubmit='Crear rutina'>
                <FormControl
                typeControl={'input'}
                className={'input-name-routine'}
                type="text"
                name={'nameRoutine'}
                placeholder="Nombre de la rutina"
                onChange={getDataRoutine}
                />
                <List
                    className={'exercises-list-routine'}
                    item={state.listOnCreate}
                    onEmpty={() => 
                        <Container className={'empty-list-routine'}>
                            <Text text='No has agregado ningun ejercicio'/>
                        </Container>
                    }
                    render={ exercise => (
                        <Exercise 
                        key={exercise.nameEx}
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
                                    <Serie>
                                        {exercise.typeEx === 'Peso adicional' || exercise.typeEx === 'Peso asistido' ?
                                        <React.Fragment>
                                            <InputSerie
                                                className={'input-type'}
                                                style={{width:"35%"}}
                                                name={exercise.nameEx}
                                                type="number"
                                                objEx={{nameInput:'other',serie:serie.idSerie}}
                                                onChange={getDataRoutine}                                        
                                            />
                                            <InputSerie
                                                className={'input-reps'}
                                                style={{width:"35%"}}
                                                name={exercise.nameEx}
                                                objEx={{nameInput:'reps',serie:serie.idSerie}}
                                                onChange={getDataRoutine}
                                                type="number"
                                            />
                                        </React.Fragment>
                                        :
                                        exercise.typeEx === 'Duracion' ?
                                            <InputSerie
                                            className={'input-duracion'}
                                            className='inputSerie'
                                            objEx={{nameInput:exercise.nameEx,serie:serie.idSerie}}
                                            onChange={getDataRoutine}
                                            style={{width:"50%"}}
                                            type="time"
                                            />
                                        :
                                            <InputSerie
                                            className={'input-reps'}
                                            className='inputSerie'
                                            objEx={{nameInput:exercise.nameEx,serie:serie.idSerie}}
                                            onChange={getDataRoutine}
                                            style={{width:"35%"}}
                                            type="number"
                                            />
                                        }
                                        <Container className={'lock'}>
                                            <HiLockClosed/>
                                        </Container>
                                    </Serie>
                                </Container>
                            )}
                            >
                                <Container
                                className={'container-add-serie'}
                                >
                                    <Button 
                                    onClick={(e) => addSerie(e,exercise.nameEx)}
                                    textButton={'+ Serie'}
                                    />
                                </Container>
                            </List>
                    </Exercise>                 
                    )}
                />
                {state.modalErrors.error  === true && 
                    <Container className={'create-errors'}>
                        {
                            state.modalErrors.errors.map(item => 
                                <p 
                                key={item}
                                style={{color:'red'}}>*{item}</p>   
                            )
                        }
                    </Container>
                }
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
                {state.modal && 
                    <Modal>
                        <Container className={'back'}
                        onClick={() => setState({...state, modal: false})}
                        />
                        <Container className={'modal-exercises'}>
                            <Container className={'modal-exercises-header'}>
                                <Text text={'Lista de ejercicios'}/>
                                <Button
                                    onClick={() => setState({...state, modal:false})}
                                    textButton="Cancelar"
                                />
                            </Container>
                            <Container className={'modal-exercises-search'}>
                                <input onChange={e => setState({...state, searchValue:e.target.value})} type={'text'} placeholder='Buscar ejercicios'/>
                            </Container>
                            <ListApi 

                                className={'modal-exercises-list'}
                                error={error}
                                loading={loading}
                                data={listExercisesSelect}
                                total={listExercisesSelect.length}
                                onEmptySearch = {() => 
                                    <Container className={'search-empty-container'}>
                                        <Text text={`No se encuentra ningun resultado con "${state.searchValue}"`}/>
                                    </Container>
                                }
                                onError={() => 
                                    <Container className={'error-container'}>
                                        <Text 
                                        text={`Ooops, hay un error...`}/>
                                    </Container>
                                }
                                onLoading={() => <Text text={'Cargando ejercicios'}/>}
                                onEmpty={() => 
                                    <Container className={'empty-container'}>
                                        <Text 
                                        text={`Tu lista de ejercicios esta vacia`}/>
                                    </Container>
                                }
                                render={exercise => (
                                    <Container 
                                    key={exercise.nameEx}
                                    className={`exercise-container ${exercise.select ?'onSelect' : 'offSelect' }`}
                                    onClick={() => selectOfTheList(exercise.nameEx)}
                                    >
                                        <Text
                                        text={exercise.nameEx}
                                        key={exercise.nameEx}
                                        />
                                        <CheckBox
                                        select={exercise.select}
                                        />
                                    </Container>
                                )}
                            />
                            <Container className={'modal-exercises-actions'}>
                            {
                                totalSelectItem > 0 &&
                                <>
                                    <Button
                                    className={'button-delete'}
                                    textButton={`Eliminar (${totalSelectItem})`}
                                    onClick={() => {
                                        setState({...state, modal:false})
                                        deleteSomeExercise(false)
                                    }}
                                    />
                                    <Button 
                                    className={'button-add'}
                                    textButton={`Agregar (${totalSelectItem})`}
                                    onClick={ () => addExerciseToList() }
                                    />       
                                </>                    
                                }
                            </Container>
                            <Container
                            className={'modal-exercises-create'}
                            >
                                <Button
                                textButton={'Crear ejercicio'}
                                onClick={ () => {
                                    setState(
                                        {
                                            ...state,
                                            modalCreate:!state.modalCreate,
                                            modal:false
                                        }
                                    )
                                } }
                                />
                            </Container>
                        </Container>
                    </Modal>
            }
            { state.modalCreate &&
                <Modal>
                    <Container className={"back create"}
                    onClick={() => setState({...state, modalCreate: false})}
                    >
                    </Container>
                        <Create
                        className={'modal-create-exercise'}
                        >
                            <Container className={'header-create'}>
                                <Text text='Estas creando un ejercicio:'/>
                                <Button
                                onClick={() => setState({ ...state, modalCreate:false, modal:true})}
                                textButton={'Cerrar'}
                                />
                            </Container>
                            <Form
                            className={'form-create'}
                            onSubmit={createNewExercise}
                            textSubmit="Crear"
                            >
                                <Container className={'errors'}>
                                    {
                                        errors.error && 
                                        <p
                                        style={{color:"red"}}
                                        >*{errors.errors.map(item => item)}</p>
                                        
                                    }
                                </Container>
                                <FormControl
                                className={'name-input-create'}
                                label="Nombre ejercicio:"
                                typeControl="input"
                                name="nameEx"
                                type="text"
                                onChange={handleChange}
                                />
                                <FormControl
                                className={'muscle-input-create'}
                                label="Musculos implicados:"
                                typeControl="select"
                                name="muscleEx"
                                onChange={handleChange}
                                >
                                    <Options 
                                    arrayOptions={
                                        ['Espalda','Pectoral','Hombro','Abdomen','Biceps','Triceps']
                                    } 
                                    />
                                </FormControl>
                                <FormControl
                                className={'type-input-create'}
                                label="Tipo de ejercicio:"
                                typeControl="select"
                                name="typeEx"
                                onChange={handleChange}
                                >
                                    <Options 
                                    arrayOptions={
                                        ['Peso adicional','Peso asistido','Duracion','Solo rep']
                                    }
                                    />
                                </FormControl>
                            </Form>
                        </Create>
                </Modal>  
            }
            {
            modalDelete.boolean === true && 
            <Modal>
                <Container className={'back delete'}
                onClick={() => setModalDelete({...modalDelete,boolean: false})}
                />
                <Container className={'modal-delete'}>
                    <Container
                    className={'container-text'}
                    >
                        <Text text={'¿Estas seguro que deseas eliminar los siguientes ejercicios?'}/>
                    </Container>
                    <Container className={'list-exercises-delete'}>
                        {modalDelete.items.map(item =>
                            <Text 
                            key={item.nameEx}
                            text={item.nameEx} 
                            style={{ color:'red'}}
                            />
                        )}
                    </Container>
                    <Container className={'container-buttons'}>
                        <Button 
                        className={'cancel'}
                        textButton={'Cancelar'}
                        onClick={() => setModalDelete({
                            boolean:false,
                            items:true
                        })}
                        />
                        <Button 
                        className={'accept'}
                        textButton='Aceptar'
                        onClick={() => deleteSomeExercise(true,modalDelete.items)}/>
                    </Container>
                </Container>
            </Modal>
            }
        </Main>
    )
}

export {CreateRoutine}