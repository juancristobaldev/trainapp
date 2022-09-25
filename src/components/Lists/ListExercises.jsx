import React from "react";
import { IoMdClose } from "react-icons/io";
import { useExercises } from "../../hooks/useExercises";
import { useListExercises } from "../../hooks/useListExercises";
import CheckBox from "../Checkbox";
import { Button } from "../generals/Button";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import { InputSearch } from "../InputSearch";
import { ListApi } from "./ListApi";



const ListExercises = ({token,objectState}) => {

    const {state,setState} = objectState

    const {
        error,
        loading,
        setListExercisesSelect,
        listExercisesSelect,
        selectOfTheList,
        addExerciseToList,
    } = useListExercises (token,{state:state,updateState:setState},state.listOnCreate)

    const {
        deleteSomeExercise
    } = useExercises(token,{list:listExercisesSelect,updateList:setListExercisesSelect},{stateValue:state,setState:setState})

    const totalSelectItem = listExercisesSelect.filter(item => item.select === true).length

    return(
        <Container className={'modal-exercises'}>
            <Container className={'modal-exercises-header'}>
                <Text text={'Lista de ejercicios'}/>
                <Container className={'close-button'}>
                    <IoMdClose
                    onClick={() => setState({...state, modal:false})}
                    />
                </Container>
            </Container>
            <InputSearch
            classNameDiv={'modal-exercises-search'}
            textSearch={'Buscar ejercicios...'}
            onChange={e => setState({...state, searchValue:e.target.value})}
            />
            <ListApi 
            className={'modal-exercises-list'}
            error={error}
            loading={loading}
            data={listExercisesSelect}
            total={listExercisesSelect.length}
            onError={() => 
                <Container className={'error-container'}>
                    <Text 
                    text={`Ooops, hay un error...`}/>
                </Container>
            }
            onLoading={() => <Text text={'Cargando ejercicios'}/>}
            onEmpty={() => 
                <Container className={'empty-container'}>
                    <Text 
                    text={`Tu lista de ejercicios esta vacia`}/>
                </Container>
            }
            render={exercise => (
                <Container 
                key={exercise.name}
                className={`exercise-container ${exercise.select ?'onSelect' : 'offSelect' }`}
                onClick={() => selectOfTheList(exercise.name)}
                >
                    <Text
                    text={exercise.name}
                    key={exercise.name}
                    />
                    <CheckBox
                    select={exercise.select}
                    />
                </Container>
            )}
            />
                <Container className={'modal-exercises-actions'}>
                {
                    totalSelectItem > 0 &&
                        <>
                        <Button
                        className={'button-delete'}
                        textButton={`Eliminar (${totalSelectItem})`}
                        onClick={() => {
                            setState({...state, modal:false})
                            deleteSomeExercise(false)
                        }}
                        />
                        <Button 
                        className={'button-add'}
                        textButton={`Agregar (${totalSelectItem})`}
                        onClick={ () => addExerciseToList() }
                        />       
                        </>                    
                }
                </Container>
                <Container
                className={'modal-exercises-create'}
                >
                    <Button
                    textButton={'Crear ejercicio'}
                    onClick={ () => {
                        setState(
                            {
                                ...state,
                                modalCreate:!state.modalCreate,
                                modal:false
                            }
                        )
                    }}
                    />
                </Container>
            </Container>
    )
}

export {ListExercises}