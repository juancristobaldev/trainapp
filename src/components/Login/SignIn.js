import React, { useEffect, useState } from "react"
import { Container } from "../generals/Container"
import { FormControl } from "../Form/FormControl"
import { Form } from "../Form/Form"
import { ChangeSign } from "./ChangeSign"
import { Main } from "../generals/Main"

const SingIn = ({setID}) => {

    const [dataFormLogin, setDataFormLogin] = useState({
        name:'',
        user:''
    })

    const [error,setError] = useState([])

    
    const handleChange = (e,name) => {
        const newData = {...dataFormLogin};
        newData[name] = e.target.value
        setDataFormLogin(newData)
    }

    const setIdAndShow = (data) => {
        setID(data[0])
        console.log(data)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const requestOptions = {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataFormLogin)
        }

        const response = await fetch('http://localhost:3001/api/auth', requestOptions);

        response.json()
        .then(data => data[0].hasOwnProperty('error') ? 
            setError([data[0].message]) :  setIdAndShow(data)
        )
    }
    
    useEffect(() => {
        setError([])
    },[dataFormLogin])

    return(
        <Main>
            {error.length > 0 && 
            <p
            style={{color:'red'}}
            >{error[0]}</p>}
            <Form
            method="POST"
            textSubmit="Iniciar sesion"
            onSubmit={handleSubmit}
            >
                <FormControl
                    typeControl='input'
                    type="text"
                    label="Nombre:"
                    name='user'
                    onChange={handleChange}
                />
                <FormControl
                    typeControl='input'
                    type="password"
                    label="Contraseña:"
                    name='pass'
                    onChange={handleChange}
                />
            </Form>
            <ChangeSign
                text={'¿No tienes cuenta?'}
                textButton={'Crea una cuenta aqui'}
                route={'/signup'}
            />
        </Main>
    )
}

export {SingIn}
