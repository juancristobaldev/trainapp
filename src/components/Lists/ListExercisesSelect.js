import React, { useEffect, useState } from "react";
import { CreateExercise } from "../Create/CreateExercise";
import { Form } from "../Form/Form";
import { FormControl } from "../Form/FormControl";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import { Modal } from "../Modal/Modal";

const exercises = [
    {
        name:'Pull ups',
        series:[
            {n:1,reps:10},{n:2,reps:10},{n:3,reps:10},{n:4,reps:10}
        ],
        select:false,
        isAdded:false
    },
    {
        name:'Chin ups',
        series:[
            {n:1,reps:10},{n:2,reps:10},{n:3,reps:10},{n:4,reps:10}
        ],
        select:false,
        isAdded:false
    },
    {
        name:'Push ups',
        series:[
            {n:1,reps:10},{n:2,reps:10},{n:3,reps:10},{n:4,reps:10}
        ],
        select:false,
        isAdded:false
    },
    {
        name:'Wide Pull ups',
        series:[
            {n:1,reps:10},{n:2,reps:10},{n:3,reps:10},{n:4,reps:10}
        ],
        select:false,
        isAdded:false
    }
]

const ListExercisesSelect = ({close, list, setList}) => {

    const [listExercisesSelect,setListExercisesSelect] = useState(() => {
        return exercises.filter(item => item.isAdded === false)
    });
    const [modalCreate,setModalCreate] = useState(false)

    const selectOnList = async (name) => {
        const listExercises = [...listExercisesSelect]
        await listExercises.forEach( exercise => {
            if(exercise.name === name){
                if(exercise.select) exercise.select = false 
                else exercise.select = true
            }
        })
        setListExercisesSelect(listExercises)
    }

    const addExercisesToList = async () => {
        const listExercises = [...exercises];
        const newList = [...list];
        await listExercises.forEach( exercise => {
            if(exercise.select == true){
                exercise["isAdded"] = true
                exercise["select"] = false
                newList.push(exercise)
            }
        })

        const listOutSelect = listExercises.filter(item => item.isAdded === false)
        setListExercisesSelect(listOutSelect)
        setList(newList)

    }

    return(
        <Container>
            <Container>
                <Text text={'Lista de ejercicios'}/>
                <button
                onClick={() => close(false)}
                >
                Cerrar</button>
            </Container>
            {listExercisesSelect.map( item =>  
                <Text
                    className={item.select ? 'onSelect' : 'offSelect'}
                    onClick={selectOnList}
                    text={item.name}
                    key={item.name}
                />
            )}
            <Container>
                <button
                onClick={() => setModalCreate(true)}
                >Crear ejercicio</button>
                <button
                onClick={() => addExercisesToList()}
                >Agregar ejercicio</button>
            </Container>
            {modalCreate &&
                <Modal>
                    <CreateExercise
                    modal={setModalCreate}
                    />
                </Modal>  
            }
        </Container>
    )
}

export { ListExercisesSelect }