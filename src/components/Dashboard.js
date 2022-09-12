import React, { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie/es6";
import { useNavigate, Navigate } from "react-router-dom";
import { Container } from "./generals/Container";
import { Main } from "./generals/Main";
import { Section } from "./generals/Section";
import { Routine } from "./Routine";

import { ImHome,ImProfile } from "react-icons/im"
import {IoDocumentTextSharp} from "react-icons/io5"
import {GiHamburgerMenu} from "react-icons/gi"
import {RiDeleteBin2Fill,RiFoldersFill} from "react-icons/ri"
import {MdDarkMode,MdLightMode,MdClose} from "react-icons/md"
import {BsFillDoorOpenFill} from "react-icons/bs"
import {AiOutlineSearch} from "react-icons/ai"


import '../styles/Dashboard.scss'

import { Title } from "./Title";
import { Button } from "./generals/Button";
import { Text } from "./generals/Text";
import { ListApi } from "./Lists/ListApi";
import { Switch } from "@mui/material";
import { DataContext } from "../context/DataProvider";
import { Loading } from "./Loading";

import { useMutation } from "@apollo/client";
import { DELETE_ROUTINE } from "../data/mutations";
import { GET_ROUTINES_AND_USER_BY_TOKEN } from "../data/query";
import { Modal } from "./Modal/Modal";
import { ButtonIcon } from "./ButtonIcon";
import { InputSearch } from "./InputSearch";

const Dashboard = ({viewMode,updateRoutineOnPlay}) => {
    const navigate = useNavigate()

    const cookies = new Cookies();
    const token = cookies.get('session-token');

    const [loading,setLoading] = useState(false),
    [error,setError] = useState(null),
    [stateNav,updateStateNav] = useState('none'),
    [modalDelete,updateModalDelete] = useState({ boolean:false, item:{id:null,name:null}}),
    [view , updateView ] = useState('home'),
    [deleteRoutine] = useMutation(DELETE_ROUTINE);
    
    const listEmpty = [];

    const {
        routines,
        me,
        loadingData
    } = useContext(DataContext)

    const {darkMode,updateDarkMode} = viewMode
    
    const closeSesion = async () => {
        await cookies.remove('session-token')
        window.location.reload()
    }

    const deleteRoutineDB = async (id) => {
        const inputVariables = {
            token:token,
            id:id
        }

        await deleteRoutine({
            variables:{
                input:{
                    ...inputVariables
                }
            },
            refetchQueries:[{query:GET_ROUTINES_AND_USER_BY_TOKEN,variables:{
                token:token
            }}]
        }).then( ({data}) => {
            const { errors, success } = data.deleteRoutine
            if(errors) console.log(errors)
            if(success){
                console.log('Rutina eliminada con exito')
                updateModalDelete({boolean:false,item:{name:null,id:null}})
            }
        })

    }

    console.log(me)

    if(token){
        return(
            <Main 
            style={
                    darkMode ? 
                    {backgroundColor:'#082032',
                    color:"white"}
                    :
                    {background:'white'}
            } 
            className={`main-dashboard ${darkMode && "darkMode"}`}
            >
                {loadingData && 
                    <Loading/>
                }
                {!loadingData &&
                    <>
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
                                fill={darkMode ? 'white' : 'black'}
                                cursor={'pointer'}
                                onClick={() => updateStateNav('unactived')}
                                />
                            </Container>
                            <ButtonIcon
                            icon={<ImHome/>}
                            onClick={() => {
                                updateStateNav('unactived')
                                updateView('home')
                            }}
                            classNameContainer={'button-menu home'}
                            textButton={'Inicio'}
                            />
                            <ButtonIcon
                            icon={<IoDocumentTextSharp/>}
                            onClick={() => {
                                updateStateNav('unactived')
                                updateView('routines')
                            }}
                            classNameContainer={'button-menu'}
                            textButton={'Rutinas'}
                            />
                            <ButtonIcon
                            icon={<RiFoldersFill/>}
                            onClick={() => {
                                updateStateNav('unactived')
                                updateView('folders')
                            }}
                            classNameContainer={'button-menu'}
                            textButton={'Carpetas'}
                            />
                            <ButtonIcon
                            icon={<ImProfile/>}
                            onClick={() => {
                                updateStateNav('unactived')
                            }}
                            classNameContainer={'button-menu'}
                            textButton={'Mi perfil'}
                            />
                            <ButtonIcon
                            icon={<BsFillDoorOpenFill/>}
                            classNameContainer={'button-menu'}
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
                                    darkMode ? '#e94560' : undefined
                                }
                                />
                            </Container>
                    </Container>
                </nav>
                {
                    view === 'home'&&
                    <Section
                    className={'home'}>
                        <Container className="container-user-dashboard">
                            <h2>¡Hola {me.first_name}!</h2>
                            <Text
                            text={'¿Que entrenaras hoy?'}
                            />
                        </Container>
                        <Container
                        className={'header-last-workouts'}
                        >
                            <Text
                            text={'Tus ultimos entrenamientos:'}
                            />
                        </Container>
                        <ListApi className={'list-last-routines'}
                        error={error}
                        loading={loading}
                        data={me.last_workouts === undefined ? [] : JSON.parse(me.last_workouts)}
                        onError={() => <Text text={'Ooops hay un error...'}/>}
                        onLoading={() => <Text text={'Cargando...'}/>}
                        onEmpty={() => 
                            <Container
                            style={{
                                height:"100%",
                                display:"flex"
                            }}>
                                <Text style={
                                {width:'100%',
                                placeSelf: "center",
                                textAlign: 'center', 
                                opacity:'40%'
                                }} 
                                text={'No has utilizado ninguna rutina 🏋️'} />
                            </Container>
                        }
                        render={routine =>
                            <Routine
                                key={routine.id}
                                >
                                    <Container
                                    className={`routine-container
                                    ${darkMode && "darkMode"}`}>
                                        <Container className={"routine-container-header"}>
                                        <Text text={routine.nameRoutine}/>
                                        </Container>
                                        <Container className={'routine-container-stats'}>
                                            <Text text={`Record 🎉: ${routine.timeRecord}`}/>
                                            <Text text={`Veces realizadas: ${routine.dones}`} />
                                        </Container>
                                        <Container className={'routine-container-button'}>
                                            <Button
                                            onClick={() => {
                                                navigate('/go-routine')
                                                updateRoutineOnPlay({active:true, id:routine.id, routine:routine})
                                            }}
                                            textButton={'Empezar rutina'}
                                            />
                                        </Container>
                                    </Container>
                                </Routine>
                        }
                        />
                        <Container className={'footer'}>
                        </Container>
                    </Section>
                }
                {
                    view === "routines" && 
                    <Section
                    className={'routines'}
                    >
                        <Section className='section-add-routine'>
                            <Title onClick={() => navigate('/create-routine')} buttonText={'Nuevo'}>Rutinas</Title>
                        </Section>
                        <InputSearch
                        classNameDiv={'div-search'}
                        classNameSpan={'design-search'}
                        textSearch={'Buscar rutina...'}
                        />
                        <ListApi
                        className={`section-list-routines 
                        ${darkMode && "darkMode"}`}
                        error={error}
                        loading={loading}
                        data={routines}
                        onError={() => <Text text={'Ooops hay un error...'}/>}
                        onLoading={() => <Text text={'Cargando...'}/>}
                        onEmpty={() => 
                        
                            <Container
                            style={{width:"100%",
                            height:"100%",
                            display:"flex"
                            }}>
                                <Text style={
                                {width:'100%',
                                alignSelf: "center",
                                textAlign: 'center', 
                                opacity:'40%'
                                }} 
                                text={'Crea tu primera rutina 🏋️'} />
                            </Container>
                        }
                            render={ routine => (
                                <Routine
                                key={routine.id}
                                >
                                    <Container
                                    className={`routine-container
                                    ${darkMode && "darkMode"}`}>
                                        <Container className={"routine-container-header"}>
                                        <Text text={routine.nameRoutine}/>
                                        <ButtonIcon
                                        classNameContainer={'delete-button'}
                                        textButton={'Eliminar'}
                                        onClick={() => updateModalDelete({boolean:true,item:{id:routine.id,name:routine.nameRoutine}})}
                                        icon={<RiDeleteBin2Fill/>}
                                        />
                                    </Container>
                                    <Container className={'routine-container-stats'}>
                                        <Text text={`Record 🎉: ${routine.timeRecord}`}/>
                                        <Text text={`Veces realizadas: ${routine.dones}`} />
                                    </Container>
                                    <Container className={'routine-container-button'}>
                                        <Button
                                        onClick={() => {
                                            navigate('/go-routine')
                                            updateRoutineOnPlay({active:true, id:routine.id, routine:routine})
                                        }}
                                        textButton={'Empezar rutina'}
                                        />
                                    </Container>

                                    </Container>
                                </Routine>
                            )}
                            />
                    </Section>
                }
                {
                    view === "folders" && 
                    <Section
                    className={'folders'}
                    >
                        <Section className='section-add-folder'>
                        <Title buttonText={'Nuevo'}>Tus carpetas</Title>
                        </Section>
                        <InputSearch
                        classNameDiv={'div-search'}
                        classNameSpan={'design-search'}
                        textSearch={'Buscar rutina...'}
                        />
                        <Section className='list-folders'>
                            
                        </Section>
                    </Section>
                }
                { modalDelete.boolean && 
                    <Modal>
                        <Container className={'back delete'}/>
                        <Container className={'modal-delete'}>
                            <Container className={'container-text'}>
                                <Text text={'¿Estas seguro de eliminar la siguiente rutina?'}/>
                            </Container>
                            <Container className={'warning-text'}>
                                <Text text={'Se perdera todas tus estadisticas relacionadas a estas rutinas.'}/>
                            </Container>
                            <Container className={'routine-delete'}>
                                <Text 
                                style={{color:"red", fontStyle:"italic"}}
                                text={modalDelete.item.name}/>
                            </Container>
                            <Container className={'container-buttons'}>
                                <Button
                                className={'accept'}
                                onClick={() => deleteRoutineDB(modalDelete.item.id)}
                                textButton={'Aceptar'}
                                />
                                <Button
                                onClick={() => updateModalDelete({boolean:false})}
                                textButton={'Cancelar'}
                                />
                            </Container>
                        </Container>
                    </Modal>
                }
                    </>

                }
            </Main>
        )
    }else{
        <Navigate to="/signin" />
    }
}

export {Dashboard}