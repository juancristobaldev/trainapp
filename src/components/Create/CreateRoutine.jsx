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
import { Serie } from "../Serie";

import '../../styles/ListSeries.scss'

import Cookies from "universal-cookie/es6";
import { InputSerie } from "../InputSerie";

const CreateRoutine =  ( ) => {

    const [state,setState] = useState({
        user:new Cookies().get('user'),
        listOnCreate:[],
        modal:false,
        modalErrors:{error:false,errors:[]},
        modalError:{error:false,message:null},
        modalCreate:false,
        dataFormCreate:{
            idUser:new Cookies().get('user').id,
            nameRoutine:null,
            exercises:[],
            timeRecord:'00:00',
            done:0
        }
    })

    console.log(state.dataFormCreate)

    const redirect = useNavigate()

    const {
        listExercisesSelect,
        setListExercisesSelect,
        selectOfTheList,
        addExerciseToList,
    } = useListExercises (state.user,{state:state,updateState:setState})

    const {
        errors,
        handleChange,
        createExercise,
        deleteExercise,
        modalDelete,
        setModalDelete,
    } = useExercises(state.user,{list:listExercisesSelect,updateList:setListExercisesSelect})

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
                    console.log(e.target.name)
                    const indexSerie = item.seriesEx.findIndex(item => item.idSerie === serie)
                    item.seriesEx[indexSerie][nameInput] = e.target.value;
                }
            })
            newData.exercises = newList
        }
        newData[name] = e.target.value
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
            const requestOption = {
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state.dataFormCreate)
            };
    
            const response = await fetch('http://localhost:3001/api/routines/create-routine', requestOption);
            response.json()
            .then(data => data ? 
                console.log('yes') :  console.log('error')
            )
        }else{ 
            setState({...state, modalErrors:{error:true,errors:errorsForm}})
        }
    }

    const totalSelectItem = listExercisesSelect.filter(item => item.select === true).length

    useEffect(() => {
        setState({...state, modalErrors:{error:false,errors:[]}})
    },[state.dataFormCreate,state.listOnCreate])

    return(
        <Main>
            <Container>
                <Text text={'Estas creando una rutina:'}/>
                <Button
                onClick={() => redirect('/')}
                textButton='Salir'
                />
            </Container>
            <Form
            onSubmit={handleSubmit}
            textSubmit='Crear rutina'>
                <FormControl
                typeControl={'input'}
                type="text"
                name={'nameRoutine'}
                placeholder="Nombre de la rutina"
                onChange={getDataRoutine}
                />
                {state.listOnCreate.length == 0 ? 
                <Text text='No has agregado ningun ejercicio'/>    
                :
                <List>
                {state.listOnCreate.map(item => 
                    <Exercise
                    item={item}
                    >
                        <List
                        className={'listSerie'}
                        style={{
                            display:"flex",
                            justifyContent:'space-around',
                            flexDirection:"column",
                        }}
                        >
                        {item.seriesEx.map(serie => 
                            <Container
                            key={serie.idSerie}
                            className={classControl(item.typeEx) + ' serie'}
                            >
                                <IoMdClose
                                onClick={() => deleteSeries(serie,item)}
                                />
                                <Text text={serie.idSerie} />
                                <Text text={item.nameEx} />
                                <Serie>
                                    {item.typeEx === 'Peso adicional' || item.typeEx === 'Peso asistido' ?
                                    <React.Fragment>
                                        <InputSerie
                                            style={{width:"35%"}}
                                            name={item.nameEx}
                                            type="number"
                                            objEx={{nameInput:'other',serie:serie.idSerie}}
                                            onChange={getDataRoutine}                                        
                                        />
                                        <InputSerie
                                        style={{width:"35%"}}
                                        name={item.nameEx}
                                        objEx={{nameInput:'reps',serie:serie.idSerie}}
                                        onChange={getDataRoutine}
                                        type="number"
                                        />
                                    </React.Fragment>
                                    :
                                    item.typeEx === 'Duracion' ?
                                        <InputSerie
                                        className='inputSerie'
                                        objEx={{nameInput:item.nameEx,serie:serie.idSerie}}
                                        onChange={getDataRoutine}
                                        style={{width:"35%"}}
                                        type="time"
                                        />
                                    :
                                        <InputSerie
                                        className='inputSerie'
                                        objEx={{nameInput:item.nameEx,serie:serie.idSerie}}
                                        onChange={getDataRoutine}
                                        style={{width:"35%"}}
                                        type="number"
                                        />
                                    }
                                </Serie>
                            </Container>
                        )}
                        <Button 
                        onClick={(e) => addSerie(e,item.nameEx)}
                        textButton={'+ Serie'}
                        />
                        </List>
                    </Exercise>                            
                    )}
                </List>
                }
            </Form>
            <Container>
                <Button
                onClick={() => setState({...state, modal:!state.modal})}
                textButton='Agregar un ejercicio'
                />
            </Container>
            {state.modal && 
                <Modal>
                    <List>
                    <Container>
                        <Text text={'Lista de ejercicios'}/>
                        <Container>
                            <Button
                            onClick={() => setState({...state, modal:false})}
                            textButton="Cerrar"
                            />
                            {totalSelectItem > 0 && 
                                <Button 
                                textButton={`Agregar (${totalSelectItem})`}
                                onClick={ () => addExerciseToList() }
                                />         
                            }
                        </Container>
                        {listExercisesSelect.length === 0 && <Text text='Buscando ejercicios...' />}
                        {listExercisesSelect.map( item => 
                            <Text
                                onClick={selectOfTheList}
                                className={item.select ? 'onSelect' : 'offSelect'}
                                text={item.nameEx}
                                key={item.nameEx}
                            />
                        )}
                        <Container>
                            {totalSelectItem > 0 &&
                                <Container>
                                    <Button
                                    textButton={`Eliminar (${totalSelectItem})`}
                                    onClick={() => deleteExercise(false)}
                                    />
                                </Container>                    
                            }
                            <Container>
                                <Button
                                textButton={'Crear ejercicio'}
                                onClick={ () => setState({...state,modalCreate:!state.modalCreate}) }
                                />
                            </Container>
                        </Container>
                    </Container>
                </List>
            </Modal>
            }
            { state.modalCreate &&
                <Modal>
                    <Create>
                        <Container>
                            <Text text='Estas creando un ejercicio:'/>
                            <Button
                            onClick={() => setState({ ...state, modal:false })}
                            textButton={'Cerar'}
                            />
                        </Container>
                        <Form
                        onSubmit={createExercise}
                        textSubmit="Crear"
                        >
                            <FormControl
                            label="Nombre ejercicio:"
                            typeControl="input"
                            name="name"
                            type="text"
                            onChange={handleChange}
                            />
                            <FormControl
                            label="Musculos implicados:"
                            typeControl="select"
                            name="muscle"
                            onChange={handleChange}
                            >
                                <Options 
                                arrayOptions={
                                    ['Espalda','Pectoral','Hombro','Abdomen','Biceps','Triceps']
                                } 
                                />
                            </FormControl>
                            <FormControl
                            label="Tipo de ejercicio:"
                            typeControl="select"
                            name="type"
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
            errors.error && 
            <Modal>
                <p
                style={{color:"red"}}
                >{errors.errors.map(item => item)}</p>
            </Modal>
            }
            {
            modalDelete.boolean === true && 
            <Modal>
                <Text text={'¿Estas seguro que deseas eliminar los siguientes ejercicios?'}/>
                {modalDelete.items.map(item =>
                    <Text 
                    text={item} 
                    style={{ color:'red'}}
                    />
                )}
                <Button 
                textButton='Aceptar'
                onClick={() => deleteExercise(true)}/>
                <Button 
                textButton={'Cancelar'}
                onClick={() => setModalDelete({
                    boolean:false,
                    items:true
                })}
                />
            </Modal>
            }
            {
            state.modalError.error === true &&
            <Modal>
                <Text
                text={state.modalError.message}
                style={{
                    color:"red"
                }}
                />
                <Button
                textButton={'Aceptar'}
                onClick={() => setState({...state, modalError:{
                    error:false,
                    message:'',
                }})}
                />
            </Modal>
            }
            {state.modalErrors.error && 
                <Modal>
                    {state.modalErrors.errors.map(item => 
                        <p 
                        key={item}
                        style={{color:'red'}}>{item}</p>    
                    )}
                </Modal> 
            }
        </Main>
    )
}

export {CreateRoutine}