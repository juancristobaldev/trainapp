import React, { useEffect, useState } from "react"
import { Container } from "../generals/Container"
import { FormControl } from "../Form/FormControl"
import { Form } from "../Form/Form"
import { ChangeSign } from "./ChangeSign"
import { Main } from "../generals/Main"
import { getErrorsForm } from "../functions/getFormsError"



const SingUp = () => {

    const [dataFormRegister, setDataFormRegister] = useState({
        name:'',
        user:'',
        email:'',
        date:'',
        pass:'',
        passConfirm:''
    })
    
    const [errors,setErrors] = useState([])
    const [success,setSucess] = useState({success:false,message:null})
    
    const handleChange = (e,name) => {
        const newData = {...dataFormRegister};
        newData[name] = e.target.value  
        setDataFormRegister(newData)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { name,user,email,pass,passConfirm } = dataFormRegister

        const posiblyErrors = [
            {property:name,error:'Debes escribir un nombre'},
            {property:user,error:'Debes escribir un usuario'},
            {property:email,error:'El email es obligatorio'},
            {property:pass, error:'Debes escribir una contraseña'}
        ]

        const {errorsForm} = getErrorsForm(posiblyErrors)
        if(pass !== passConfirm) errorsForm.push('Las contraseñas deben coincidir')

        if(errorsForm.length === 0){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataFormRegister)
            };
            const response = await fetch('http://localhost:3001/api/users/create-user/', requestOptions);
            
            response.json()
            .then(data => data.error ? 
            setErrors(data.errors) : setSucess({success:true, message: 'Usuario creado con exito'})
            )
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
            method='POST'
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
                    name="name"
                    label="Nombre:"
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
