import React from "react";
import { Button } from "../generals/Button";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import { Modal } from "./Modal";

const ModalAreUSure = ({text,acceptFunction,cancelFunction}) => {
    return (
        <Modal>
        <Container className={'modal-are-u-sure'}>
            <Container className={'modal-emoji'}>
                <Text text={'🤔'}/>
            </Container>
        <Container className={'modal-text'}>
            <p>
            {text} <br/> <strong>¿Deseas continuar?</strong>
            </p>
            </Container>
                <Container className={'modal-buttons'}>
                <Button 
                onClick={acceptFunction}
                className={'button-continue'}
                textButton={'Continuar'}
                />
                <Button 
                onClick={cancelFunction}
                className={'button-cancel'}
                textButton={'Cancelar'}/>
                </Container>
            </Container>
        <Container className={'back uncompleted'}/>
        </Modal>
    )
}

export { ModalAreUSure }