import React, { useState } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { ButtonIcon } from "../ButtonIcon";
import { Button } from "../generals/Button";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import { ModalAreUSure } from "../Modal/ModalAreUSure";
import "../../styles/Folder.scss"
import { useMutation } from "@apollo/client";
import { DELETE_FOLDER } from "../../data/mutations";
import Cookies from "universal-cookie/es6";
import { GET_ROUTINES_FOLDERS_USER_BY_TOKEN } from "../../data/query";
import { Loading } from "../Loading";

const token = new Cookies().get('session-token')
const Folder = ({children,classNameFolder,folder,viewMode}) => {
    const [deleteFolder] = useMutation(DELETE_FOLDER)

    const [showRoutines,updateShowRoutines] = useState(false),
    [loading,updateLoading] = useState(false),
    [deleteFolderModal,updateDeleteFolder] = useState({boolean:false,id:null}),
    [modalAddRoutine,updateModalAddRoutine] = useState(false);
    const [ list, updateList] = useState([])

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
                <ButtonIcon
                classNameContainer={`delete-button-dashboard ${ viewMode === true && "darkmode"}`}
                textButton={'Eliminar'}
                onClick={() => updateDeleteFolder({boolean:true,id:folder.id})}
                icon={<RiDeleteBin2Fill/>}
                />
            </Container>
            {(showRoutines === true && deleteFolderModal.boolean === false) && 
            <>
            {
                children
            }
            <Container className={'container-add'}>
                <Button
                onClick={() => updateModalAddRoutine(true)}
                textButton={'+ Rutina'}
                />
            </Container>
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
        {modalAddRoutine && 
        <p></p>
        }
        </>
    )
}

export {Folder}