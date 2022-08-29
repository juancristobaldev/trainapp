import React from "react";
import { useExercises } from "../../hooks/useExercises";
import { useListExercises } from "../../hooks/useListExercises";
import { Button } from "../generals/Button";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";

const ModalDelete = ({token,objectState}) => {

    const {state,setState} = objectState

    const {
        listExercisesSelect,
        setListExercisesSelect,
    } = useListExercises (token,{state:state,updateState:setState},state.listOnCreate)


    const {
        deleteSomeExercise,
        modalDelete,
        setModalDelete,
    } = useExercises(token,{list:listExercisesSelect,updateList:setListExercisesSelect},{stateValue:state,setState:setState})


    return (
        <Container className={'modal-delete'}>
                <Container
                className={'container-text'}
                >
                    <Text text={'¿Estas seguro que deseas eliminar los siguientes ejercicios?'}/>
                </Container>
                <Container className={'list-exercises-delete'}>
                    {state.modalDelete.items.map(item =>
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
                    onClick={() => setState({...state, modalDelete:{
                        boolean:false,
                        items:true
                    }})}
                    />
                    <Button 
                    className={'accept'}
                    textButton='Aceptar'
                    onClick={() => deleteSomeExercise(true,state.modalDelete.items)}/>
                </Container>
            </Container>
    )
}

export {ModalDelete}