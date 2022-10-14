import React, { useState } from "react";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import { IoMdClose } from "react-icons/io";

import "../../styles/Exercises.scss"

const Exercise = ({children,item,deleteExerciseOfList}) => {
    const [openSeries,setOpenSeries] = useState(false)

    return(
        <Container
        className={'exercise'}
        key={item.name}>
            <Container 
            className={'exercise-header'}
            onClick={() => {
                setOpenSeries(!openSeries)
            }}
            style={{
                display:"flex",
                justifyContent:'space-between',
                alignItems:'center',
                padding:'0 1rem'

            }}>
                <Text
                className={'exercise-name'}
                text={item.name}/>
                <Text 
                className={'exercise-type'}
                text={item.typeEx}/>
                <Container className={'delete-button'}>
                    <IoMdClose onClick={() => deleteExerciseOfList(item,'exercise')}/>
                </Container>
            </Container>
            <Container className={'exercise-info'}
            style={openSeries ? {display:"block"} : {display:"none"}}
            >
                <Container 
                className={`stats-second-floor ${
                    item.typeEx === 'Peso adicional' || item.typeEx === 'Peso asistido' ?
                    'double-input' : 'single-input'
                }`}
                >
                    <Text style={{
                        gridArea:'1/ 2 / 2 / 3'
                    }} text='Anterior'/>
                    <Container/>
                    {
                        item.typeEx === 'Peso adicional' && 
                        <React.Fragment>
                            <Text text={'+Kg'}/>
                            <Text text={'Reps'}/>
                        </React.Fragment>
                    }
                    {
                        item.typeEx === 'Peso asistido' &&
                        <React.Fragment>
                            <Text text={'-Kg'}/>
                            <Text text={'Reps'}/>
                        </React.Fragment>
                    }
                    {
                        item.typeEx === 'Duracion' &&
                        <React.Fragment>
                            <Text text={'Tiempo'}/>
                        </React.Fragment>
                    }
                                    {
                        item.typeEx === 'Solo rep' &&
                        <React.Fragment>
                            <Text text={'Reps'}/>
                        </React.Fragment>
                    }
                </Container>
                {children}
            </Container>
        </Container>
    )
}

export { Exercise }