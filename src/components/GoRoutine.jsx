import { useMutation, useQuery } from "@apollo/client";
import React, { useContext } from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
import { InputSerie } from "./InputSerie";
import { Exercise } from "./Exercise";
import { IoMdClose } from "react-icons/io";
import { useSeries } from "../hooks/useSeries";
import { Form } from "./Form/Form";
import { Serie } from "./Serie";
import { Modal } from "./Modal/Modal";
import {MdOutlineKeyboardReturn} from "react-icons/md"

import '../styles/Exercises.scss'
import '../styles/Timer.scss'
import '../styles/GoRoutine.scss'

import { Timer } from "./MenuTimer/Timer";
import { ListExercises } from "./Lists/ListExercises";
import { CreateExercise } from "./Create/CreateExercise";
import { ModalDelete } from "./Modal/ModalDelete";
import { Create } from "./Create/Create";
import { FaCheck } from "react-icons/fa";
import { ProgressiveCount } from "./ProgressiveCount";

import { GET_EXERCISES_BY_TOKEN, GET_ROUTINES_AND_USER_BY_TOKEN, GET_ROUTINE_BY_ID, GET_USER } from "../data/query";
import { UPDATE_ROUTINE,UPDATE_USER } from "../data/mutations";
import { DataContext } from "../context/DataProvider";
import { ModalAreUSure } from "./Modal/ModalAreUSure";
import { useList } from "../hooks/useList";

const token = new Cookies().get('session-token')


const GoRoutine = ({routine}) => {
    const navigate = useNavigate()

    const [updateRoutine] = useMutation(UPDATE_ROUTINE),
    [updateUser] = useMutation(UPDATE_USER)


    const [state,updateState] = useState({
        dataRoutine:false,
        listOnCreate:[],
        modal:false,
        modalErrors:{error:false,errors:[]},
        modalDelete:{boolean:false,items:[]},
        modalCreate:false,
        modalUncompletedRoutine:false,
        timer:{
            errors:{error:false,errors:[]},
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
        dataFormCreate:{
            id:routine.routine.id,
            name:routine.routine.name,
            exercises:[],
            timeRecord:routine.routine.timeRecord,
            dones:routine.routine.dones + 1
        }
    })

    const {
        me
    } = useContext(DataContext)


    const timer = JSON.parse(localStorage.getItem('timer'))

    if(!timer) {
        localStorage.setItem('timer', JSON.stringify([]))
        updateState({...state, timer:{...state.timer, listTimers:[]}})
    }

    const {
        deleteItem,
    } = useList ('exercises',{state:state,updateState:updateState},true,{ nameGql:"getExercisesByToken",gql:GET_EXERCISES_BY_TOKEN,variables:{ variables:{ token:token } } })

    const {
        addSerie,
        deleteSeries,
        classControl,
        checkSerie
    } = useSeries({state:state,updateState:updateState})

    const { data,loading,error } = useQuery(GET_ROUTINE_BY_ID, {
        variables:{
            id:routine.id
        }
    })

    const handleSubmit = async (e,confirmation) => {

        const {listOnCreate,dataFormCreate} = state

        e.preventDefault()
        let newList = [...listOnCreate]
        const dataRoutine = {...dataFormCreate};
        let error = false

        await newList.forEach(item => {
            item.seriesEx.forEach(serie => {
                if(serie.checked === false){
                    serie["need"] = true
                    error = true
                }
            })
        })

        if(confirmation) error = false

        if(error === true){
            await updateState({...state, dataFormCreate:dataRoutine,modalUncompletedRoutine:true})
        }
        else {
            dataRoutine.exercises = newList

            const timeNow = document.getElementById('progressive-count').innerHTML.substring(18,26)
            console.log(timeNow)
        if(dataRoutine.timeRecord !== 'indefinido'){   
            const timeRoutine = {
                hour:parseInt(`${timeNow[0]}${timeNow[1]}`),
                min:parseInt(`${timeNow[3]}${timeNow[4]}`),
                seg:parseInt(`${timeNow[6]}${timeNow[7]}`)
            }

            const objectRecord = {
                hourRecord:parseInt(`${dataRoutine.timeRecord[0]}${dataRoutine.timeRecord[1]}`),
                minRecord:parseInt(`${dataRoutine.timeRecord[3]}${dataRoutine.timeRecord[4]}`),
                segRecord:parseInt(`${dataRoutine.timeRecord[6]}${dataRoutine.timeRecord[7]}`)
            }

            const {hourRecord,minRecord,segRecord} = objectRecord
            const hourRoutine = timeRoutine.hour

            if(hourRecord == hourRoutine){
                const minRoutine = parseInt(timeRoutine.min)
                if(minRecord == minRoutine){
                    const segRoutine = parseInt(timeRoutine.seg)
                    if(segRecord == segRoutine) dataRoutine.timeRecord = dataRoutine.timeRecord
                    else{
                        if(segRecord > segRoutine) dataRoutine.timeRecord = `${timeRoutine.hour <= 9 ? `0${timeRoutine.hour}`:`${timeRoutine.hour}`}:${timeRoutine.min <= 9 ? `0${timeRoutine.min}` : timeRoutine.min }:${timeRoutine.seg <= 9 ? `0${timeRoutine.seg}` : timeRoutine.seg}`  
                        else dataRoutine.timeRecord = dataRoutine.timeRecord;
                    }
                }else{
                    if(minRecord > minRoutine) dataRoutine.timeRecord = `${timeRoutine.hour <= 9 ? `0${timeRoutine.hour}`:`${timeRoutine.hour}`}:${timeRoutine.min <= 9 ? `0${timeRoutine.min}` : timeRoutine.min }:${timeRoutine.seg <= 9 ? `0${timeRoutine.seg}` : timeRoutine.seg}`
                    else dataRoutine.timeRecord = dataRoutine.timeRecord;
                }
            }else if(hourRoutine < hourRecord) dataRoutine.timeRecord = `${timeRoutine.hour <= 9 ? `0${timeRoutine.hour}`:`${timeRoutine.hour}`}:${timeRoutine.min <= 9 ? `0${timeRoutine.min}` : timeRoutine.min }:${timeRoutine.seg <= 9 ? `0${timeRoutine.seg}` : timeRoutine.seg}`
            else dataRoutine.timeRecord = dataRoutine.timeRecord;
        }
        else dataRoutine.timeRecord = timeNow 

        await dataRoutine.exercises.forEach(exercise => {
            exercise.seriesEx.forEach(serie => {
                serie.checked = false
                serie.need = false
            })
        })

        let lastWorkOuts = []
        if(me.last_workouts !== undefined){
            lastWorkOuts = JSON.parse(me.last_workouts);
            const index = lastWorkOuts.findIndex(item => item.name === dataRoutine.name);
            let someRoutine;
            if(index >= 0) {
                someRoutine = lastWorkOuts[index]
                lastWorkOuts.splice(index,1)
            }else if(lastWorkOuts.length >= 3){
                lastWorkOuts.pop()
            }
            lastWorkOuts.unshift({...dataRoutine})
        }

        console.log(dataRoutine)
       
        await updateUser({
            variables:{
                input:{
                    id:me.id,
                    last_workouts:JSON.stringify([...lastWorkOuts])
                }
            },
            refetchQueries:[{GET_USER, variables:{
                token:token
            }}]
        })

       await updateRoutine({
            variables:{
                input:{
                    ...dataRoutine,
                    exercises:JSON.stringify(dataRoutine.exercises)
                }
            },
            refetchQueries:[{GET_ROUTINES_AND_USER_BY_TOKEN, variables:{
                token:token
            }}]
        }).then( ({data}) => {
            const {error,success} = data.updateRoutine
            if(error) console.log(error)
            if(success){
                navigate('/')
                window.location.reload()
            }
        })
        }
    }

    const getDataRoutine = async (e,name,objEx) => {

        const newData = {...state.dataFormCreate};
        const newList = [...state.listOnCreate]

        const {nameInput,serie,idList} = objEx
        await newList.forEach(item => {
            item.seriesEx.forEach(serie => {
                serie.need = false
            })
            if(item.idList === idList){
                const indexSerie = item.seriesEx.findIndex(item => item.idSerie === serie)
                item.seriesEx[indexSerie][nameInput] = e.target.value;
            }
        })

        newData.exercises = newList

        updateState({...state, dataFormCreate:newData})
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
        if(parseInt(clock.minutes) > 59 || parseInt(clock.seconds) > 59) errors.push('El tiempo maximo es: 59:59min')
        if(!clock.minutes || !clock.seconds) errors.push('Minutos y segundos obligatorios') 
        if(errors.length === 0) {
            const newList = [...JSON.parse(localStorage.getItem('timer'))]
            time = `${clock.minutes <= 9  ? `0${clock.minutes}` : `${clock.minutes}`}:${clock.seconds <= 9 && clock.seconds >= 1  ? `0${clock.seconds}` : `${clock.seconds}`}`
            if(newList.length < 3){
                newList.unshift(time)
            }else{
                newList.pop()
                newList.unshift(time)
            }
            localStorage.setItem('timer',JSON.stringify([...newList]))
            updateState({...state, timer:{...state.timer, clock:{}, type:'select'}})
        }else{
            updateState({...state, timer:{...state.timer, errors:{error:true, errors:[...errors]}}})
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

            updateState(
                {...state, 
                dataRoutine:data.getRoutineById[0], 
                timer:{...state.timer, errors:{error:false,errors:[]}},
                dataFormCreate:{...state.dataFormCreate, exercises:JSON.parse(data.getRoutineById[0].exercises)},
                listOnCreate:newListOnCreate
                }
            )

        }
    },[data,state.timer.clock])

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
                            <Container className={'close-button'}>
                                <IoMdClose
                                cursor={'pointer'}
                                onClick={
                                    state.timer.time === false ? 
                                    () => updateState({...state, timer:{...state.timer,modalTimer:false,time:''}}) 
                                    : 
                                    () => updateState({...state, timer:{...state.timer, secondPlane: !state.timer.secondPlane}})}
                                    style={state.timer.secondPlane ? {display:"none"} : {display:"block"}} 
                                    />
                            </Container>
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
                            <Container className={'close-button'}>
                                <MdOutlineKeyboardReturn
                                onClick={() => updateState({...state,timer:{...state.timer, type:'select', clock:{minutes:'',seconds:''},errors:{error:false,errors:[]}}})}
                                />
                            </Container>
                        </Container>
                        <Container className={'create-timer'}>
                            {state.timer.errors.error && 
                                <Container className={'errors'}>
                                    {
                                    state.timer.errors.errors.map(error => 
                                    <Text text={error}/>
                                    )
                                    }
                                </Container>
                                
                            }
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
                        <Container className={'close-button'}>
                            <MdOutlineKeyboardReturn
                                cursor={'pointer'}
                                onClick={() => updateState({...state,timer:{...state.timer, type:'select', time:''}})}
                            />
                        </Container>
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
                        onClick={
                            state.timer.time === false ? 
                            () => updateState({...state, timer:{...state.timer,modalTimer:false,type:'select',time:''}}) 
                            : 
                            () => updateState({...state, timer:{...state.timer, secondPlane: !state.timer.secondPlane}})
                        }
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
            onSubmit={(e) => handleSubmit(e)}
            >
                <Container className={'stats-goroutine'}>
                    <h2>{state.dataRoutine.name}</h2>
                    <Text
                    text={`Mejor tiempo 🎉: ${state.dataRoutine.timeRecord}`}
                    />
                    <ProgressiveCount
                    id={"progressive-count"}
                    />                    
                </Container>
                <ListApi
                className={'exercises-list-routine'}
                error={error}
                loading={loading}
                data={state.listOnCreate}
                onError={() => <p>Hay un error</p>}
                onLoading={() => <p>Cargando...</p>}
                onEmpty={() => 
                    <Container className={'exercises-list-routine-empty'}>
                        <Text text={'Agrega tu primer ejercicio'}/>
                    </Container>
                }
                render={exercise => 

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
                        onEmpty={() => 
                            <Text className={'first-serie'} text={'Agrega tu primera serie'}/>
                        }
                        render={ serie => 
                                <Serie
                                    dataRoutine={state.dataRoutine}
                                    exercise={exercise}
                                    serie={serie}
                                    key={serie.idSerie}
                                    className={classControl(exercise.typeEx) + ` serie ${serie.need ? "need" : "false"} ${serie.checked ? "checked" : "unchecked"}`}
                                    >
                                        <Container className={'delete-button'}>
                                            <IoMdClose
                                            onClick={() => deleteSeries(serie,exercise)}
                                            />
                                        </Container>
                                        <Text text={serie.lastMoment}/>
                                        <>
                                            {exercise.typeEx === 'Peso adicional' || exercise.typeEx === 'Peso asistido' ?
                                            <>
                                                <InputSerie
                                                    className={'input-type'}
                                                    style={{width:"35%"}}
                                                    name={exercise.name}
                                                    type="number"
                                                    objEx={{nameInput:'other',idList:exercise.idList,serie:serie.idSerie}}
                                                    onChange={getDataRoutine}                                        
                                                />
                                                <InputSerie
                                                    className={'input-reps'}
                                                    idList={exercise.idList}
                                                    style={{width:"35%"}}
                                                    name={exercise.name}
                                                    objEx={{nameInput:'reps',idList:exercise.idList,serie:serie.idSerie}}
                                                    onChange={getDataRoutine}
                                                    type="number"
                                                />
                                            </>
                                            :
                                            exercise.typeEx === 'Duracion' ?
                                                <InputSerie
                                                className='inputSerie'
                                                idList={exercise.idList}
                                                name={exercise.name}
                                                objEx={{nameInput:'time',idList:exercise.idList,serie:serie.idSerie}}
                                                onChange={getDataRoutine}
                                                style={{width:"50%"}}
                                                type="time"
                                                />
                                            :
                                                <InputSerie
                                                className={'input-reps'}
                                                idList={exercise.idList}
                                                className='inputSerie'
                                                name={exercise.name}
                                                objEx={{nameInput:'reps',idList:exercise.idList,serie:serie.idSerie}}
                                                onChange={getDataRoutine}
                                                style={{width:"35%"}}
                                                type="number"
                                                />
                                            }
                                            <Container className={'checkbox'}>
                                                <Container className="checkBoxItem">
                                                    <Container
                                                    style={ !serie.checked && serie.need ? { border:'1px solid red' } : {border:0}}
                                                    onClick={() => checkSerie(serie,exercise)}
                                                    className={serie.checked ? "checkBoxOn" : "checkBoxOff"}
                                                    >
                                                        {serie.checked && <FaCheck fill="white"/>}
                                                    </Container>
                                                </Container>
                                            </Container>
                                        </>
                                    </Serie> 
                        }
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
                        exercise={true}
                        objectState={{state:state,setState:updateState}}
                        />
                        <Container className={'back'}
                        />
                    </>
                }
                {
                    state.modalUncompletedRoutine === true && 
                    
                    <ModalAreUSure
                    text={"Algunos ejercicios estan incompletos..."}
                    acceptFunction={event => handleSubmit(event,true)}
                    cancelFunction={() => updateState({...state, modalUncompletedRoutine: false})}
                    />
                }
            </Modal>
        </>
        )
    }else if( !routine.active || !token ) return (
        <Navigate to={'/'}/>
    )
}

export { GoRoutine }