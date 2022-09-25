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
import { DELETE_ROUTINE, UPDATE_USER } from "../data/mutations";
import { GET_ROUTINES_AND_USER_BY_TOKEN, GET_USER } from "../data/query";
import { Modal } from "./Modal/Modal";
import { ButtonIcon } from "./ButtonIcon";
import { InputSearch } from "./InputSearch";
import { ContainerSearch } from "./ContainerSearch";
import { AddItem } from "./AddItem";

const Dashboard = ({viewMode,updateRoutineOnPlay}) => {
    const navigate = useNavigate()

    const cookies = new Cookies();
    const token = cookies.get('session-token');

    const [loading,setLoading] = useState(false),
    [error,setError] = useState(null),
    [stateNav,updateStateNav] = useState('none'),
    [modalDelete,updateModalDelete] = useState({ boolean:false, item:{id:null,name:null}}),
    [view , updateView ] = useState('home'),
    [searchValues,updateSearchValues] = useState({
        routines:'',
        folders:''
    }),
    [ widthScreen,updateWidthScreen ] = useState(window.innerWidth),
    [deleteRoutine] = useMutation(DELETE_ROUTINE),
    [updateUser] = useMutation(UPDATE_USER)

    console.log(widthScreen)

    const {
        routines,
        me,
        loadingData
    } = useContext(DataContext)

    const {darkMode,updateDarkMode} = viewMode

    const searchSomething = (e) => {
        updateSearchValues({ ...searchValues, [e.target.name]:e.target.value })
    }

    const closeSesion = async () => {
        await cookies.remove('session-token')
        window.location.reload()
    }

    const windowWidthChange = () => {
        updateWidthScreen(window.innerWidth);
    };
    
      window.addEventListener('resize', () => {
        windowWidthChange();
      });

    const deleteRoutineDB = async (id) => {
        const inputVariables = {
            token:token,
            id:id
        }

        let lastWorkOuts = [];
        if(me.last_workouts !== undefined){
            lastWorkOuts = JSON.parse(me.last_workouts)
            const index = lastWorkOuts.findIndex(item => item.id === inputVariables.id)
            if(index >= 0) lastWorkOuts.splice(index,1) 
        }

        await updateUser({
            variables:{
                input:{
                    id:me.id,
                    last_workouts:JSON.stringify([...lastWorkOuts])
                }
            },
            refetchQueries:[{GET_USER, variables:{
                token:token
            }}]
        })

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
            className={`main-dashboard ${darkMode && "darkMode"} ${widthScreen > 650 && "grid-web"}`}
            >
            {loadingData && 
                <Loading/>
            }
            {!loadingData && 
            <>
                <nav className={`section-nav-dashboard ${widthScreen > 650 && "nav-big-screen"}`}>
                    <Container className={'pic-nav'}>  
                    </Container>
                    <h3 className={`view ${widthScreen > 650 && "web"}`}>{view === "home" ? 'Inicio' : view === "routines" ? 'Tus rutinas' 
                        : view === "folders" ? "Tus carpetas" : "Mi perfil"}</h3>
                    {
                        widthScreen < 650 && 
                        <GiHamburgerMenu
                        cursor={'pointer'}
                        onClick={() => updateStateNav('actived')}
                        />
                    }
                </nav>
                <Container className={` menu ${ (widthScreen > 650) ? 'active web' :
                        stateNav === 'none' ? '' : stateNav === 'actived' ? 'active' :  'unactived' 
                        }
                    `}>
                            {
                                widthScreen < 650 &&
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
                            }
                            <ButtonIcon
                            icon={<ImHome/>}
                            onClick={() => {
                                updateStateNav('unactived')
                                updateView('home')
                            }}
                            classNameContainer={`button-menu home ${view === "home" && true}`}
                            textButton={'Inicio'}
                            />
                            <ButtonIcon
                            icon={<IoDocumentTextSharp/>}
                            onClick={() => {
                                updateStateNav('unactived')
                                updateView('routines')
                            }}
                            classNameContainer={`button-menu ${view === "routines" && true}`}
                            textButton={'Rutinas'}
                            />
                            <ButtonIcon
                            icon={<RiFoldersFill/>}
                            onClick={() => {
                                updateStateNav('unactived')
                                updateView('folders')
                            }}
                            classNameContainer={`button-menu ${view === "folders" && true}`}
                            textButton={'Carpetas'}
                            />
                            <ButtonIcon
                            icon={<ImProfile/>}
                            onClick={() => {
                                updateStateNav('unactived')
                            }}
                            classNameContainer={`button-menu ${view === "profile" && true}`}
                            textButton={'Mi perfil'}
                            />
                            <ButtonIcon
                            icon={<BsFillDoorOpenFill/>}
                            classNameContainer={`button-menu`}
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
                {
                    view === 'home' &&
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
                        <ListApi 
                        className={`list-last-routines ${ widthScreen > 650 && 'web'}`}
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
                                        <Text text={routine.name}/>
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
                        <ContainerSearch
                        searchValues={searchValues}
                        data={routines}
                        name={'routines'}
                        classContainer={'container-search'}
                        classDiv={'div-search'}
                        classSpan={'design-search'}
                        classList={`section-list-routines ${darkMode && "darkMode"}`}
                        textSearch={'Buscar rutina...'}
                        onChange={ e => searchSomething(e)}
                        onError={() => 
                            <Container className={'container-center'}>
                                <Text text={'Ooops hay un error...'}/>
                            </Container>
                        }
                        onLoading={() => 
                            <Container className={'container-center'}>
                                <Text text={'Cargando...'}/>
                            </Container>
                        }
                        onEmptySearch={() => 
                            <Container className={'container-center'}>
                                <Text text={`No existen busquedas relacionadas a "${searchValues.routines}"`}/>
                            </Container>
                        }
                        onEmpty={() => 
                            <Container className={'container-center'}>
                                <Text text={'Crea tu primera rutina 🏋️'} />
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
                                    <Text text={routine.name}/>
                                    <ButtonIcon
                                    classNameContainer={`delete-button ${ viewMode === true && "darkmode"}`}
                                    textButton={'Eliminar'}
                                    onClick={() => updateModalDelete({boolean:true,item:{id:routine.id,name:routine.nameRoutine}})}
                                    icon={<RiDeleteBin2Fill/>}
                                    />
                                    </Container>
                                    <Container className={'routine-container-stats'}>
                                        <Text text={`Tiempo record 🎉: ${routine.timeRecord}`}/>
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
                        >
                            <AddItem
                            text={'Crear rutina nueva'}
                            darkMode={darkMode}
                            widthScreen={widthScreen}
                            onClick={() => navigate('/create-routine')}
                            />
                        </ContainerSearch>
                    </Section>
                }
                {
                    view === "folders" && 
                    <Section
                    className={'folders'}
                    >
                        <InputSearch
                        classNameDiv={'div-search'}
                        classNameSpan={'design-search'}
                        textSearch={'Buscar carpeta...'}
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