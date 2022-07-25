import React from "react";
import { Container } from "./generals/Container";
import { Text } from "./generals/Text";
import { IoMdClose } from "react-icons/io";

const Exercise = ({children,item}) => {
    return(
        <Container
        key={item.nameEx}>
            <Container 
            style={{
                display:"flex",
                justifyContent:'space-between',
                alignItems:'center',
                padding:'0 1rem'

            }}>
                <Text text={item.nameEx}/>
                <Text text={item.typeEx}/>
                <IoMdClose/>
            </Container>
            <Container 
            className={'stats-second-floor'}
            style={{
                                display:"grid",
                                gridTemplate:'100% / 10% 45% 15% 15% 15%',
                                placeItems:'center'
            }}>
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
    )
}

export { Exercise }