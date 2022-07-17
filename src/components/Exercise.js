import React from "react";
import { Container } from "./generals/Container";
import { ListSeries } from "./Lists/ListSeries";
import { Text } from "./generals/Text";
import { IoMdClose } from "react-icons/io";

const Exercise = ({list,setList,item,getDataRoutine}) => {
    return(
        <Container
        key={item.nameEx}>
            <Container style={{
                display:"flex",
                justifyContent:'space-between',
                alignItems:'center',
                padding:'0 1rem'

            }}>
                <Text text={item.nameEx}/>
                <Text text={item.typeEx}/>
                <IoMdClose/>
            </Container>
            <Container style={{
                                display:"flex",
                                justifyContent:'space-between',
                                alignItems:'center',
                                padding:'0 1rem'
            }}>
                <Text text='Serie'/>
                <Text text='Nombre'/>
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
            <ListSeries
            list={list}
            setList={setList}
            object={item}
            getDataRoutine={getDataRoutine}
            />
        </Container>
    )
}

export { Exercise }