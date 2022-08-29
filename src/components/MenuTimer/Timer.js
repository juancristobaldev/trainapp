import React, { useEffect, useRef, useState } from "react";
import {FaPlay} from "react-icons/fa"
import {VscDebugRestart} from "react-icons/vsc"
import {CgMathMinus,CgMathPlus} from "react-icons/cg"
import { Container } from "../generals/Container";


function Timer({time}){
    const [timer,setTimer] = useState(time)
    const [timerState,setTimerState] = useState(false)

    const convertTime = () => {
        const minutes = (parseInt(`${time[0]}${time[1]}`) * 60000)
        const seconds = (parseInt(`${time[3]}${time[4]}`) * 1000)
        const timeAsigned = minutes + seconds + 1000
        return {timeAsigned}
    }

    const {timeAsigned} = convertTime()

    const timeEnd = useRef(null)
    const idInterval = useRef(null)

    const getTimeRemaining = () => {
        const timeNow = new Date().getTime()
        const difference = timeEnd.current - timeNow
        const minutesTime = Math.floor((difference / 1000) / 60) 
        const secondsTime = Math.floor((difference % 60000) / 1000)
        return {difference, minutesTime, secondsTime}
    }

    const startOrRestartTimer = () => {
        timeEnd.current = (new Date().getTime() + timeAsigned)
        setTimerState(true)                                     
    }

    const additionTimer = () => {
        timeEnd.current = timeEnd.current + 10000
        countdown()
    }
    const sustractionTimer = () => {
        const {difference} = getTimeRemaining()
        if(difference < 10000){
            timeEnd.current = timeEnd.current - 10000
            setTimer('00:00')
        }else{
            timeEnd.current = timeEnd.current - 10000
        }
        countdown()
    }

    function countdown(){
        const {minutesTime,secondsTime} = getTimeRemaining()
        
        if(timerState === true){
            if(minutesTime >= 0 || secondsTime >= 0){
                setTimer(`${minutesTime <= 9 ? `0${minutesTime}` : minutesTime }:${secondsTime <= 9 ? `0${secondsTime}` : secondsTime}`)
            }
            else{
                setTimerState(false)
            }
        }
    }

    useEffect(() => {
        console.log(timerState)
        if(timerState === true){
            idInterval.current = setInterval(() => {
                if(timerState === true){
                    countdown()
                }
            },1000)
        }
    })
    return (
        <Container className="timer">
            <Container className={'timer-count'}>
                    <h2>{timer[0]}{timer[1]}:{timer[3]}{timer[4]}</h2>
            </Container>
            <Container className="timer-buttons">
            {timerState === true && 
                <button 
                className="button-delete" 
                onClick={() => sustractionTimer()}
                ><CgMathMinus/></button>
            }
                <button 
                className="button-alter" 
                onClick={() => startOrRestartTimer()}
                >{timerState ? <VscDebugRestart/> : <FaPlay/>}</button>
            {timerState === true &&
                <button  
                className="button-add" 
                onClick={() => additionTimer()}
                ><CgMathPlus/></button>
            }
            </Container>
        </Container>
    )
}

export { Timer }