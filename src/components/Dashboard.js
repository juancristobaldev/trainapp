import React from "react";
import Cookies from "universal-cookie/es6";
import { useNavigate, Navigate } from "react-router-dom";
import { Container } from "./generals/Container";

const Dashboard = () => {
    const cookies = new Cookies();
    const dataUser = cookies.get('user');

    const {name} = dataUser

    const closeSesion = async () => {
        await cookies.remove('user')
        window.location.reload()
    }

    const navigate = useNavigate()

    if( dataUser ){
        return(
            <React.Fragment>
                <Container>
                    <h1>Hola {name}</h1>
                    <button
                    onClick={() => closeSesion()}
                    >Cerrar sesion</button>
                </Container>
                <Container>
                    <p>Tus rutinas</p>
                    <button
                    onClick={() => navigate('/create-routine')}
                    >Crear rutina</button>
                </Container>
            </React.Fragment>

        )
    }else{
        <Navigate to="/signin" />
    }
}

export {Dashboard}