import React, { useState } from "react";

import { GET_EXERCISES_BY_TOKEN } from "../../data/query";
import { useExercises } from "../../hooks/useExercises";
import { useList } from "../../hooks/useList";
import CheckBox from "../Checkbox";
import { ContainerSearch } from "../ContainerSearch";
import { Button } from "../generals/Button";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import { ModalSelect } from "../Modal/ModalSelect";
import { useWidthScreen } from "../../hooks/useWidthScreen";

const ListExercises = ({ token, objectState, backOff }) => {
  const { state, setState } = objectState;

  const [searchValue, updateSearchValue] = useState({ exercises: "" });

  const {
    error,
    loading,
    updateListForSelect,
    listForSelect,
    selectOfTheList,
    addItem,
  } = useList(
    "exercises",
    { state: { ...state, searchValue: searchValue }, updateState: setState },
    true,
    { nameGql: "getExercises", gql: GET_EXERCISES_BY_TOKEN }
  );

  const { widthScreen } = useWidthScreen();

  const { deleteSomeExercise } = useExercises(
    token,
    { list: listForSelect, updateList: updateListForSelect },
    { stateValue: state, setState: setState }
  );

  const totalSelectItem = listForSelect.filter(
    (item) => item.select === true
  ).length;

  return (
    <ModalSelect
      backOff={backOff}
      classNameModal={`modal-exercises ${widthScreen > 650 && "web"}`}
      classNameHeader={"modal-exercises-header"}
      classNameButtonClose={"close-button"}
      functionClose={() => setState({ ...state, modal: false })}
      title={"Lista de ejercicios"}
      list={
        <ContainerSearch
          name={"exercises"}
          searchValues={searchValue}
          onChange={(e) =>
            updateSearchValue({ ...searchValue, exercises: e.target.value })
          }
          data={listForSelect}
          loading={loading}
          error={error}
          classContainer={"container-search"}
          classDiv={"modal-exercises-search"}
          classNameSpan={"input-search"}
          classList={`modal-exercises-list`}
          textSearch={"Buscar ejercicios..."}
          onError={() => (
            <Container className={"error-container"}>
              <Text text={`Ooops, hay un error...`} />
            </Container>
          )}
          onLoading={() => <Text text={"Cargando ejercicios"} />}
          onEmptySearch={() => (
            <Container className={"container-center"}>
              <Text
                text={`No existen busquedas relacionadas a "${searchValue.exercises}"`}
              />
            </Container>
          )}
          onEmpty={() => (
            <Container className={"empty-container"}>
              <Text text={`Tu lista de ejercicios esta vacia`} />
            </Container>
          )}
          render={(exercise) => (
            <Container
              key={exercise.name}
              className={`exercise-container ${
                exercise.select ? "onSelect" : "offSelect"
              }`}
              onClick={() => selectOfTheList(exercise.id)}
            >
              <Text text={exercise.name} key={exercise.name} />
              <CheckBox select={exercise.select} />
            </Container>
          )}
        />
      }
      childrenBottom={
        <>
          <Container className={"modal-exercises-actions"}>
            {totalSelectItem > 0 && (
              <>
                <Button
                  className={"button-delete"}
                  textButton={`Eliminar (${totalSelectItem})`}
                  onClick={() => {
                    setState({ ...state, modal: false });
                    deleteSomeExercise(false);
                  }}
                />
                <Button
                  className={"button-add"}
                  textButton={`Agregar (${totalSelectItem})`}
                  onClick={async () => addItem("exercise")}
                />
              </>
            )}
          </Container>
          <Container className={"modal-exercises-create"}>
            <Button
              textButton={"Crear ejercicio"}
              onClick={() => {
                setState({
                  ...state,
                  modalCreate: !state.modalCreate,
                  modal: false,
                  modalErrors: { error: false, errors: {} },
                  errors: {},
                });
              }}
            />
          </Container>
        </>
      }
    />
  );
};

export { ListExercises };
