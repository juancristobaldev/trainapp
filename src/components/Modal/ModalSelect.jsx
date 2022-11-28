import React from "react";
import { IoMdClose } from "react-icons/io";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import { useDarkMode } from "../../hooks/useDarkMode";

const ModalSelect = ({backOff,title,classNameText,functionClose,classNameButtonClose,classNameHeader,list,classNameModal,childrenTop,childrenBottom}) => {

const { darkMode } = useDarkMode()


    return (
        <>
            {backOff === false &&
                <Container className={'back'}/>
            }
            <Container className={`${classNameModal} ${darkMode && 'darkMode'}`}>
                <Container
                className={classNameHeader}
                >
                    <Text className={classNameText} text={title}/>
                    <span className={`${classNameButtonClose} ${darkMode && 'darkMode'}`} onClick={() => functionClose()}>
                        <IoMdClose/>
                    </span>
                </Container>
                {childrenTop && childrenTop}
                {list && list}
                {childrenBottom && childrenBottom}
            </Container>
        </>
    )
}

export { ModalSelect }