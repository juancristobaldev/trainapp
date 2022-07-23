import React, { useState } from "react"
import { Container } from "./generals/Container"
import { Text } from "./generals/Text"
import {BsThreeDots} from 'react-icons/bs'
import {GrFormClose} from "react-icons/gr"
import { Modal } from "./Modal/Modal"

import '../styles/Routines.scss'

const Routine = ({children}) => {


    return(
        <Container className={"routine-container"}>
            {children}
        </Container>
    )
}

export {Routine}