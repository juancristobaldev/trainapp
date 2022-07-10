import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie/es6";
import { Navigate } from "react-router-dom";
import { Container } from "./Container";

const Dashboard = () => {
    const cookies = new Cookies();
    const dataUser = cookies.get('user');

    const {name} = dataUser

    const closeSesion = async () => {
        await cookies.remove('user')
        window.location.reload()
    }

    if( dataUser ){
        return(
            <Container>
                <h1>Hola {name}</h1>
                <button
                onClick={() => closeSesion()}
                >Cerrar sesion</button>
            </Container>
        )
    }else{
        <Navigate to="/signin" />
    }
}

export {Dashboard}