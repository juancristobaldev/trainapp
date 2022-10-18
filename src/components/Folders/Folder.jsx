import React, { useEffect, useState } from "react";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import { ModalAreUSure } from "../Modal/ModalAreUSure";
import "../../styles/Folder.scss"
import { useMutation } from "@apollo/client";
import { DELETE_FOLDER } from "../../data/mutations";
import Cookies from "universal-cookie/es6";
import { GET_ROUTINES_FOLDERS_USER_BY_TOKEN } from "../../data/query";
import { Loading } from "../Loading";
import { BsThreeDots } from "react-icons/bs";
import { Popover } from "../Popover";
import { ModifyFolder } from "./ModifyFolder";

const token = new Cookies().get('session-token')
const Folder = ({children,classNameFolder,folder,viewMode,widthScreen,darkMode}) => {
    const [deleteFolder] = useMutation(DELETE_FOLDER)

    const [showRoutines,updateShowRoutines] = useState(false),
    [popover,updatePopover] = useState(false),
    [loading,updateLoading] = useState(false),
    [deleteFolderModal,updateDeleteFolder] = useState({boolean:false,id:null}),
    [modalModifyFolder,updateModalModifyFolder] = useState(false);


    const deleteFolderDB = async () => {
        updateLoading(true)
        await deleteFolder({
            variables:{
                input:{
                    id:deleteFolderModal.id,
                    token:token
                }
            },refetchQueries:[{query:GET_ROUTINES_FOLDERS_USER_BY_TOKEN, variables:{
                token:token
            }}]
        }).then(({data}) => {
            updateDeleteFolder({boolean:false,id:null})
            setTimeout(() =>{
                updateLoading(false)
            },500)
        })
    }

    useEffect(() => {
        if(widthScreen > 650){
            updateShowRoutines(true)
        }
    },[widthScreen])
    
    return (
        <>
        {loading && <Loading/>}
        <Container className={classNameFolder}>
            <Container
            className={'header-folder'}
            onClick={() => updateShowRoutines(!showRoutines)}
            >
                <Text
                text={folder.name}
                />
                <Container style={{"position":"relative"}}>
                <>
                    <BsThreeDots
                    cursor={"pointer"}
                    onClick={ async () => {
                        if(widthScreen > 650){
                            updateShowRoutines(true)
                        }
                        updatePopover(true)
                    }}
                    />
                    {popover  &&
                        <Popover
                        darkMode={darkMode}
                        unPopover={() => updatePopover(false)}
                        >
                            <>
                                <Text
                                className={'optionMenu'}
                                text={'Editar'}
                                onClick={() => updateModalModifyFolder(true)}
                                />
                                <Text
                                style={{color:"red"}}
                                className={'optionMenu'}
                                text={'Eliminar'}
                                onClick={() => updateDeleteFolder({boolean:true,id:folder.id})}
                                />
                            </>
                        </Popover>
                    }
                </>
                </Container>
            </Container>
            {((showRoutines === true && deleteFolderModal.boolean === false && popover === false) || (widthScreen > 650)) && 
            <>
            {
                children
            }
            </>
            }
        </Container>
        {deleteFolderModal.boolean && 
            <ModalAreUSure
            text={'Si eliminas la carpeta no podras recuperarla despues...'}
            acceptFunction={() => {
                updateShowRoutines(false) 
                deleteFolderDB()}
            }
            cancelFunction={() => {
                updateShowRoutines(false)
                updateDeleteFolder(false)
            }}
            />
        }
        {modalModifyFolder && 
            <ModifyFolder
            token={token}
            closeFunction={() => {
                updatePopover(false)
                updateModalModifyFolder(false)
            }}
            folder={folder}
            />
        }
        </>
    )
}

export {Folder}