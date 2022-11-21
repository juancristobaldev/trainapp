import React, { useEffect, useState } from "react";
import { Container } from "../generals/Container";
import { useNavigate } from "react-router-dom";
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
import { useMutation } from "@apollo/client";
import { CREATE_ROUTINE, UPDATE_FOLDER, UPDATE_ROUTINE, UPDATE_USER } from "../../data/mutations";
import { GET_EXERCISES_BY_TOKEN, GET_ROUTINES_AND_USER_BY_TOKEN } from "../../data/query";
import { ListExercises } from "../Exercises/ListExercises";
import { CreateExercise } from "../Exercises/CreateExercise";
import { useList } from "../../hooks/useList";
import { useWidthScreen } from "../../hooks/useWidthScreen";
import { Section } from "../generals/Section";
import { useDarkMode } from "../../hooks/useDarkMode";
import { ModalAreUSure } from "../Modal/ModalAreUSure";
import { useExercises } from "../../hooks/useExercises";
import { BsClockHistory } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { ProgressiveCount } from "../ProgressiveCount";
import CheckBox from "../Checkbox";
import { TimerMenu } from "../MenuTimer";

const token = new Cookies().get('session-token')
const timer = JSON.parse(localStorage.getItem('timer'))

const RoutineCrud = ({routineObj}) => {

    const redirect = useNavigate()

    const {active, id, routine} = routineObj

    console.log(active,id,routine)

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
        checkSerie,
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

                if(active && id) item.seriesEx.forEach(serie => {
                    serie.need = false
                })

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
        e.preventDefault()

        const {token,name,exercises,timeRecord,dones} = dataFormCreate,
        errorObj = {};

        if(active && id || !active && id){

            let newList = [...listOnCreate],
            dataRoutine = {
                ...dataFormCreate,
                id:routine.id,
                timeRecord:routine.timeRecord,
            },
            error = false
        
            delete dataRoutine.token

            if(!dataRoutine.name) dataRoutine.name = routine.name

            await newList.forEach(item => {
                item.seriesEx.forEach(serie => {
                    if(serie.checked === false){
                        serie["need"] = true
                        error = true
                    }
                })
            })

            if(confirmation) error = false
            if(error) await setState({...state, dataFormCreate:dataRoutine,modalUncompletedRoutine:true})
            else{
                dataRoutine.exercises = newList

                if(!active && id) dataRoutine.dones = routine.dones
                if(active && id){
                    dataRoutine.dones = routine.dones + 1

                    const timeNow = document.getElementById('progressive-count').innerHTML.substring(18,26)

                    if(dataRoutine.timeRecord !== "indefinido"){
                        console.log(timeNow)
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

                        const {hourRecord,minRecord,segRecord} = objectRecord,
                        {hour,min,seg} = timeRoutine,
                        timeRecordString = `${timeRoutine.hour <= 9 ? `0${timeRoutine.hour}`:`${timeRoutine.hour}`}:${timeRoutine.min <= 9 ? `0${timeRoutine.min}` : timeRoutine.min }:${timeRoutine.seg <= 9 ? `0${timeRoutine.seg}` : timeRoutine.seg}`  
                        
                        if(hourRecord == hour){
                            if(minRecord == min){
                                if(segRecord == seg) dataRoutine.timeRecord = timeRecord
                                else{
                                    if(segRecord > seg) dataRoutine.timeRecord = timeRecordString
                                    else dataRoutine.timeRecord = timeRecord;
                                }
                            }else{
                                if(minRecord > min) dataRoutine.timeRecord = timeRecordString
                                else dataRoutine.timeRecord = timeRecord;
                            }
                        }else if(hour < hour) dataRoutine.timeRecord = timeRecordString
                        else dataRoutine.timeRecord = timeRecord;
                    }
                    else {

                        dataRoutine.timeRecord = timeNow 
                        console.log(timeRecord)
                    }
                }

                await dataRoutine.exercises.forEach(exercise => {
                    exercise.seriesEx.forEach(serie => {
                        serie.checked = false
                        serie.need = false
                    })
                })

                console.log(dataRoutine)
                 updateRoutine({
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
            }

        }else{
    
            if(!exercises.length) errorObj.exercises = 'Debes agregar al menos un ejercicio.'

            if(!name.length) errorObj.name = 'Debes escribir un nombre para tu rutina.'

            const errorArray = Object.values(errorObj)

            if(!errorArray.length){

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
        
            if(routine){

                let newListOnCreate = [...JSON.parse(routine.exercises)]
                console.log(newListOnCreate)
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
            }

        
    },[routine])
    return (
        <Section className={`grid ${widthScreen > 650 && "web"} ${darkMode && "darkMode"}`}>
        <Section className={`section-create-routine ${widthScreen > 650 && "web"}`}>
        { state.timer.modalTimer && 

            <TimerMenu objState={{state:state,setState:setState}}/>

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
                    classNameContainer={'button-timer'} 
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
            textSubmit={`${(!active && !id) ? 'Crear rutina' : (!active && id) ? 'Editar rutina' : 'Finalizar rutina'}`}>
                {(active && id) ?
                <Container className={'stats-goroutine'}>
                <h2>{routine.name}</h2>
                <Text
                text={`Mejor tiempo 🎉: ${routine.timeRecord}`}
                />
                <ProgressiveCount
                id={"progressive-count"}
                />                    
                </Container>
                :
                <FormControl
                objState={{state:state,setState:setState}}
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
                    onClick={() => setState({...state, modal:!state.modal, modalErrors:{error:false,errors:{}},errors:{}})}
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
                            onEmpty={() => 
                            <Container className={'first-serie'}>
                                <Text text={'Agrega tu primera serie'}/>
                            </Container>
                            }
                            render={ serie => (
                                <Container
                                key={serie.idSerie}
                                className={classControl(exercise.typeEx) + ` serie ${serie.checked === true ? 'checked' : false}`}
                                >
                                    <Container className={'delete-serie'}>
                                        <IoMdClose
                                        onClick={() => deleteSeries(serie,exercise)}
                                        />
                                    </Container>
                                    <Text text={serie.lastMoment ? serie.lastMoment : '-'} />
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
                                        {   (active && id) ?

                                            <CheckBox
                                            style={ !serie.checked && serie.need ? { border:'1px solid red' } : {border:0}}
                                            onClick={() => checkSerie(serie,exercise)}
                                            className={serie.checked ? "checkBoxOn" : "checkBoxOff"}
                                            select={serie.checked}
                                            />
                                        :

                                            <Container className={'lock'}>
                                                <HiLockClosed/>
                                            </Container>

                                        }
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
            {
                        state.modalUncompletedRoutine === true && 
                        
                        <ModalAreUSure
                        text={"Algunos ejercicios estan incompletos..."}
                        acceptFunction={event => handleSubmit(event,true)}
                        cancelFunction={() => setState({...state, modalUncompletedRoutine: false})}
                        />
                    }
        </Modal>
    </Section>
    )

}

export {RoutineCrud}