import React, { useEffect, useState } from "react"
import { Container } from "../generals/Container"
import { FormControl } from "../Form/FormControl"
import { Form } from "../Form/Form"
import { ChangeSign } from "./ChangeSign"
import { Main } from "../generals/Main"

import { USER_SIGN_IN } from "../../data/mutations"
import { useMutation } from "@apollo/client"
import Cookies from "universal-cookie/es6"
import { useNavigate } from "react-router-dom"



const SingIn = ({ setID }) => {
    const navigate = useNavigate()
    const cookies = new Cookies()
    const [userSignIn] = useMutation(USER_SIGN_IN)

    const [dataFormLogin, setDataFormLogin] = useState({
        user: '',
        pass: ''
    })
    const [error, setError] = useState([]),
        [loading, setLoading] = useState(false)

    const handleChange = (e, name) => {
        const newData = { ...dataFormLogin };
        newData[name] = e.target.value
        setDataFormLogin(newData)
    }

    const handleSubmit = async event => {
        event.preventDefault()
        setLoading(true)
        await userSignIn({
            variables: {
                input: {
                    ...dataFormLogin
                }
            }
        }).then(async ({ data }) => {
            const {success, token } = data.userSignIn
            if (success) {
                cookies.set( 'session-token', token , {
                    path: '/',
                    maxAge:86400
                })
                navigate('/')
            }
        })
    }

    useEffect(() => {
        setError([])
    }, [dataFormLogin])

    return (
        <Main>
            {error.length > 0 &&
                <p
                    style={{ color: 'red' }}
                >{error[0]}</p>}
            <Form
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

export { SingIn }






/*  const handleSubmit = async (e) => {
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
    } */