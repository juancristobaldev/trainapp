import React, { useState } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { ButtonIcon } from "./ButtonIcon";
import { Button } from "./generals/Button";
import { Container } from "./generals/Container";
import { Text } from "./generals/Text";
import { Modal } from "./Modal/Modal";
import { ModalAreUSure } from "./Modal/ModalAreUSure";
import {ListApi} from "./Lists/ListApi"
import { List } from "./Lists/List";
import { ListArray } from "./Lists/ListArray";

import "../styles/Folder.scss"
import { IoMdClose } from "react-icons/io";
import CheckBox from "./Checkbox";
import { Routine } from "./Routine";

const Folder = ({routines,children,classNameFolder,folder,viewMode,functionDelete}) => {
    const [showRoutines,updateShowRoutines] = useState(false),
    [deleteFolder,updateDeleteFolder] = useState(false),
    [modalCreateRoutine,updateModalCreateRoutine] = useState(false)
    
    return (
        <>
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
                onClick={() => {
                    updateDeleteFolder(true)
                }}
                icon={<RiDeleteBin2Fill/>}
                />
            </Container>
            {(showRoutines === true && deleteFolder === false) && 
            <>
            {
                children
            }
            <Container className={'container-add'}>
                <Button
                onClick={() => updateModalCreateRoutine(true)}
                textButton={'+ Rutina'}
                />
            </Container>
            </>
            }
        </Container>
        {deleteFolder && 
            <ModalAreUSure
            text={'Si eliminas la carpeta no podras recuperarla despues...'}
            acceptFunction={() => console.log('accept')}
            cancelFunction={() => {
                updateShowRoutines(false)
                updateDeleteFolder(false)
            }}
            />
        }
        {modalCreateRoutine && 
        <Modal>
            <Container className={"back"}/>
            <Container className={'modal-add-routines'}>
                <Container className={'modal-add-routines-header'}>
                    <Text
                    text={'Carpeta nueva'}
                    />
                    <span>
                        <IoMdClose
                        onClick={() => updateModalCreateRoutine(false)}
                        />
                    </span>
                </Container>
                <Container className={'name-folder'}>
                    <label>Ingresa un nombre para tu rutina:</label>
                    <input type="text"/>
                </Container>
                <Text className={'text-select'} 
                text={"Selecciona alguna rutina:"}/>
                <ListArray
                className={'list-routines-folder'}
                data={routines}
                textOnError={"Hay un error..."}
                textOnEmpty={"Esta vacio..."}
                render={routine => 
                <Routine >
                    <Container className={'container-routine-folder'}>
                        <Container className={'routine-header'}>
                            <Text text={routine.name}/>
                            <CheckBox/>
                        </Container>    
                        <Container className={'routine-stats'}>
                            <Text text={`Tiempo record 🎉: ${routine.timeRecord}`}/>
                            <Text text={`Veces realizadas: ${routine.dones}`} />
                        </Container>
                    </Container>
                </Routine>
                }
                />
                <Container className={'button-add'}>
                    <Button textButton={'Agregar rutinas'} onClick={() => updateModalCreateRoutine(true)}/>
                </Container>
            </Container>
        </Modal>   
        }
        </>
    )
}

export {Folder}