import React, { useState } from "react";
import { useList } from "../../hooks/useList";
import { ModalSelect } from "../Modal/ModalSelect";
import "../../styles/ListSelect.scss"
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import CheckBox from "../Checkbox";
import { Routine } from "../Routine";
import { Button } from "../generals/Button";
import { ContainerSearch } from "../ContainerSearch";

const objectState = {
    modal:null,
    
};

const ListRoutines = ({titleList,type,placeHolderSearch,objHookList}) => {

    const [searchValue,updateSearchValue] = useState({routines:''})

    const { content, stateObj, repeat, apollo } = objHookList

    const {
        loading,
        error,
        listForSelect,
        selectOfTheList,
        addItem
    } = useList(content, {...stateObj, state:{...stateObj.state, searchValue:searchValue}}, repeat, apollo)

    const { state, updateState } = stateObj

    return (
        <ModalSelect
        classNameModal={'modal-select'}
        classNameHeader={'modal-select-header'}
        classNameButtonClose={'close-button'}
        functionClose={() => updateState({...state, modal:false})}
        title={titleList}
        list={
            <ContainerSearch
                name={"routines"}
                searchValues={searchValue}
                onChange={e => updateSearchValue({...searchValue, routines:e.target.value})}
                data={listForSelect}
                loading={loading}
                error={error}
                classContainer={'container-search'}
                classDiv={'modal-select-search'}
                classNameSpan={'input-search'}
                classList={`modal-select-list`}
                textSearch={placeHolderSearch}
                onError={() => 
                    <Container className={'container-center'}>
                        <Text text={'Ooops hay un error...'}/>
                    </Container>
                }
                onLoading={() => 
                    <Container className={'container-center'}>
                        <Text text={'Cargando...'}/>
                    </Container>
                }
                onEmptySearch={() => 
                    <Container className={'container-center'}>
                        <Text text={`No existen busquedas relacionadas a "${searchValue.routines}"`}/>
                    </Container>
                }
                onEmpty={() => 
                    <Container className={'container-center'}>
                        <Text text={'Crea tu primera rutina 🏋️'} />
                    </Container>
                }
                render={
                    type === "routines" ?  
                    routine => 
                            <Routine
                            key={routine.id}
                            >
                                <Container className={'container-routine-folder'}>
                                    <Container className={'routine-header'}>
                                        <Text text={routine.name}/>
                                        <CheckBox 
                                        select={routine.select}
                                        onClick={() => selectOfTheList(routine.id)}
                                        />
                                    </Container>    
                                    <Container className={'routine-stats'}>
                                        <Text className={'text-record'} text={`Tiempo record 🎉: ${routine.timeRecord}`}/>
                                        <Text className={'text-dones'} text={`Veces realizadas: ${routine.dones}`} />
                                    </Container>
                                </Container>
                            </Routine>
                    :
                    exercise => (
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
                    )
                }
            />
        }
        childrenBottom={
            <Container className={'buttons'}>
                <Button
                onClick={ async () => {
                    await addItem()
                    updateState({...state, modal:false})
                }}
                className={'add'}
                textButton={"Agregar rutinas"}
                />
            </Container>
        }
        />
    )
}

export { ListRoutines }