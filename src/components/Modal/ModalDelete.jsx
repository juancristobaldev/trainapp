import React from "react";
import { GET_EXERCISES_BY_TOKEN } from "../../data/query";
import { useExercises } from "../../hooks/useExercises";
import { useList } from "../../hooks/useList";
import { Button } from "../generals/Button";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";

const ModalDelete = ({token,objectState,exercise}) => {

    const {state,setState} = objectState

    console.log(exercise)

    const {
        listForSelect,
        updateListForSelect,
    } = useList("exercises",{state:state,updateState:setState},false,{ nameGql:"getExercisesByToken",gql:GET_EXERCISES_BY_TOKEN,variables:{ variables:{ token:token } } })


    const {
        deleteSomeExercise
    } = useExercises(token,{list:listForSelect,updateList:updateListForSelect},{stateValue:state,setState:setState})


    return (
        <Container className={`modal-delete ${exercise && 'exercise'}`}>
                <Container
                className={'container-text'}
                >
                    <Text text={'¿Estas seguro que deseas eliminar los siguientes ejercicios?'}/>
                </Container>
                {exercise && 
                    <Container className={'text-warning'}>
                        <Text text={'Al eliminar estos ejercicios no se eliminiran de tus rutinas creadas, pero ya no podras seleccionarlo para rutinas futuras.'}/>
                    </Container>
                }
                <Container className={'list-exercises-delete'}>
                    {state.modalDelete.items.map(item =>
                        <Text 
                        key={item.name}
                        text={item.name} 
                        style={{ color:'red'}}
                        />
                    )}
                </Container>
                <Container className={'container-buttons'}>
                    <Button 
                    className={'cancel'}
                    textButton={'Cancelar'}
                    onClick={() => setState({...state, modal: true, modalDelete:{
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