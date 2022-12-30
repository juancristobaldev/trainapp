import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataProvider";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useWidthScreen } from "../../hooks/useWidthScreen";
import { ContainerSearch } from "../ContainerSearch";
import { Button } from "../generals/Button";
import { Container } from "../generals/Container";
import { Section } from "../generals/Section";
import { Text } from "../generals/Text";
import { Routine } from "../Routines/Routine";

const RoutinesBoard = ({ updateRoutineOnPlay, updateModalDelete }) => {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");

  const { routines, loadingData, errorData } = useContext(DataContext);

  const { darkMode } = useDarkMode();

  const { widthScreen } = useWidthScreen();

  return (
    <Section className={"routines"}>
      <ContainerSearch
        searchValues={searchValue}
        data={routines}
        button={{
          function: async () => {
            await updateRoutineOnPlay({
              active: false,
              id: false,
              routine: false,
            });
            navigate("/routine");
          },
          text: "+ Crear",
          className: "create-routine",
        }}
        classContainer={"container-search"}
        classDiv={"div-search"}
        classSpan={"design-search"}
        classList={`section-list-routines ${darkMode && "darkMode"}`}
        textSearch={"Buscar rutina..."}
        onChange={(e) => setSearchValue(e.target.value)}
        onError={() => (
          <Container className={"container-center"}>
            <Text text={"Ooops hay un error..."} />
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
            <Text text={"Crea tu primera rutina 🏋️"} />
          </Container>
        )}
        render={(routine) => (
          <Routine
            routine={routine}
            key={routine.id}
            popOver={true}
            darkMode={darkMode}
            classNameContainer={`routine-container
                            ${darkMode && "darkMode"}`}
            classNameHeader={"routine-container-header"}
            childrenPopover={
              <>
                <Text
                  className={"optionMenu"}
                  text={"Editar"}
                  onClick={async () => {
                    await updateRoutineOnPlay({
                      active: false,
                      id: routine.id,
                      routine: routine,
                    });
                    navigate("/routine");
                  }}
                />
                <Text
                  className={"optionMenu"}
                  onClick={() =>
                    updateModalDelete({
                      boolean: true,
                      item: {
                        id: routine.id,
                        name: routine.nameRoutine,
                      },
                    })
                  }
                  style={{ color: "red" }}
                  text={"Eliminar"}
                />
              </>
            }
          >
            <Container className={"routine-container-stats"}>
              <Text text={`Tiempo record 🎉: ${routine.timeRecord}`} />
              <Text text={`Veces realizadas: ${routine.dones}`} />
              <Text
                text={`Ejercicios: ${JSON.parse(routine.exercises).length}`}
              />
            </Container>
            <Container className={"routine-container-button"}>
              <Button
                onClick={async () => {
                  await updateRoutineOnPlay({
                    active: true,
                    id: routine.id,
                    routine: routine,
                  });
                  navigate("/routine");
                }}
                textButton={"Empezar rutina"}
              />
            </Container>
          </Routine>
        )}
      ></ContainerSearch>
    </Section>
  );
};

export { RoutinesBoard };
