import React, { useState } from "react";
import { Container } from "../generals/Container";
import { useNavigate } from "react-router-dom";
import { Main } from "../generals/Main";
import { Form } from "../Form/Form";
import { Text } from "../generals/Text";
import { Modal } from "../Modal/Modal";
import { ListExercisesSelect } from "../Lists/ListExercisesSelect";
import { ListExercisesOnPlay } from "../Lists/ListExercisesOnPlay";

const CreateRoutine = ( ) => {
    const redirect = useNavigate()
    const [modal,setModal] = useState(false)
    const [listOnCreate,setListOnCreate] = useState([])

    return(
        <Main>
            <Container>
                <Text text={'Estas creando una rutina:'}/>
                <button
                onClick={() => redirect('/')}
                >Salir</button>
            </Container>
            <Form 
            textSubmit='Crear rutina'>
                {listOnCreate.length == 0 ? 
                
                    <Text text='No has agregado ningun ejercicio'/>    
                    :
                    <ListExercisesOnPlay array={listOnCreate}/>
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
        </Main>
    )
}

export {CreateRoutine}