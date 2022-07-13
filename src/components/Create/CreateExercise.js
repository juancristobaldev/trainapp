import React, { useState } from "react";
import { Main } from "../generals/Main";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import { Form } from "../Form/Form";
import { FormControl } from "../Form/FormControl";
import { Options } from "../Form/Options";
import Cookies from "universal-cookie/es6";

const optionsMuscles = [
    'Espalda','Pectoral','Hombro','Abdomen','Biceps','Triceps'
]
const optionsTypes = [
    'Peso adicional','Peso asistido','Duracion','Solo rep'
];

const CreateExercise = ({modal,getExercises}) => {

    const cookies = new Cookies()
    const user = cookies.get('user')
    const {id} = user

    const [ dataFormCreate, setDataFormCreate ] = useState(
        {
            id:id,
            name:'',
            muscle:'Espalda',
            type:'Peso adicional'
        }
    )

    const handleChange = (e,name) => {
        const newData = {...dataFormCreate};
        newData[name] = e.target.value
        setDataFormCreate(newData)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestOption = {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataFormCreate)
        };

        const response = await fetch('http://localhost:3001/api/exercises/create-exercise', requestOption);
        response.json()
        .then(data => data ? 
            getExercises() :  console.log('error')
        )
    }

    return(
        <Main>
            <Container>
                <Text text='Estas creando un ejercicio:'/>
                <button onClick={() => modal(false) }>Cerrar</button>
            </Container>
            <Form
            onSubmit={handleSubmit}
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
                    arrayOptions={optionsMuscles} 
                    />
                </FormControl>
                <FormControl
                label="Tipo de ejercicio:"
                typeControl="select"
                name="type"
                onChange={handleChange}
                >
                    <Options 
                    arrayOptions={optionsTypes}
                    />
                </FormControl>
            </Form>
        </Main>
    )
}

export {CreateExercise}