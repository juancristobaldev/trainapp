import React from "react";
import { IoMdClose } from "react-icons/io";
import { GET_EXERCISES_BY_TOKEN } from "../../data/query";
import { useExercises } from "../../hooks/useExercises";
import { useList } from "../../hooks/useList";
import { Form } from "../Form/Form";
import { FormControl } from "../Form/FormControl";
import { Options } from "../Form/Options";
import { Button } from "../generals/Button";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import { Create } from "../Create/Create";
import { useDarkMode } from "../../hooks/useDarkMode";
import { Loading } from "../Loading";

const CreateExercise = ({ token, objectState }) => {
  const { state, setState } = objectState;

  const { darkMode } = useDarkMode();

  const { listForSelect, refetchList, updateListForSelect } = useList(
    "exercises",
    { state: state, updateState: setState },
    true,
    { nameGql: "getExercises", gql: GET_EXERCISES_BY_TOKEN }
  );

  const { loadingStatus, errors, handleChange, createNewExercise } =
    useExercises(
      token,
      { list: listForSelect, updateList: updateListForSelect },
      { stateValue: state, setState: setState },
      { nameGql: "getExercises", gql: GET_EXERCISES_BY_TOKEN }
    );

  return (
    <>
      {loadingStatus && <Loading />}
      <Create className={`modal-create-exercise ${darkMode && "darkMode"}`}>
        <Container className={"header-create"}>
          <Text text="Estas creando un ejercicio:" />
          <Container className={`close-button ${darkMode && "darkMode"}`}>
            <IoMdClose
              onClick={() =>
                setState({ ...state, modalCreate: false, modal: true })
              }
            />
          </Container>
        </Container>
        <Form
          className={"form-create"}
          onSubmit={createNewExercise}
          textSubmit="Crear"
        >
          <FormControl
            objState={objectState}
            error={[errors.name, errors.alreadyExist]}
            className={"name-input-create"}
            label="Nombre ejercicio:"
            typeControl="input"
            name="name"
            type="text"
            onChange={handleChange}
          />
          <FormControl
            className={"muscle-input-create"}
            label="Musculos implicados:"
            typeControl="select"
            name="muscleEx"
            onChange={handleChange}
          >
            <Options
              arrayOptions={[
                "Espalda",
                "Pectoral",
                "Hombro",
                "Abdomen",
                "Biceps",
                "Triceps",
              ]}
            />
          </FormControl>
          <FormControl
            className={"type-input-create"}
            label="Tipo de ejercicio:"
            typeControl="select"
            name="typeEx"
            onChange={handleChange}
          >
            <Options
              arrayOptions={[
                "Peso adicional",
                "Peso asistido",
                "Duracion",
                "Solo rep",
              ]}
            />
          </FormControl>
        </Form>
      </Create>
    </>
  );
};

export { CreateExercise };
