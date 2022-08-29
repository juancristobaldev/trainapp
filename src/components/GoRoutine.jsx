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
import {BsClockHistory} from "react-icons/bs"
import { List } from "./Lists/List";
import { ListApi } from "./Lists/ListApi";
import { Button } from "./generals/Button";
import CheckBox from "./Checkbox";
import { InputSerie } from "./InputSerie";
import { Exercise } from "./Exercise";
import { IoMdClose } from "react-icons/io";
import { useListExercises } from "../hooks/useListExercises";
import { useSeries } from "../hooks/useSeries";
import { Form } from "./Form/Form";
import { Serie } from "./Serie";
import { Modal } from "./Modal/Modal";
import {MdOutlineKeyboardReturn} from "react-icons/md"
import { GrClose } from "react-icons/gr";

import '../styles/Exercises.scss'
import '../styles/Timer.scss'
import '../styles/GoRoutine.scss'

import { ProgressiveCount } from "./Counts/ProgressiveCount";
import { Timer } from "./MenuTimer/Timer";
import { ListExercises } from "./Lists/ListExercises";
import { CreateExercise } from "./Create/CreateExercise";
import { ModalDelete } from "./Modal/ModalDelete";
import { Create } from "./Create/Create";

const token = new Cookies().get('session-token')

const GoRoutine = ({routine}) => {
    const [state,updateState] = useState({
        dataRoutine:false,
        listOnCreate:[],
        modal:false,
        modalErrors:{error:false,errors:[]},
        modalDelete:{boolean:false,items:[]},
        modalCreate:false,
        searchValue:'',
        timer:{
            secondPlane:false,
            modalTimer:false,
            time:false,
            clock:{
                minutes:'',
                seconds:''
            },
            type:'select',
            listTimers:[]
        },
        routineOnPlay:{
            token:token,
            nameRoutine:routine.nameRoutine,
            exercises:[],
            timeRecord:routine.timeRecord,
            dones:routine.dones + 1
        }
    })

    const timer = JSON.parse(localStorage.getItem('timer'))

    if(!timer) {
        localStorage.setItem('timer', JSON.stringify([]))
        updateState({...state, timer:{...state.timer, listTimers:[]}})
    }

    const {
        deleteExerciseOfList,
    } = useListExercises (token,{state:state,updateState:updateState})

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
        const newList = [...state.listOnCreate]

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

    const getDataTimer = (event) => {
       const timer = {...state.timer.clock}
       timer[event.target.name] = event.target.value
       updateState({...state, timer:{...state.timer, clock:timer}})
    }

    const setTimer = () => {
        const clock = state.timer.clock,
        errors = [];
        let time = '';
        if(parseInt(clock.minutes) > 60) errors.push('El maximo de minutos es 60.')
        if(parseInt(clock.seconds) > 60) errors.push('El maximo de segundos es 60.')
        if(!clock.minutes || !clock.seconds) errors.push('Mintos y segundos obligatorios') 
        if(errors.length === 0) {
            const newList = [...JSON.parse(localStorage.getItem('timer'))]
            console.log(newList)
            time = `${clock.minutes <= 9  ? `0${clock.minutes}` : `${clock.minutes}`}:${clock.seconds <= 9  ? `0${clock.seconds}` : `${clock.seconds}`}`
            if(newList.length < 3){
                newList.unshift(time)
            }else{
                newList.pop()
                newList.unshift(time)
            }
            console.log(newList)
            localStorage.setItem('timer',JSON.stringify([...newList]))
            updateState({...state, timer:{...state.timer, clock:{}, type:'select'}})
        }
        
    }


    useEffect(() => {
        if(error) console.log(error)
        if(!loading){
            updateState(
                {...state, 
                dataRoutine:data.getRoutineById[0], 
                routineOnPlay:{...state.routineOnPlay, exercises:JSON.parse(data.getRoutineById[0].exercises)},
                listOnCreate:[...JSON.parse(data.getRoutineById[0].exercises)]
                }
            )

        }
    },[data])

    if(routine.active){
        return(
        <>
        { state.timer.modalTimer &&
            <>
            <Container className={'back'} 
            onClick={
            state.timer.time === false ? 
            () => updateState({...state, timer:{...state.timer,modalTimer:false,type:'select',time:''}}) 
            : 
            () => updateState({...state, timer:{...state.timer, secondPlane: !state.timer.secondPlane}})}
            style={state.timer.secondPlane ? {display:"none"} : {display:"block"}} 
            />
            {
                !state.timer.time ?
                <>
                {
                    state.timer.type === 'select' ?
                    <Container className={`modal-timer ${state.timer.secondPlane ? "second-plane" : "undefined"}`}>
                        <Container className={'header-timer'}>
                            <Text text="Temporizador"/>
                            <GrClose
                            cursor={'pointer'}
                            onClick={
                                state.timer.time === false ? 
                                () => updateState({...state, timer:{...state.timer,modalTimer:false,time:''}}) 
                                : 
                                () => updateState({...state, timer:{...state.timer, secondPlane: !state.timer.secondPlane}})}
                                style={state.timer.secondPlane ? {display:"none"} : {display:"block"}} 
                                />
                        </Container>
                        <List
                        className={'list-timer-select'}
                        item={timer}
                        onEmpty={() => <Text text={'No has creado ningun temporizador'}/>}
                        render={timer => 
                            <Container className={'container-timer'}>
                                <Text
                                style={{cursor:"pointer"}}
                                key={timer}
                                text={timer}
                                onClick={() => updateState({...state, timer:{...state.timer, time:timer}})}
                                />
                            </Container>
                        }
                        />
                        <Container
                        className={'buttons-timer-select'}
                        >
                            <Button
                            textButton={'Crear temporizador'}
                            onClick={() => updateState({...state,timer:{...state.timer, type:'create' }}) }
                            />
                        </Container>
                    </Container> 
                    :
                    <Create className={`modal-timer ${state.timer.secondPlane ? "second-plane" : "undefined"}`}>
                        <Container className={'header-timer'}>
                            <Text text="Temporizador"/>
                            <MdOutlineKeyboardReturn
                            onClick={() => updateState({...state,timer:{...state.timer, type:'select'}})}
                            cursor={'pointer'}
                            />
                        </Container>
                        <Container className={'create-timer'}>
                            <Container className={'minutes'}>
                                <Text text={'Minutos'}/>
                                <input
                                onChange={event => getDataTimer(event)}
                                name={'minutes'}
                                type={'number'}
                                min={0}
                                max={60}
                                />
                            </Container>
                            <Container className={'separator'}>
                                <Text text={':'}/>
                            </Container>
                            <Container className={'seconds'}>
                                <Text text={'Segundos'}/>
                                <input
                                onChange={event => getDataTimer(event)}
                                name={'seconds'}
                                type={'number'}
                                min={0}
                                max={60}
                                />
                            </Container>
                        </Container>
                        <Container
                        className={'buttons-timer-select'}
                        >
                            <Button
                            onClick={() => setTimer()}
                            textButton={'Crear temporizador'}
                            />
                        </Container>
                    </Create>
                }
                </>
                :
                <>
                <Container className={`modal-timer ${state.timer.secondPlane ? "second-plane" : "undefined"}`}>
                    <Container
                    className={'header-timer'}
                    >
                        <Text text={'Temporizador'}/>
                        <MdOutlineKeyboardReturn
                            cursor={'pointer'}
                            onClick={() => updateState({...state,timer:{...state.timer, type:'select', time:''}})}
                            />
                    </Container>
                    <Timer
                        time={state.timer.time}
                    />
                    <Container
                    style={{
                        width:"90%",
                        height:"70%",
                        placeSelf:'center'
                    }}
                    className={'buttons-timer-select'}>
                        <Button
                        textButton={'Aceptar'}
                        />
                    </Container>
                </Container>
                </>
            }
            </>
        }
        <Container className={'header-goroutine'}>
            <span onClick={
                state.timer.time === false ? 
                () => updateState({...state, timer:{...state.timer,modalTimer:!state.timer.modalTimer,time:''}}) 
                : 
                () => updateState({...state, timer:{...state.timer, secondPlane: !state.timer.secondPlane}})}>
                <Text text={'Temporizador'}/>
                <BsClockHistory/>
            </span>
        </Container>
        <Main
        className={'main-goroutine'}
        >
            {loading ? <Loading/> : 
            <>
            <Form
            className={'form-goroutine'}
            textSubmit='Finalizar rutina'
            >
                <Container className={'stats-goroutine'}>
                    <h2>{state.dataRoutine.nameRoutine}</h2>
                    <Text
                    text={`Mejor tiempo 🎉: ${state.dataRoutine.timeRecord}`}
                    />
                    <ProgressiveCount/>
                </Container>
                <ListApi
                className={'exercises-list-routine'}
                error={error}
                loading={loading}
                data={state.listOnCreate}
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
                                    <Text text={serie.other ? `${serie.other} Kg / ${serie.reps} Reps` : serie.time ? `${serie.time} Min` : `${serie.reps} Reps`} />
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
                                            className='inputSerie'
                                            name={exercise.nameEx}
                                            objEx={{nameInput:'time',serie:serie.idSerie}}
                                            onChange={getDataRoutine}
                                            style={{width:"50%"}}
                                            type="time"
                                            />
                                        :
                                            <InputSerie
                                            className={'input-reps'}
                                            className='inputSerie'
                                            name={exercise.nameEx}
                                            objEx={{nameInput:'reps',serie:serie.idSerie}}
                                            onChange={getDataRoutine}
                                            style={{width:"35%"}}
                                            type="number"
                                            />
                                        }
                                        <Container className={'checkbox'}>
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
            </Form>
            <Container className={'container-add-new-exercise'}>
                    <Button
                    onClick={() => updateState({...state, modal:!state.modal})}
                    textButton='Agregar un ejercicio'
                    />
            </Container>
            <footer>
                <p className="p-doit"><span>Do</span>It</p>
            </footer>
            </>
            }
            </Main>
            <Modal>
                {state.modal && 
                    <>
                        <ListExercises
                            token={token}
                            objectState={{state:state,setState:updateState}}
                        />
                        <Container
                        onClick={() => updateState({...state, modal:false})}
                        className={'back'}/>
                    </>
                }
                { state.modalCreate &&
                    <>
                        <CreateExercise
                        token={token}
                        objectState={{state:state,setState:updateState}}
                        />
                        <Container className={'back'}
                        onClick={() => updateState({...state, modalCreate:false})}
                        />
                    </>
                }
                {
                state.modalDelete.boolean === true && 
                    <>
                        <ModalDelete
                        token={token}
                        objectState={{state:state,setState:updateState}}
                        />
                        <Container className={'back'}
                        />
                    </>
                }
            </Modal>
        </>
        )
    }else if( !routine.active || !token ) return (
        <Navigate to={'/'}/>
    )
}

export { GoRoutine }