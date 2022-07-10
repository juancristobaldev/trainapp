import React, { useEffect, useState } from "react"
import { Container } from "../Container"
import { FormControl } from "../Form/FormControl"
import { Form } from "../Form/Form"
import { ChangeSign } from "./ChangeSign"



const SingUp = () => {

    const [dataFormRegister, setDataFormRegister] = useState({
        name:'',
        user:'',
        email:'',
        pass:'',
        passConfirm:''
    })
    
    const [errors,setErrors] = useState([])
    
    const handleChange = (e,name) => {
        const newData = {...dataFormRegister};
        newData[name] = e.target.value  
        setDataFormRegister(newData)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataFormRegister)
        };
        const response = await fetch('http://localhost:3001/api/users/create-user/', requestOptions);
        
        response.json()
        .then(data => setErrors(data))
    }

    useEffect(() => {
        setErrors([])
    },[dataFormRegister])

    return(
        <Container>
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
        </Container>
    )
}

export {SingUp}
