import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie/es6";
import { useNavigate, Navigate } from "react-router-dom";
import { Container } from "./generals/Container";
import { Main } from "./generals/Main";
import { Section } from "./generals/Section";
import { Routine } from "./Routine";
import {GiHamburgerMenu} from "react-icons/gi"


import '../styles/Dashboard.scss'
import { Title } from "./Title";
import { Button } from "./generals/Button";
import { List } from "./Lists/List";
import { useGet } from "../hooks/useGet";
import { Text } from "./generals/Text";
import { BsThreeDots } from "react-icons/bs";
import { GrFormClose } from "react-icons/gr";

const Dashboard = () => {

    const [opensModals,setOpenModals] = useState([])

    const cookies = new Cookies();

    const dataUser = cookies.get('user');
    const { id } = dataUser
    
    const closeSesion = async () => {
        await cookies.remove('user')
        window.location.reload()
    }

    const { data,loading,error } = useGet(`http://localhost:3001/api/select/routines/user/${id}`)

    const navigate = useNavigate()

    if(!loading && opensModals.length !== data.length){
        const modals = [...opensModals]
        if(data.length > 0){
            data.map(item => 
                modals.push({id:item.name,status:false})  
            )
            setOpenModals(modals)
        }
    }

    const openModal = (name) => {
        const index = opensModals.findIndex(item => item.id === name)
        const newModals = [...opensModals]

        newModals[index].status = true
        setOpenModals(newModals)
    }

    if( dataUser ){
        return(
            <Main>
                <Section>
                    <Container>Hola</Container>
                    <GiHamburgerMenu/>
                </Section>
                <Section>
                    <Title onClick={() => navigate('/create-routine')} buttonText={'Nuevo'}>Tus rutinas</Title>
                </Section>
                <Section>
                    <List>
                        {loading && <p>Loading...</p>}
                        {error && <p>Oops hay un error</p>}
                        {data.length > 0 &&
                            data.map(item => 
                                <Routine
                                className="routine-container"
                                key={item.id}
                                >
                                        <Container className={"routine-container-header"}>
                                            <Text text={item.name}/>
                                            <BsThreeDots
                                            onClick={() => openModal(item.name)}
                                            />
                                            {opensModals.length > 0 && 
                                                opensModals[opensModals.findIndex(modal => modal.id === item.name)].status && 
                                                    <Container className="modal-routine">
                                                        <Container className='modal-routine-header'>
                                                            <Text text={'Menu'}/>
                                                            <GrFormClose
                                                            cursor={'pointer'}/>
                                                        </Container>
                                                        <Text className={'delete'} text='Eliminar'/>
                                                        <Text text='Modificar'/>
                                                    </Container>
                                                
                                            }
                                        </Container>
                                        <Container>
                                            <Text text={item.dones}/>
                                            <Text text={item.timeRecord}/>
                                            <Button
                                            textButton={'Seleccionar'}
                                            />
                                        </Container>
                                </Routine>
                            )
                        }
                    </List>
                </Section>
                <Section>
                    <Button
                    textButton={'Cerrar sesion'}
                    onClick={() => closeSesion()}
                    />
                </Section>
            </Main>
        )
    }else{
        <Navigate to="/signin" />
    }
}

export {Dashboard}