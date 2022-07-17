import React from "react";
import Cookies from "universal-cookie/es6";
import { useNavigate, Navigate } from "react-router-dom";
import { Container } from "./generals/Container";
import { Main } from "./generals/Main";
import { Section } from "./generals/Section";
import { useApi } from "../hooks/useApi";

const Dashboard = () => {
    const cookies = new Cookies();

    const dataUser = cookies.get('user');
    const {id,name} = dataUser


    const closeSesion = async () => {
        await cookies.remove('user')
        window.location.reload()
    }
    const {data} = useApi(`http://localhost:3001/api/select/routines/user/${id}`)

    console.log(data)

    const navigate = useNavigate()

    if( dataUser ){
        return(
            <Main>
                <Section>
                    <h1>Hola {name}</h1>
                </Section>
                <Section>
                    <p>Tus rutinas</p>
                    <button
                    onClick={() => navigate('/create-routine')}
                    >Crear rutina</button>
                </Section>
                <Section>
                    
                </Section>
                <Section>
                                <button
                                onClick={() => closeSesion()}
                                >Cerrar sesion</button>
                </Section>
            </Main>
        )
    }else{
        <Navigate to="/signin" />
    }
}

export {Dashboard}