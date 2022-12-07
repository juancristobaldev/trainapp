import React from "react";
import { IoMdClose } from "react-icons/io";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { useDarkMode } from "../hooks/useDarkMode";
import { Create } from "./Create/Create";
import { Button } from "./generals/Button";
import { Container } from "./generals/Container";
import { Text } from "./generals/Text";
import { List } from "./Lists/List";
import { Timer } from "./MenuTimer/Timer";


import '../styles/Timer.scss'
import { useEffect } from "react";
import { useState } from "react";

const timers = JSON.parse(localStorage.getItem('timer'))

const TimerMenu = ({objState}) => {

    const { darkMode } = useDarkMode()
    const [timer,updateTimer] = useState([])

    const {state,setState} = objState

    const getDataTimer = (event) => {
        const timer = {...state.timer.clock}
        timer[event.target.name] = event.target.value
        setState({...state, timer:{...state.timer, clock:timer}})
     }
 
     const setTimer = async () => {
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
             await updateTimer(newList)
             setState({...state, timer:{...state.timer, clock:{}, type:'select'}})
         }else{
            setState({...state, timer:{...state.timer, errors:{error:true, errors:[...errors]}}})
         }
         
     }

     useEffect(() => {
        if(!timers) {
            localStorage.setItem('timer',JSON.stringify([]))
            updateTimer([])
        }else{
            updateTimer(timers)
        }
     },[timers])

    return (
                <>
                <Container className={`back ${darkMode && 'darkMode'}`} 
                onClick={
                state.timer.time === false ? 
                () => setState({...state, timer:{...state.timer,modalTimer:false,type:'select',time:''}}) 
                : 
                () => setState({...state, timer:{...state.timer, secondPlane: !state.timer.secondPlane}})}
                style={state.timer.secondPlane ? {display:"none"} : {display:"block"}} 
                />
                {
                    !state.timer.time ?
                    <>
                    {
                        state.timer.type === 'select' ?
                        <Container className={`modal-timer ${state.timer.secondPlane ? "second-plane" : "undefined"} ${darkMode && 'darkMode'}`}>
                            <Container className={'header-timer'}>
                                <Text text="Temporizador"/>
                                <Container className={`close-button ${darkMode && "darkMode"}`}>
                                    <IoMdClose
                                    cursor={'pointer'}
                                    onClick={
                                        state.timer.time === false ? 
                                        () => setState({...state, timer:{...state.timer,modalTimer:false,time:''}}) 
                                        : 
                                        () => setState({...state, timer:{...state.timer, secondPlane: !state.timer.secondPlane}})}
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
                                    onClick={() => setState({...state, timer:{...state.timer, time:timer}})}
                                    />
                                </Container>
                            }
                            />
                            <Container
                            className={'buttons-timer-select'}
                            >
                                <Button
                                textButton={'Crear temporizador'}
                                onClick={() => setState({...state,timer:{...state.timer, type:'create' }}) }
                                />
                            </Container>
                        </Container> 
                        :
                        <Create className={`modal-timer ${state.timer.secondPlane ? "second-plane" : "undefined"} ${darkMode && 'darkMode'}`}>
                            <Container className={'header-timer'}>
                                <Text text="Temporizador"/>
                                <Container className={'close-button'}>
                                    <MdOutlineKeyboardReturn
                                    onClick={() => setState({...state,timer:{...state.timer, type:'select', clock:{minutes:'',seconds:''},errors:{error:false,errors:[]}}})}
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
                                <Text className={'minutes-text'} text={'Minutos'}/>
                                <Container className={'minutes'}>
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
                                <Text className={'seconds-text'} text={'Segundos'}/>
                                <Container className={'seconds'}>
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
                    <Container className={`modal-timer ${state.timer.secondPlane ? "second-plane" : "undefined"} ${darkMode && 'darkMode'}`}>
                        <Container
                        className={'header-timer'}
                        >
                            <Text text={'Temporizador'}/>
                            <Container className={'close-button'}>
                                <MdOutlineKeyboardReturn
                                    cursor={'pointer'}
                                    onClick={() => setState({...state,timer:{...state.timer, type:'select', time:''}})}
                                />
                            </Container>
                        </Container>
                        <Timer
                            time={state.timer.time}
                            objState={objState}
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
                                () => setState({...state, timer:{...state.timer,modalTimer:false,type:'select',time:''}}) 
                                : 
                                () => setState({...state, timer:{...state.timer, secondPlane: !state.timer.secondPlane}})
                            }
                            textButton={'Aceptar'}
                            />
                        </Container>
                    </Container>
                    </>
                }
                </>
    )
}

export {TimerMenu}