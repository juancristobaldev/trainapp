import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { CREATE_FOLDER } from "../../data/mutations";
import {
  GET_ROUTINES_BY_TOKEN,
  GET_ROUTINES_FOLDERS_USER_BY_TOKEN,
} from "../../data/query";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useList } from "../../hooks/useList";
import { useWidthScreen } from "../../hooks/useWidthScreen";
import { FormControl } from "../Form/FormControl";

import { Button } from "../generals/Button";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import { ListArray } from "../Lists/ListArray";
import { ListRoutines } from "../Lists/ListRoutines";
import { Loading } from "../Loading";

import { ModalSelect } from "../Modal/ModalSelect";
import { Routine } from "../Routines/Routine";

import "../../styles/responsive/Folder.scss";
import { List } from "../Lists/List";

const CreateFolder = ({ token, closeFunction, updateRoutineOnPlay }) => {
  const [createFolder] = useMutation(CREATE_FOLDER);
  const [errors, updateErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [state, updateState] = useState({
    listOnCreate: [],
    dataFormCreate: {
      name: "",
      content: [],
    },
    modal: false,
  });

  const { dataFormCreate, modal } = state;

  const handleChange = (e) => {
    updateState({
      ...state,
      dataFormCreate: { ...dataFormCreate, [e.target.name]: e.target.value },
    });
  };

  const { widthScreen } = useWidthScreen(),
    { darkMode } = useDarkMode();

  const { deleteItem } = useList(
    "content",
    { state: state, updateState: updateState },
    false,
    { nameGql: "getRoutines", gql: GET_ROUTINES_BY_TOKEN }
  );

  const handleSubmit = async (e) => {
    const errors = {};
    if (!dataFormCreate.name.length)
      errors.name = "Ingresa un nombre para tu rutina";
    if (!dataFormCreate.content.length)
      errors.content = "Debes seleccionar al menos una rutina...";
    const arrErrors = Object.values(errors);

    if (arrErrors.length === 0) {
      setLoading(true);
      const variables = {
        ...dataFormCreate,
        content: JSON.stringify(dataFormCreate.content),
      };

      console.log(variables);
      await createFolder({
        variables: {
          input: variables,
        },
        refetchQueries: [{ query: GET_ROUTINES_FOLDERS_USER_BY_TOKEN }],
      }).then(async () => {
        await setLoading(false);
        closeFunction();
      });
    } else updateErrors(errors);
  };

  useEffect(() => {
    updateErrors([]);
  }, [dataFormCreate]);

  return (
    <>
      {loading && <Loading />}
      {!modal && (
        <ModalSelect
          title={"Carpeta nueva"}
          functionClose={closeFunction}
          classNameHeader={"modal-add-routines-header"}
          classNameModal={`modal-add-routines ${widthScreen > 650 && "web"} ${
            darkMode && "darkMode"
          }`}
          textSelect
          list={
            <>
              <ListArray
                errors={errors.content}
                className={"list-routines-folder"}
                data={dataFormCreate.content}
                onError={() => (
                  <Container className={"container-center"}>
                    <Text text={"Hay un error..."} />
                  </Container>
                )}
                onEmpty={() => (
                  <Container className={"container-center"}>
                    <Text text={"Agrega tu primera rutina..."} />
                  </Container>
                )}
                render={(routine) => (
                  <Routine
                    routine={routine}
                    key={routine.id}
                    classNameContainer={"container-routine-folder"}
                    header={
                      <Container className={"routine-header"}>
                        <Text text={routine.name} />
                        <Container
                          onClick={() => deleteItem(routine)}
                          className={`close-button ${darkMode && "darkMode"}`}
                        >
                          <IoMdClose />
                        </Container>
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
                )}
              />
            </>
          }
          childrenTop={
            <FormControl
              error={[errors.name]}
              value={state.dataFormCreate.name}
              typeControl={"input"}
              label={"Nombre:"}
              className={"name-folder"}
              placeholder="Ingresa un nombre para tu carpeta..."
              type={"text"}
              name={"name"}
              onChange={(e) => handleChange(e)}
            />
          }
          childrenBottom={
            <Container className={"buttons"}>
              <Button
                className={"add"}
                onClick={(e) => updateState({ ...state, modal: true })}
                textButton={"Agregar rutinas"}
              />
              <Button
                className={"create"}
                onClick={(e) => handleSubmit(e)}
                textButton={"Crear carpeta"}
              />
            </Container>
          }
        />
      )}
      {modal && (
        <ListRoutines
          token={token}
          type="routines"
          placeHolderSearch="Buscar rutinas..."
          textOnEmpty="Tu lista de rutinas esta vacia..."
          titleList={"Lista de rutinas"}
          updateRoutineOnPlay={updateRoutineOnPlay}
          objHookList={{
            content: "content",
            stateObj: { state: state, updateState: updateState },
            repeat: false,
            apollo: { nameGql: "getRoutines", gql: GET_ROUTINES_BY_TOKEN },
          }}
        />
      )}
    </>
  );
};

export { CreateFolder };
