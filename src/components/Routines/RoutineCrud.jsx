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
import { ButtonIcon } from "../ButtonIcon";
import { useSeries } from "../../hooks/useSeries";
import { IoMdClose } from "react-icons/io";
import {HiLockClosed} from "react-icons/hi"

import '../../styles/ListSeries.scss'
import '../../styles/CreateRoutine.scss'
import "../../styles/responsive/CreateRoutine.scss"
import '../../styles/Modal.scss'

import Cookies from "universal-cookie/es6";
import { InputSerie } from "../InputSerie";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ROUTINE, UPDATE_ROUTINE } from "../../data/mutations";
import { GET_EXERCISES_BY_TOKEN, GET_ROUTINES_AND_USER_BY_TOKEN, GET_ROUTINE_BY_ID } from "../../data/query";
import { ListExercises } from "../Exercises/ListExercises";
import { CreateExercise } from "../Exercises/CreateExercise";
import { ModalDelete } from "../Modal/ModalDelete";
import { useList } from "../../hooks/useList";
import { useWidthScreen } from "../../hooks/useWidthScreen";
import { Section } from "../generals/Section";
import { useDarkMode } from "../../hooks/useDarkMode";
import { ModalAreUSure } from "../Modal/ModalAreUSure";
import { useExercises } from "../../hooks/useExercises";
import { BsClockHistory } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { ProgressiveCount } from "../ProgressiveCount";
import { Create } from "../Create/Create";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { Timer } from "../MenuTimer/Timer";


const token = new Cookies().get('session-token')
const timer = JSON.parse(localStorage.getItem('timer'))

const RoutineCrud = ({routineObj}) => {

    const redirect = useNavigate()

    const {active, id, routine} = routineObj

    const {darkMode} = useDarkMode(),
    {widthScreen} = useWidthScreen()

    const [state,setState] = useState({
        listOnCreate:[],
        modal:false,
        modalErrors:{error:false,errors:[]},
        modalCreate:false,
        modalDelete:{boolean:false,items:[]},
        modalUncompletedRoutine:false,
        searchValue:'',
        totalData:0,
        errors:{},
        dataRoutine:false,
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
            token:token,
            name:'',
            exercises:[],
            timeRecord:'indefinido',
            dones:0
        }
    }),
    {dataFormCreate,listOnCreate} = state

    const {
        listForSelect,
        updateListForSelect,
        deleteItem,
    } = useList ('exercises',{state:state,updateState:setState},true,{ nameGql:"getExercisesByToken",gql:GET_EXERCISES_BY_TOKEN,variables:{ variables:{ token:token } } })

    const {
        deleteSomeExercise
    } = useExercises(token,{list:listForSelect,updateList:updateListForSelect},{stateValue:state,setState:setState})

    const {
        addSerie,
        deleteSeries,
        classControl
    } = useSeries({state:state,updateState:setState})


    const [createRoutine] = useMutation(CREATE_ROUTINE),
    [updateRoutine] = useMutation(UPDATE_ROUTINE) 

    const getDataRoutine = async (e,name,objEx) => {
        const newData = {...dataFormCreate};
        const newList = [...listOnCreate]

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
    const getDataTimer = (event) => {
        const timer = {...state.timer.clock}
        timer[event.target.name] = event.target.value
        setState({...state, timer:{...state.timer, clock:timer}})
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
             setState({...state, timer:{...state.timer, clock:{}, type:'select'}})
         }else{
            setState({...state, timer:{...state.timer, errors:{error:true, errors:[...errors]}}})
         }
         
     }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const {token,name,exercises,timeRecord,dones} = dataFormCreate,
        errorObj = {};

        if(active && id || !active && id){

        }else{
    
            if(!exercises.length) errorObj.exercises = 'Debes agregar al menos un ejercicio.'

            if(!name.length) errorObj.name = 'Debes escribir un nombre para tu rutina.'

            const errorArray = Object.values(errorObj)

            if(!errorArray.length){

                console.log('here')

                const inputVariables = {...dataFormCreate, exercises:JSON.stringify(dataFormCreate.exercises)}

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
            }else setState({...state, modalErrors:{error:true,errors:errorArray}, errors:errorObj})

        }
    }
    useEffect(() => {

            let newListOnCreate = [...JSON.parse(routine.exercises)]
            newListOnCreate.forEach(item => {
                item.seriesEx.forEach(serie => {
                    const lastSerie = serie.other ? `${serie.other} Kg / ${serie.reps} Reps` : serie.time ? `${serie.time} Min` : `${serie.reps} Reps`
                    serie["lastMoment"] = lastSerie
                })
            })

            setState(
                {...state, 
                dataRoutine:routine, 
                timer:{...state.timer, errors:{error:false,errors:[]}},
                dataFormCreate:{...state.dataFormCreate, exercises:JSON.parse(routine.exercises)},
                listOnCreate:newListOnCreate
                }
            )

        
    },[routine])
    return (
        <Section className={`grid ${widthScreen > 650 && "web"} ${darkMode && "darkMode"}`}>
        <Section className={`section-create-routine ${widthScreen > 650 && "web"}`}>
        { state.timer.modalTimer &&
                <>
                <Container className={'back'} 
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
                        <Container className={`modal-timer ${state.timer.secondPlane ? "second-plane" : "undefined"}`}>
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
                        <Create className={`modal-timer ${state.timer.secondPlane ? "second-plane" : "undefined"}`}>
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
                                    onClick={() => setState({...state,timer:{...state.timer, type:'select', time:''}})}
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
            }
            <Container className={'header-create-routine'}>
                {   
                    (active && id) ?
                    <ButtonIcon 
                    onClick={
                        state.timer.time === false ? 
                        () => setState({...state, timer:{...state.timer,modalTimer:!state.timer.modalTimer,time:''}}) 
                        : 
                        () => setState({...state, timer:{...state.timer, secondPlane: !state.timer.secondPlane}})}
                    classNameContainer={'timer'} 
                    textButton={'Temporizador'} 
                    icon={<BsClockHistory/>} 
                    />
                    :  
                    <Text text={`${(!active && !id) ? 'Crear rutina' : (!active && id) && 'Editar rutina'}`}/>
            
                }
                <ButtonIcon 
                classNameContainer={'button-cancel'} 
                textButton={'Cancelar'} 
                icon={<MdCancel/>} 
                />
            </Container>
            <Form
            className={'form-create-routine'}
            onSubmit={handleSubmit}
            textSubmit='Crear rutina'>
                {(active && id) ?
                <Container className={'stats-goroutine'}>
                <h2>{routine.name}</h2>
                <Text
                text={`Mejor tiempo 🎉: ${state.dataRoutine.timeRecord}`}
                />
                <ProgressiveCount
                id={"progressive-count"}
                />                    
                </Container>
                :
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
                }
                <Container className={'container-add-exercise'}>
                    <Text text={'Ejercicios:'}/>
                    <input
                    type={'button'}
                    onClick={() => setState({...state, modal:!state.modal})}
                    value='+ Ejercicio'
                    />
                </Container>
                <List
                    errors={[state.errors.exercises]}
                    className={`exercises-list-routine ${darkMode && 'darkMode'}`}
                    item={listOnCreate}
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

export {RoutineCrud}