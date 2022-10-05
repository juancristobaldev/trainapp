import React, { useState } from "react";

import { GET_EXERCISES_BY_TOKEN } from "../../data/query";
import { useExercises } from "../../hooks/useExercises";
import { useList } from "../../hooks/useList";
import CheckBox from "../Checkbox";
import { ContainerSearch } from "../ContainerSearch";
import { Button } from "../generals/Button";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import { InputSearch } from "../InputSearch";
import { ModalSelect } from "../Modal/ModalSelect";
import { ListApi } from "./ListApi";



const ListExercises = ({token,objectState}) => {

    const {state,setState} = objectState

    const [searchValue,updateSearchValue] = useState({exercises:''})

    const {
        error,
        loading,
        updateListForSelect,
        listForSelect,
        selectOfTheList,
        addItem,
    } = useList ("exercises",{state:{...state,searchValue:searchValue},updateState:setState},false,{ nameGql:"getExercisesByToken",gql:GET_EXERCISES_BY_TOKEN,variables:{ variables:{ token:token } } })

    const {
        deleteSomeExercise
    } = useExercises(token,{list:listForSelect,updateList:updateListForSelect},{stateValue:state,setState:setState})

    const totalSelectItem = listForSelect.filter(item => item.select === true).length

    return(
        <ModalSelect
        classNameModal={'modal-exercises'}
        classNameHeader={'modal-exercises-header'}
        classNameButtonClose={'close-button'}
        functionClose={() => setState({...state, modal:false})}
        title={'Lista de ejercicios'}
        childrenTop={
            <InputSearch
            classNameDiv={'modal-exercises-search'}
            textSearch={'Buscar ejercicios...'}
            onChange={e => setState({...state, searchValue:e.target.value})}
            />
        }
        list={
            /*
            <ContainerSearch
            name={"exercises"}
            searchValues={searchValue}
            onChange={e => updateSearchValue({...searchValue, exercises:e.target.value})}
            data={listForSelect}
            loading={loading}
            error={error}
            classContainer={'container-search'}
            classDiv={'modal-select-search'}
            classNameSpan={'input-search'}
            classList={`modal-select-list`}
            textSearch={placeHolderSearch}
            />*/
            <ListApi 
            className={'modal-exercises-list'}
            error={error}
            loading={loading}
            data={listForSelect}
            total={listForSelect.length}
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
                onClick={() => selectOfTheList(exercise.id)}
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
        }
        childrenBottom={
            <>
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
                        onClick={ async () => {
                            await addItem('exercise')
                        } }
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
            </>
        }
        />
    )
}

export {ListExercises}