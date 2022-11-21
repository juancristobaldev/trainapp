import React, { useContext, useState } from "react";
import Cookies from "universal-cookie/es6";
import { useNavigate, Navigate } from "react-router-dom";
import { Container } from "./generals/Container";
import { Main } from "./generals/Main";
import { Section } from "./generals/Section";
import { Routine } from "./Routines/Routine";

import { ImHome } from "react-icons/im"
import {IoDocumentTextSharp} from "react-icons/io5"
import {GiHamburgerMenu} from "react-icons/gi"
import {RiFoldersFill} from "react-icons/ri"
import {MdDarkMode,MdLightMode,MdClose} from "react-icons/md"
import {BsFillDoorOpenFill} from "react-icons/bs"

import '../styles/Dashboard.scss'
import '../styles/responsive/Dashboard.scss'

import { Button } from "./generals/Button";
import { Text } from "./generals/Text";
import { ListApi } from "./Lists/ListApi";
import { Checkbox, Switch } from "@mui/material";
import { DataContext } from "../context/DataProvider";
import { Loading } from "./Loading";

import { Modal } from "./Modal/Modal";

import { useMutation } from "@apollo/client";
import { DELETE_ROUTINE, UPDATE_USER } from "../data/mutations";
import { GET_ROUTINES_AND_USER_BY_TOKEN, GET_ROUTINES_FOLDERS_USER_BY_TOKEN, GET_USER } from "../data/query";
import { ButtonIcon } from "./ButtonIcon";
import { ContainerSearch } from "./ContainerSearch";
import { Folder } from "./Folders/Folder";
import { ModalAreUSure } from "./Modal/ModalAreUSure";
import { CreateFolder } from "./Folders/CreateFolder";
import { useWidthScreen } from "../hooks/useWidthScreen";
import { useDarkMode } from "../hooks/useDarkMode";
import { RoutineCrud } from "./Routines/RoutineCrud";


const Dashboard = ({updateRoutineOnPlay}) => {
    const navigate = useNavigate()

    const cookies = new Cookies();
    const token = cookies.get('session-token'),
    [error,setError] = useState(null),
    [stateNav,updateStateNav] = useState('none'),
    [modalDelete,updateModalDelete] = useState({ boolean:false, item:{id:null,name:null}}),
    [view , updateView ] = useState('home'),
    [searchValues,updateSearchValues] = useState({
        routines:'',
        folders:''
    }),
    [modalCreateFolder,updateModalCreateFolder] = useState(false),
    [back,updateBack] = useState({active:false,id:null,folder:null}),
    [deleteRoutine] = useMutation(DELETE_ROUTINE),
    [updateUser] = useMutation(UPDATE_USER)

    const { widthScreen } = useWidthScreen(),
    {darkMode, updateDarkMode,changeDarkMode} = useDarkMode()

    const {
        routines,
        me,
        folders,
        loadingData
    } = useContext(DataContext)

    const searchSomething = (e) => {
        updateSearchValues({ ...searchValues, [e.target.name]:e.target.value })
    }

    const closeSesion = async () => {
        await cookies.remove('session-token')
        window.location.reload()
    }


    const deleteRoutineDB = async (id) => await deleteRoutine({
            variables:{
                input:{
                    token:token,
                    id:id
                }
            },
            refetchQueries:[{query:GET_ROUTINES_FOLDERS_USER_BY_TOKEN,variables:{
                token:token
            }}]
        }).then( ({data}) => {
            const { errors, success } = data.deleteRoutine
            if(errors) console.log(errors)
            if(success) updateModalDelete({boolean:false,item:{name:null,id:null}})
        })

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
            {!loadingData  && 
            <>
                <nav className={`section-nav-dashboard ${widthScreen > 650 && "nav-big-screen"}`}>
                    <h3 className="app">WorkOut App</h3>
                    <h3 className={`view ${widthScreen > 650 && "web"}`}>{view === "home" ? 'Inicio' : view === "routines" ? 'Rutinas' 
                        : view === "folders" ? "Carpetas" : "Mi perfil" }</h3>
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
                                <h3>Menu</h3>
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
                        loading={loadingData}
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
                            routine={routine}
                            popOver={false}
                            classNameContainer={`routine-container
                            ${darkMode && "darkMode"}`}
                            classNameHeader={"routine-container-header"}
                            >
                                    <Container className={'routine-container-stats'}>
                                        <Text text={`Record 🎉: ${routine.timeRecord}`}/>
                                        <Text text={`Veces realizadas: ${routine.dones}`} />
                                        <Text text={`Ejercicios: ${JSON.parse(routine.exercises).length}`} />
                                    </Container>
                                    <Container className={'routine-container-button'}>
                                        <Button
                                        onClick={async () => {
                                            await updateRoutineOnPlay({active:true, id:routine.id, routine:routine})
                                            navigate('/routine')
                                        }}
                                        textButton={'Empezar rutina'}
                                        />
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
                        button={{function: async () => {
                            await updateRoutineOnPlay({active:false, id:false, routine:false})
                            navigate('/routine')
                        }, text: '+ Crear', className: 'create-routine'}}
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
                            routine={routine}
                            key={routine.id}
                            popOver={true}
                            darkMode={darkMode}
                            classNameContainer={`routine-container
                            ${darkMode && "darkMode"}`}
                            classNameHeader={"routine-container-header"}
                            childrenPopover={
                                <>
                                    <Text 
                                    className={'optionMenu'}
                                    text={'Editar'}
                                    onClick={ async () => {
                                        await updateRoutineOnPlay({active:false, id:routine.id, routine:routine})
                                        navigate('/routine')
                                    }}
                                    />
                                    <Text 
                                    className={'optionMenu'}
                                    onClick={() => updateModalDelete({boolean:true,item:{id:routine.id,name:routine.nameRoutine}})}
                                    style={{color:"red"}} 
                                    text={'Eliminar'}/>
                                </>
                            }
                            >
                                <Container className={'routine-container-stats'}>
                                    <Text text={`Tiempo record 🎉: ${routine.timeRecord}`}/>
                                    <Text text={`Veces realizadas: ${routine.dones}`} />
                                    <Text text={`Ejercicios: ${JSON.parse(routine.exercises).length}`}/>
                                </Container>
                                <Container className={'routine-container-button'}>
                                    <Button
                                    onClick={async () => {
                                        await updateRoutineOnPlay({active:true, id:routine.id, routine:routine})
                                        navigate('/routine')
                                    }}
                                    textButton={'Empezar rutina'}
                                    />
                                </Container>
                            </Routine>
                        )}
                        >
                        </ContainerSearch>
                    </Section>
                }
                {
                    view === "folders" && 
                    
                    <Section
                    className={'folders'}
                    >   {back.active && 
                        <Container onClick={() => updateBack({active:false,id:null,folder:null})} className={'back unblur'}/>
                        }
                        <ContainerSearch
                        searchValues={searchValues}
                        data={folders}
                        name={'folders'}
                        button={{text:'+ Crear',function:() => updateModalCreateFolder(true)}}
                        classContainer={'container-search'}
                        classDiv={'div-search'}
                        classSpan={'design-search'}
                        classList={`section-list-folders ${darkMode && "darkMode"}`}
                        textSearch={'Buscar carpetas...'}
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
                                <Text text={`No existen busquedas con "${searchValues.folders}"`}/>
                            </Container>
                        }
                        onEmpty={() => 
                            <Container className={'container-center'}>
                                <Text text={'Crea tu primera carpeta 🏋️'} />
                            </Container>
                        }
                        render={ folder => (
                           <Folder
                           widthScreen={widthScreen}
                           routines={routines}
                           key={folder.id}
                           folder={folder}
                           classNameFolder={"folder-container"}
                           darkMode={darkMode}
                           >
                                <ListApi
                                data={JSON.parse(folder.content)}
                                className={'folder-list-routines'}
                                loading={loadingData}
                                onLoading={() => <Container className={'container-center'}><Text text={'Cargando...'}/></Container>}
                                onError={() => <Container className={'container-center'}><Text text={'Oops hay un error...'}/></Container>}
                                onEmpty={() => <Container className={'container-center'}><Text text={'No has agregado ninguna rutina...'}/></Container>}
                                render={ routine => 
                                        <Routine
                                        key={routine.id}
                                        routine={routine}
                                        classNameContainer={`container-routine-on-folder ${(folder.id === back.folder && routine.id === back.id && back.active) && 'top'}`}
                                        classNameHeader={'container-routine-on-folder-header'}
                                        sandwichFunction={updateBack}
                                        sandwichMode={true}
                                        backinfo={{folder:folder.id, active:back.active, id:routine.id}}
                                        >
                                            {(back.active && back.id === routine.id && back.folder === folder.id) && 
                                            <>
                                                <Container className={'routine-container-stats'}>
                                                    <Text text={`Tiempo record 🎉: ${routine.timeRecord}`}/>
                                                    <Text text={`Veces realizadas: ${routine.dones}`}/>
                                                    <Text text={`Ejercicios: ${JSON.parse(routine.exercises).length}`} />
                                                </Container>
                                                <Container className={'routine-container-button'}>
                                                    <Button
                                                    onClick={ async () => {
                                                        await updateRoutineOnPlay({active:true, id:routine.id, routine:routine})
                                                        navigate('/routine')
                                                    }}
                                                    textButton={'Empezar rutina'}
                                                    />
                                                </Container>
                                            </>
                                            }
                                        </Routine>
                                    
                                }
                                />
                           </Folder>
                        )
                        }
                        />
                    
                    </Section>
                }
                { modalDelete.boolean && 

                    <ModalAreUSure
                    text={"Si eliminas la rutina no podras recuperarla despues..."}
                    acceptFunction={() => deleteRoutineDB(modalDelete.item.id)}
                    cancelFunction={() => updateModalDelete({boolean:false})}
                    />
                }
                {modalCreateFolder && 
                    <>
                        <Container className={`back ${darkMode && 'darkMode'}`}/>
                        <CreateFolder
                        token={token}
                        routines={routines}
                        closeFunction={() => updateModalCreateFolder(false)}
                        />
                    </>
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