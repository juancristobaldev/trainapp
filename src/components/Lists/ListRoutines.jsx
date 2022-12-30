import React, { useState } from "react";
import { useList } from "../../hooks/useList";
import { ModalSelect } from "../Modal/ModalSelect";
import "../../styles/ListSelect.scss";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import CheckBox from "../Checkbox";
import { Routine } from "../Routines/Routine";
import { Button } from "../generals/Button";
import { ContainerSearch } from "../ContainerSearch";
import { useNavigate } from "react-router-dom";
import { useWidthScreen } from "../../hooks/useWidthScreen";

const ListRoutines = ({
  titleList,
  type,
  placeHolderSearch,
  objHookList,
  updateRoutineOnPlay,
}) => {
  const navigate = useNavigate();

  const [searchValue, setSearchState] = useState("");

  const { content, stateObj, repeat, apollo } = objHookList;

  const { widthScreen } = useWidthScreen();

  const { dataDone, loading, error, listForSelect, selectOfTheList, addItem } =
    useList(
      content,
      { ...stateObj, state: { ...stateObj.state, searchValue: searchValue } },
      repeat,
      apollo
    );

  console.log(dataDone, error);

  const { state, updateState } = stateObj;

  const totalSelect = listForSelect.filter(
    (item) => item.select === true
  ).length;
  console.log(totalSelect);
  return (
    <ModalSelect
      classNameModal={`modal-select ${widthScreen > 650 && "web"}`}
      classNameHeader={"modal-select-header"}
      classNameButtonClose={"close-button"}
      functionClose={() => updateState({ ...state, modal: false })}
      title={titleList}
      list={
        <ContainerSearch
          name={"routines"}
          searchValues={searchValue}
          onChange={(event) => setSearchState(event.target.value)}
          data={listForSelect}
          loading={loading}
          error={error}
          classContainer={"container-search"}
          classDiv={"modal-select-search"}
          classNameSpan={"input-search"}
          classList={`modal-select-list`}
          textSearch={placeHolderSearch}
          onError={() => (
            <Container className={"container-center"}>
              <Text text={"Ooops hay un error!..."} />
            </Container>
          )}
          onLoading={() => (
            <Container className={"container-center"}>
              <Text text={"Cargando..."} />
            </Container>
          )}
          onEmptySearch={() => (
            <Container className={"container-center"}>
              <Text
                text={`No existen busquedas relacionadas a "${searchValue}"`}
              />
            </Container>
          )}
          onEmpty={() => (
            <Container className={"container-center"}>
              <Text text={"Tu lista de rutinas esta vacia... 🏋️"} />
            </Container>
          )}
          render={
            type === "routines"
              ? (routine) => (
                  <Routine
                    routine={routine}
                    key={routine.id}
                    classNameContainer={"container-routine-folder"}
                    classNameHeader={"routine-header"}
                    header={
                      <Container className={"routine-header"}>
                        <Text text={routine.name} />
                        <CheckBox
                          select={routine.select}
                          onClick={() => selectOfTheList(routine.id)}
                        />
                      </Container>
                    }
                  >
                    <Container className={"routine-stats"}>
                      <Text
                        className={"text-record"}
                        text={`Tiempo record 🎉: ${routine.timeRecord}`}
                      />
                      <Text
                        className={"text-dones"}
                        text={`Veces realizadas: ${routine.dones}`}
                      />
                    </Container>
                  </Routine>
                )
              : (exercise) => (
                  <Container
                    key={exercise.name}
                    className={`exercise-container ${
                      exercise.select ? "onSelect" : "offSelect"
                    }`}
                    onClick={() => selectOfTheList(exercise.name)}
                  >
                    <Text text={exercise.name} key={exercise.name} />
                    <CheckBox select={exercise.select} />
                  </Container>
                )
          }
        />
      }
      childrenBottom={
        dataDone && dataDone.length === 0 ? (
          <Container className={"buttons"}>
            <Button
              onClick={async () => {
                await updateRoutineOnPlay({
                  active: false,
                  id: false,
                  routine: false,
                });
                navigate("/routine");
              }}
              className={"add"}
              textButton={"Crear tu primera rutina"}
            />
          </Container>
        ) : (
          <Container className={"buttons"}>
            <Button
              disable={totalSelect === 0 && true}
              onClick={async () => {
                await addItem();
                updateState({ ...state, modal: false });
              }}
              className={"add"}
              textButton={"Agregar rutinas"}
            />
          </Container>
        )
      }
    />
  );
};

export { ListRoutines };
