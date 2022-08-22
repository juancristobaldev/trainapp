import { useQuery } from "@apollo/client";
import React from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { GET_ROUTINE_BY_ID } from "../data/query";
import { Main } from "./generals/Main";
import { Text } from "./generals/Text";
import { Loading } from "./Loading";
import '../styles/Loading.scss'
import Cookies from "universal-cookie/es6";
import { useEffect } from "react";
import { Container } from "./generals/Container";
import { FormControl, List } from "@mui/material";
import { ListApi } from "./Lists/ListApi";
import { Button } from "./generals/Button";
import CheckBox from "./Checkbox";
import { InputSerie } from "./InputSerie";
import { Exercise } from "./Exercise";
import { IoMdClose } from "react-icons/io";
import { useListExercises } from "../hooks/useListExercises";
import { useExercises } from "../hooks/useExercises";
import { useSeries } from "../hooks/useSeries";
import { Create } from "./Create/Create";
import { Form } from "./Form/Form";
import { Serie } from "./Serie";
import { Modal } from "./Modal/Modal";
import { Options } from "./Form/Options";

const token = new Cookies().get('session-token')

const GoRoutine = ({routine}) => {
    const [state,updateState] = useState({
        dataRoutine:false,
        listOnPlay:[],
        modal:false,
        modalErrors:{error:false,errors:[]},
        modalCreate:false,
        searchValue:'',
        routineOnPlay:{
            token:token,
            nameRoutine:routine.nameRoutine,
            exercises:[],
            timeRecord:routine.timeRecord,
            dones:routine.dones + 1
        }
    })

    const {
        listExercisesSelect,
        deleteExerciseOfList,
        setListExercisesSelect,
        selectOfTheList,
        addExerciseToList,
    } = useListExercises (token,{state:state,updateState:updateState})

    const {
        errors,
        handleChange,
        createNewExercise,
        deleteSomeExercise,
        modalDelete,
        setModalDelete,
    } = useExercises(token,{list:listExercisesSelect,updateList:setListExercisesSelect},{stateValue:state,setState:updateState})

    const {
        addSerie,
        deleteSeries,
        classControl
    } = useSeries({state:state,updateState:updateState})

    const { data,loading,error } = useQuery(GET_ROUTINE_BY_ID, {
        variables:{
            id:routine.id
        }
    })

    const getDataRoutine = async (e,name,objEx) => {

        const newData = {...state.routineOnPlay};
        const newList = [...state.listOnPlay]

        const {nameInput,serie} = objEx
        await newList.forEach(item => {
            if(item.nameEx === name){
                const indexSerie = item.seriesEx.findIndex(item => item.idSerie === serie)
                item.seriesEx[indexSerie][nameInput] = e.target.value;
            }
        })
        newData.exercises = newList

        updateState({...state, routineOnPlay:newData})
    }

    const totalSelectItem = listExercisesSelect.filter(item => item.select === true).length

    useEffect(() => {
        if(error) console.log(error)
        if(!loading){
            updateState(
                {...state, 
                dataRoutine:data.getRoutineById[0], 
                routineOnPlay:{...state.routineOnPlay, exercises:JSON.parse(data.getRoutineById[0].exercises)}
                }
            )

        }
    },[data])

    if(routine.active){
        return(
            <Main
            className={'main-goroutine'}
            >
            {loading ? <Loading/> : 
            <>
                <Container>
                    <p>Temporizador</p>
                </Container>
                <Container>
                    <h2>{state.dataRoutine.nameRoutine}</h2>
                    <Text
                    text={`Mejor tiempo 🎉: ${state.dataRoutine.timeRecord}`}
                    />
                    <Text
                    text={`Tiempo actual ⏱️: ${state.dataRoutine.timeRecord}`}
                    />
                </Container>
                <ListApi
                error={error}
                loading={loading}
                data={state.routineOnPlay.exercises}
                onError={() => <p>Hay un error</p>}
                onLoading={() => <p>Cargando...</p>}
                onEmpty={() => <p>Agrega tu primer ejercicio</p>}
                render={exercise => 
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
                                            <CheckBox/>
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
                }
                />
                <Container>
                    <Button/>
                    <Button/>
                </Container>
            </>
            }
            {state.modal && 
                    <Modal>
                        <Container className={'back'}
                        onClick={() => updateState({...state, modal: false})}
                        />
                        <Container className={'modal-exercises'}>
                            <Container className={'modal-exercises-header'}>
                                <Text text={'Lista de ejercicios'}/>
                                <Button
                                    onClick={() => updateState({...state, modal:false})}
                                    textButton="Cancelar"
                                />
                            </Container>
                            <Container className={'modal-exercises-search'}>
                                <input onChange={e => updateState({...state, searchValue:e.target.value})} type={'text'} placeholder='Buscar ejercicios'/>
                            </Container>
                            <ListApi 

                                className={'modal-exercises-list'}
                                error={error}
                                loading={loading}
                                data={listExercisesSelect}
                                total={listExercisesSelect.length}
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
                                        updateState({...state, modal:false})
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
                                    updateState(
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
                    onClick={() => updateState({...state, modalCreate: false})}
                    >
                    </Container>
                        <Create
                        className={'modal-create-exercise'}
                        >
                            <Container className={'header-create'}>
                                <Text text='Estas creando un ejercicio:'/>
                                <Button
                                onClick={() => updateState({ ...state, modalCreate:false, modal:true})}
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
    }else if( !routine.active || !token ) return (
        <Navigate to={'/'}/>
    )
}

export { GoRoutine }