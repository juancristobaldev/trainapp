import React, { useEffect, useState } from "react"
import { FormControl } from "../Form/FormControl"
import { Form } from "../Form/Form"
import { ChangeSign } from "./ChangeSign"
import { Main } from "../generals/Main"

import { USER_SIGN_IN } from "../../data/mutations"
import { useMutation } from "@apollo/client"
import Cookies from "universal-cookie/es6"

import "../../styles/SignIn.scss"
import "../../styles/responsive/SignIn.scss"
import { Container } from "../generals/Container"

const SingIn = () => {

    const cookies = new Cookies()
    const [userSignIn] = useMutation(USER_SIGN_IN)

    const [dataFormLogin, setDataFormLogin] = useState({
        user: '',
        pass: ''
    })
    const [error, setError] = useState({}),
    [loading, setLoading] = useState(false)

    const handleChange = (e, name) => {
        const newData = { ...dataFormLogin };
        newData[name] = e.target.value
        setDataFormLogin(newData)
    }

    const handleSubmit = async event => {
        event.preventDefault()
        setLoading(true)

        const {user,pass} = dataFormLogin,
        newErrors = {};
        
        if(!user) newErrors.user = 'Ingresa un nombre de usuario.'
        if(!pass) newErrors.pass = 'Ingresa una contraseña.'

        const errorsArray = Object.values(newErrors)

        if(errorsArray.length === 0){
            await userSignIn({
                variables: {
                    input: {
                        ...dataFormLogin
                    }
                }
            }).then(async ({ data }) => {
                const {success, errors, token } = data.userSignIn
                if (success) {
                    cookies.set( 'session-token', token , {
                        path: '/',
                        maxAge:86400
                    })
                    window.location.reload()
                }else{
                    setError(JSON.parse(errors))
                }
                
            })
        }else{
            setError({...newErrors})
        }
    }
    console.log(error)

    useEffect(() => {
        setError([])
    }, [dataFormLogin])

    return (
        <>
        <Main
        className={'main-signin'}
        
        >
            <Form
                autoComplete={"off"}
                className={'form-signin'}
                textSubmit="Iniciar sesion"
                onSubmit={handleSubmit}
                alter={true}
                onAlter={() => 
                    <ChangeSign
                        className={'alter-form'}
                        text={'¿No tienes cuenta?'}
                        textButton={'Crea una cuenta aqui'}
                        route={'/signup'}
                    />
                }
            >
                <Container
                className={'header-signin'}
                >
                    <h1>Iniciar sesion</h1>
                </Container>
                <FormControl
                    autoComplete={'new-user'}
                    error={[error.user_auth]}
                    className={'div-input user'}
                    typeControl='input'
                    type="text"
                    label="Usuario:"
                    name='user'
                    onChange={handleChange}
                />
                <FormControl
                    error={[error.user_pass]}
                    className={'div-input pass'}
                    typeControl='input'
                    type="password"
                    label="Contraseña:"
                    name='pass'
                    onChange={handleChange}
                />
            </Form>
            <Container className="container-doit">
                <p className="p-doit"><span>Do</span>It</p>
            </Container>
        </Main>
        </>
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