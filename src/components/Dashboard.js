import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie/es6";
import { useNavigate, Navigate } from "react-router-dom";
import { Container } from "./generals/Container";
import { Main } from "./generals/Main";
import { Section } from "./generals/Section";
import { Routine } from "./Routine";
import {GiHamburgerMenu} from "react-icons/gi"

import '../styles/Popover.scss'

import Popover from '@mui/material/Popover';
import '../styles/Dashboard.scss'
import { Title } from "./Title";
import { Button } from "./generals/Button";
import { useGet } from "../hooks/useGet";
import { Text } from "./generals/Text";
import { BsThreeDots } from "react-icons/bs";
import {MdDarkMode,MdLightMode,MdClose} from "react-icons/md"
import { ListApi } from "./Lists/ListApi";

import { Switch } from "@mui/material";
import { color } from "@mui/system";

const Dashboard = ({viewMode}) => {
    const navigate = useNavigate()

    const cookies = new Cookies();
    const dataUser = cookies.get('user');
    const { id,name } = dataUser

    const { data,loading,error } = useGet(`http://localhost:3001/api/select/routines/user/${id}`)

    const [anchor,setAnchor] = useState(null)
    const [stateNav,updateStateNav] = useState('none')
    const {darkMode,updateDarkMode} = viewMode

    const openPopover = (event) => {
        setAnchor(event.currentTarget)
    }
    const handleClose = () => {
        setAnchor(null)
    }
    
    const closeSesion = async () => {
        await cookies.remove('user')
        window.location.reload()
    }

    if( dataUser ){
        return(
            <Main 
            style={
                    darkMode ? 
                    {backgroundColor:'#082032',
                    color:"white"}
                    :
                    {background:'white'}
            } 
            className={`main-dashboard ${darkMode && "darkMode"}`}>
                <nav className="section-nav-dashboard">
                    <Container className={'pic-nav'}>      
                    </Container>
                    <GiHamburgerMenu
                    cursor={'pointer'}
                    onClick={() => updateStateNav('actived')}
                    />
                    <Container className={`menu 
                    ${stateNav === 'none' && ''} 
                    ${stateNav === 'actived' && 'active'}
                    ${stateNav === 'unactived' && 'unactived'}
                    `}>
                            <Container className={'header-menu'}>
                                <Text
                                text={'Menu'}
                                />
                                <MdClose
                                fill={darkMode && 'white'}
                                cursor={'pointer'}
                                onClick={() => updateStateNav('unactived')}
                                />
                            </Container>
                            <Button
                            className={'button-menu'}
                            textButton={'Mi perfil'}
                            />
                            <Button
                            className={'button-menu'}
                            textButton={'Cerrar sesion'}
                            onClick={() => closeSesion()}
                            />
                            <Container className={'viewMode'}>
                                <MdLightMode
                                fill={
                                    !darkMode ?
                                    '#e94560' : 'white'
                                }
                                />
                                <Switch 
                                checked={darkMode}
                                onChange={() => updateDarkMode(!darkMode)}
                                />
                                <MdDarkMode
                                fill={
                                    darkMode && '#e94560'
                                }
                                />
                            </Container>
                    </Container>
                </nav>
                <Section className="section-user-dashboard">
                    <h2>¡Hola {name}!</h2>
                    <Text
                    text={'¿Que entrenaras hoy?'}
                    />
                </Section>
                <Section className='section-add-routine'>
                    <Title onClick={() => navigate('/create-routine')} buttonText={'Nuevo'}>Tus rutinas</Title>
                </Section>
                <ListApi
                    className={`section-list-routines 
                                ${darkMode && "darkMode"}`}
                    error={error}
                    loading={loading}
                    data={data}
                    onError={() => <Text text={'Ooops hay un error...'}/>}
                    onLoading={() => <Text text={'Cargando...'}/>}
                    onEmpty={() => <Text style={
                        {width:'100%',
                        placeSelf: "center",
                        textAlign: 'center', 
                        opacity:'40%'
                        }} 
                        text={'Crea tu primera rutina 🏋️'} />}
                    render={ routine => (
                        <Routine
                        key={routine.id}
                        >
                            <Container
                            className={`routine-container
                            ${darkMode && "darkMode"}`}>
                                <Container className={"routine-container-header"}>
                                <Text text={routine.name}/>
                                <BsThreeDots 
                                cursor={'pointer'}
                                onClick={openPopover}/>
                                <Popover
                                className="popover"
                                open={Boolean(anchor)}
                                anchorEl={anchor}
                                onClose={handleClose}
                                anchorOrigin={{
                                    horizontal: 'left',
                                  }}
                                >
                                    <Container className={'popover-menu'}>
                                        <Text text={'Menu'}/>
                                        <Text
                                        style={
                                            {color:'red',
                                            cursor:'pointer'}
                                        }
                                        text={'Eliminar'}/>
                                    </Container>
                                </Popover>
                            </Container>
                            <Container className={'routine-container-stats'}>
                                <Text text={`Record 🎉: ${routine.timeRecord}`}/>
                                <Text text={`Veces realizadas: ${routine.dones}`} />
                            </Container>
                            <Container className={'routine-container-button'}>
                                <Button
                                textButton={'Empezar rutina'}
                                />
                            </Container>

                            </Container>
                        </Routine>
                    )}
                    />
                <Section className='section-add-folder'>
                    <Title buttonText={'Nuevo'}>Tus carpetas</Title>
                </Section>
                <Section className='section-folders'>
                    
                </Section>
                <Section className={'footer'}>
                </Section>
            </Main>
        )
    }else{
        <Navigate to="/signin" />
    }
}

export {Dashboard}