import React, { useEffect, useState } from "react"
import { Container } from "../generals/Container"
import { FormControl } from "../Form/FormControl"
import { Form } from "../Form/Form"
import { ChangeSign } from "./ChangeSign"
import { Main } from "../generals/Main"
import { CREATE_USER } from "../../data/mutations"
import { useMutation } from "@apollo/client"
import { useNavigate } from "react-router-dom"

import "../../styles/SignUp.scss"
import "../../styles/responsive/SignUp.scss"
import { Text } from "../generals/Text"



const SingUp = () => {
    const navigate = useNavigate()

    const [createUser] = useMutation(CREATE_USER)
    const [typeForm,setForm] = useState('about-u')

    const [dataFormRegister, setDataFormRegister] = useState({
        "user": "",
        "first_name": "",
        "last_name": "",
        "date": "",
    })
    const [dataFormRegisterTwo, setDataFormRegisterTwo] = useState({
        "email": "",
        "pass": "",
        "passConfirm": ""
    })
    const [errors,setErrors] = useState([])
    
    const handleChange = (e,state,setState) => {
        const newData = {...state};
        newData[e.target.name] = e.target.value  
        setState(newData)
    }
    

    const handleSubmit = async (e,stage) => {
        e.preventDefault()
        const dataFusion = Object.assign({}, dataFormRegister, dataFormRegisterTwo)
        const { first_name, last_name,user,email,pass,passConfirm } = dataFusion,
        objectErrors = {};

        if(stage === "first"){
            if(!first_name) objectErrors.first_name = 'Debes escribir un nombre.';
            if(!last_name) objectErrors.last_name = 'Debes escribir un apellido.';
        }else{
            if(!user) objectErrors.user = 'Debes escribir un usuario.';
            if( !email || !email.includes("@") || !email.includes(".")){
                objectErrors.email = 'Debes escribir un email valido.';
            }
            if(!pass) objectErrors.pass = 'Debes escribir una contraseña.';
            if(pass !== passConfirm || !pass) objectErrors.passConfirm = 'Las contraseñas deben coincidir.';
        }
        if(Object.values(objectErrors).length === 0){
            const dataForm = {...dataFusion}
            delete dataForm.passConfirm
            if(stage === 'first'){
                setForm('auth')
            }else{
                await createUser({
                    variables: {
                        input:{
                            ...dataForm,
                        }
                    }
                }).then( async ({data}) => {
                    const {errors,success} = data.createUser
                    if(errors.length){
                        setErrors(JSON.parse(errors))
                    }
                    console.log(success)
                    if(success){
                        navigate('/signin')
                    }
                })
            }
        }
        else{
            setErrors(objectErrors)
        }

    }

    useEffect(() => {
        setErrors({})
    },[dataFormRegister])

    return(
        <>
        <Main className={'main-signup'}>
            {typeForm === 'about-u' ?
            <>
            <Form
            className={`form-signup ${typeForm === 'about-u' ? 'about-u' : 'auth'}`}
            onSubmit={typeForm === 'about-u' ? e => handleSubmit(e,'first') : e => handleSubmit(e,'two')}
            textSubmit="Registrarse"
            alter={true}
            onAlter={() => 
                <ChangeSign
                className={'alter-form'}
                text={'¿Ya tienes cuenta?'}
                textButton={'Inicia sesion aqui'}
                route={'/signin'}
                />
            }
            >
                <Container className={'header-signup'}>
                    <h1>Registrate</h1>
                    <h3>Sobre tí</h3>
                </Container>
                <FormControl
                    error={[errors.first_name]}
                    className={'div-input first-name'}
                    typeControl='input'
                    type="text"
                    name="first_name"
                    label="Nombre:"
                    onChange={(e) => handleChange(e,dataFormRegister,setDataFormRegister)}

                />
                <FormControl
                    error={[errors.last_name]}
                    className={'div-input last-name'}
                    typeControl='input'
                    type="text"
                    name="last_name"
                    label="Apellido:"
                    onChange={(e) => handleChange(e,dataFormRegister,setDataFormRegister)}
                />
                <FormControl
                    error={[errors.date]}
                    className={'div-input date'}
                    typeControl='input'
                    type="date"
                    label="Fecha de nacimiento:"
                    name="date"
                    onChange={(e) => handleChange(e,dataFormRegister,setDataFormRegister)}
                />
            </Form>
            </>
            :
            <Form
            autoComplete="off"
            className={`form-signup ${typeForm === 'about-u' ? 'about-u' : 'auth'}`}
            onSubmit={typeForm === 'about-u' ? e => handleSubmit(e,'first') : e => handleSubmit(e,'two')}
            textSubmit="Registrarse"
            alter={true}
            onAlter={() => 
                <ChangeSign
                className={'alter-form'}
                text={'¿Ya tienes cuenta?'}
                textButton={'Inicia sesion aqui'}
                route={'/signin'}
                />
            }
            >
                <Container className={'header-signup'}>
                    <h1>Registrate</h1>
                    <h3>Autenticacíon</h3>
                </Container>
                <FormControl
                    error={[errors.user,errors.user_exist]}
                    className={'div-input user'}
                    typeControl='input'
                    type="text"
                    label="Usuario:"
                    name="user"
                    onChange={(e) => handleChange(e,dataFormRegister,setDataFormRegister)}
                />
                <FormControl
                    error={[errors.email,errors.email_exist]}
                    className={'div-input email'}
                    typeControl='input'
                    type="text"
                    label="Email:"
                    name="email"
                    onChange={(e) => handleChange(e,dataFormRegisterTwo,setDataFormRegisterTwo)}
                    />
                <FormControl
                    error={[errors.pass]}
                    className={'div-input pass'}
                    typeControl='input'
                    type="password"
                    label="Contraseña:"
                    name="pass"
                    onChange={(e) => handleChange(e,dataFormRegisterTwo,setDataFormRegisterTwo)}
                />
                <FormControl
                    error={[errors.passConfirm]}
                    className={'div-input pass-confirm'}
                    typeControl='input'
                    type="password"
                    label="Confirma tu contraseña:"
                    name="passConfirm"
                    onChange={(e) => handleChange(e,dataFormRegisterTwo,setDataFormRegisterTwo)}
                />
            </Form>
            }
            <Container className="container-doit">
                <h4>WorkOut App</h4>
            </Container>
        </Main>
        </>
    )
}

export {SingUp}
