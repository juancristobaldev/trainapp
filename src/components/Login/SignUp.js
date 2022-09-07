import React, { useEffect, useState } from "react"
import { Container } from "../generals/Container"
import { FormControl } from "../Form/FormControl"
import { Form } from "../Form/Form"
import { ChangeSign } from "./ChangeSign"
import { Main } from "../generals/Main"
import { getErrorsForm } from "../functions/getFormsError"

import { CREATE_USER } from "../../data/mutations"
import { useMutation } from "@apollo/client"
import { useNavigate } from "react-router-dom"



const SingUp = () => {
    const navigate = useNavigate()

    const [createUser] = useMutation(CREATE_USER)
    const [loading,setLoading] = useState(false)

    const [dataFormRegister, setDataFormRegister] = useState({
        "user": "",
        "first_name": "",
        "last_name": "",
        "email": "",
        "date": "",
        "pass": ""
    })
    
    const [errors,setErrors] = useState([])

    const [success,setSucess] = useState({success:false,message:null})
    
    const handleChange = (e) => {
        const newData = {...dataFormRegister};
        newData[e.target.name] = e.target.value  
        setDataFormRegister(newData)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { first_name, last_name,user,email,pass,passConfirm } = dataFormRegister

        const posiblyErrors = [
            {property:last_name,error:'Debes escribir un apellido'},
            {property:first_name,error:'Debes escribir un nombre'},
            {property:user,error:'Debes escribir un usuario'},
            {property:email,error:'El email es obligatorio'},
            {property:pass, error:'Debes escribir una contraseña'}
        ]

        const {errorsForm} = getErrorsForm(posiblyErrors)
        if(pass !== passConfirm) errorsForm.push('Las contraseñas deben coincidir')

        if(errorsForm.length === 0){
            const dataForm = {...dataFormRegister}
            delete dataForm.passConfirm
            
            await createUser({
                variables: {
                    input:{
                        ...dataForm
                    }
                }
            }).then( async ({data}) => {
                const {errors,success} = data.createUser
                if(errors.length){
                    setErrors(JSON.parse(errors))
                }
                if(success){
                    navigate('/signin')
                }
            })
        }
        else{
            setErrors(errorsForm)
        }

    }

    useEffect(() => {
        setErrors([])
    },[dataFormRegister])

    return(
        <Main>
            <Form
            onSubmit={handleSubmit}
            textSubmit="Registrarse"
            >
                {errors.length > 0 && 
                    errors.map(item => 
                        <p
                        style={{color:"red"}}
                        key={item}
                        >{item}</p>
                    )
                }
                <FormControl
                    typeControl='input'
                    type="text"
                    label="Usuario:"
                    name="user"
                    onChange={handleChange}
                />
                <FormControl
                    typeControl='input'
                    type="text"
                    name="first_name"
                    label="Nombre:"
                    onChange={handleChange}
                />
                <FormControl
                    typeControl='input'
                    type="text"
                    name="last_name"
                    label="Apellido:"
                    onChange={handleChange}
                />
                <FormControl
                    typeControl='input'
                    type="email"
                    label="Email:"
                    name="email"
                    onChange={handleChange}
                />
                <FormControl
                    typeControl='input'
                    type="date"
                    label="Fecha de nacimiento:"
                    name="date"
                    onChange={handleChange}
                />
                <FormControl
                    typeControl='input'
                    type="password"
                    label="Contraseña:"
                    name="pass"
                    onChange={handleChange}
                />
                <FormControl
                    typeControl='input'
                    type="password"
                    label="Confirma tu contraseña:"
                    name="passConfirm"
                    onChange={handleChange}
                />
            </Form>
            <ChangeSign
                text={'¿Ya tienes cuenta?'}
                textButton={'Inicia sesion aqui'}
                route={'/signin'}
                />
        </Main>
    )
}

export {SingUp}
