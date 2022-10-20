import React from "react";
import { IoMdClose } from "react-icons/io";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import Cookies from "universal-cookie/es6";
const token = new Cookies().get('session-token')

const ModalSelect = ({backOff,title,classNameText,functionClose,classNameButtonClose,classNameHeader,list,classNameModal,childrenTop,childrenBottom}) => {

    return (
        <>
            {backOff === false &&
                <Container className={'back'}/>
            }
            <Container className={classNameModal}>
                <Container
                className={classNameHeader}
                >
                    <Text className={classNameText} text={title}/>
                    <span className={classNameButtonClose} onClick={() => functionClose()}>
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