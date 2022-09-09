import React from "react";
import { useExercises } from "../../hooks/useExercises";
import { useListExercises } from "../../hooks/useListExercises";
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
        listExercisesSelect,
        setListExercisesSelect,
    } = useListExercises (token,{state:state,updateState:setState},state.listOnCreate)

    const {
        errors,
        handleChange,
        createNewExercise,
    } = useExercises(token,{list:listExercisesSelect,updateList:setListExercisesSelect},{stateValue:state,setState:setState})
    console.log(errors.alreadyExist)
    
    return (
        <Create
                className={'modal-create-exercise'}
                >
                    <Container className={'header-create'}>
                        <Text text='Estas creando un ejercicio:'/>
                        <Button
                        onClick={() => setState({ ...state, modalCreate:false, modal:true})}
                        textButton={'Cerrar'}
                        />
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
                        name="nameEx"
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