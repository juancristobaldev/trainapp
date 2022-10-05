import React from "react";
import { IoMdClose } from "react-icons/io";
import { GET_EXERCISES_BY_TOKEN } from "../../data/query";
import { useExercises } from "../../hooks/useExercises";
import { useList } from "../../hooks/useList";
import { Form } from "../Form/Form";
import { FormControl } from "../Form/FormControl";
import { Options } from "../Form/Options";
import { Button } from "../generals/Button";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import { Create } from "./Create";



const CreateExercise = ({token,objectState}) => {
    
    const {state,setState} = objectState

    const {
        listForSelect,
        updateListForSelect,
    } = useList ("exercises",{state:state,updateState:setState},false,{ nameGql:"getExercisesByToken",gql:GET_EXERCISES_BY_TOKEN,variables:{ variables:{ token:token } } })

    const {
        errors,
        handleChange,
        createNewExercise,
    } = useExercises(token,{list:listForSelect,updateList:updateListForSelect},{stateValue:state,setState:setState})
    console.log(errors.alreadyExist)
    
    return (
        <Create
                className={'modal-create-exercise'}
                >
                    <Container className={'header-create'}>
                        <Text text='Estas creando un ejercicio:'/>
                        <Container className={'close-button'}>
                            <IoMdClose
                            onClick={() => setState({ ...state, modalCreate:false, modal:true})}
                            />
                        </Container>
                    </Container>
                    <Form
                    className={'form-create'}
                    onSubmit={createNewExercise}
                    textSubmit="Crear"
                    >
                        <FormControl
                        error={[errors.name,errors.alreadyExist]}
                        className={'name-input-create'}
                        label="Nombre ejercicio:"
                        typeControl="input"
                        name="name"
                        type="text"
                        onChange={handleChange}
                        />
                        <FormControl
                        className={'muscle-input-create'}
                        label="Musculos implicados:"
                        typeControl="select"
                        name="muscleEx"
                        onChange={handleChange}
                        >
                            <Options 
                            arrayOptions={
                                ['Espalda','Pectoral','Hombro','Abdomen','Biceps','Triceps']
                            } 
                            />
                        </FormControl>
                        <FormControl
                        className={'type-input-create'}
                        label="Tipo de ejercicio:"
                        typeControl="select"
                        name="typeEx"
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
    )
}

export {CreateExercise}