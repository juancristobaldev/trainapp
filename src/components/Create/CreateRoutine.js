import React, { useState } from "react";
import { Container } from "../generals/Container";
import { useNavigate } from "react-router-dom";
import { Main } from "../generals/Main";
import { Form } from "../Form/Form";
import { Text } from "../generals/Text";
import { Modal } from "../Modal/Modal";
import { ListExercisesSelect } from "../Lists/ListExercisesSelect";
import { ListExercisesOnPlay } from "../Lists/ListExercisesOnPlay";
import { FormControl } from "../Form/FormControl";
import { getErrorsForm } from "../functions/getFormsError";
import Cookies from "universal-cookie/es6";

const CreateRoutine = ( ) => {
    const cookies = new Cookies()
    const redirect = useNavigate()
    const [modal,setModal] = useState(false)
    const [error,setError] = useState({error:false, errors:[]})
    const [listOnCreate,setListOnCreate] = useState([])

    const [dataFormCreate,setDataFormCreate] = useState({
        idUser:cookies.get('user').id,
        nameRoutine:null,
        exercises:[],
        timeRecord:'00:00',
        done:0
    })

    const getDataRoutine = async (e,name,nameInput,serie,typeEx) => {
        const newData = {...dataFormCreate};
        if(name === 'nameRoutine'){
            newData[name] = e.target.value
            setDataFormCreate(newData)
        }else{
            const newList = [...listOnCreate]
            await newList.forEach(item => {
                if(item.nameEx === name){
                    const indexSerie = item.seriesEx.findIndex(item => item.idSerie === serie)
                    if(nameInput === 'other'){
                        item.seriesEx[indexSerie]['other'] = e.target.value
                    }else{
                        item.seriesEx[indexSerie].reps = e.target.value
                    }
                }

            })
            newData.exercises = newList
            setDataFormCreate(newData)
        }

    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const {exercises,nameRoutine} = dataFormCreate

        const posiblyErrors = [
            {property:exercises,error:'Debes agregar al menos un ejercicio'},
            {property:nameRoutine,error:'Debes escribir un nombre para la rutina'}
        ]

        const {errorsForm} = getErrorsForm(posiblyErrors)

        if(errorsForm.length === 0){
            const requestOption = {
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataFormCreate)
            };
    
            const response = await fetch('http://localhost:3001/api/routines/create-routine', requestOption);
            response.json()
            .then(data => data ? 
                console.log('yes') :  console.log('error')
            )
        }else{ 
            setError({error:true,errors:errorsForm})
        }
    }

    return(
        <Main>
            <Container>
                <Text text={'Estas creando una rutina:'}/>
                <button
                onClick={() => redirect('/')}
                >Salir</button>
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
                {listOnCreate.length == 0 ? 
                
                    <Text text='No has agregado ningun ejercicio'/>    
                    :
                    <ListExercisesOnPlay
                    getDataRoutine={getDataRoutine}
                    list={listOnCreate}
                    setList={setListOnCreate}
                    />
                }
            </Form>
            <Container>
                <button
                onClick={() => setModal(!modal)}
                >Agregar un ejercicio</button>
            </Container>
            {modal && 
                <Modal>
                    <ListExercisesSelect
                        list={listOnCreate}
                        setList={setListOnCreate}
                        close={setModal}
                    />
                </Modal>
            }
            {error.error && 
                <Modal>
                    {error.errors.map(item => 
                    <p style={{color:'red'}}>{item}</p>    
                    )}
                </Modal> 
            }
        </Main>
    )
}

export {CreateRoutine}