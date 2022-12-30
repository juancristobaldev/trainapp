import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataProvider";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useWidthScreen } from "../../hooks/useWidthScreen";
import { ContainerSearch } from "../ContainerSearch";
import { Folder } from "../Folders/Folder";
import { Button } from "../generals/Button";
import { Container } from "../generals/Container";
import { Section } from "../generals/Section";
import { Text } from "../generals/Text";
import { ListApi } from "../Lists/ListApi";
import { Routine } from "../Routines/Routine";

const FoldersBoard = ({ updateModalCreateFolder, updateRoutineOnPlay }) => {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState(""),
    [back, setBack] = useState({ active: false, id: null, folder: null });

  const { routines, folders, loadingData, errorData } = useContext(DataContext);

  const { darkMode } = useDarkMode(),
    { widthScreen } = useWidthScreen();

  return (
    <Section className={"folders"}>
      {" "}
      {back.active && (
        <Container
          onClick={() => setBack({ active: false, id: null, folder: null })}
          className={"back unblur"}
        />
      )}
      <ContainerSearch
        searchValues={searchValue}
        data={folders}
        name={"folders"}
        button={{
          text: "+ Crear",
          function: () => updateModalCreateFolder(true),
        }}
        classContainer={"container-search"}
        classDiv={"div-search"}
        classSpan={"design-search"}
        classList={`section-list-folders ${darkMode && "darkMode"}`}
        textSearch={"Buscar carpeta..."}
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
            <Text text={`No existen busquedas con "${searchValue}"`} />
          </Container>
        )}
        onEmpty={() => (
          <Container className={"container-center"}>
            <Text text={"Crea tu primera carpeta 🏋️"} />
          </Container>
        )}
        render={(folder) => (
          <Folder
            widthScreen={widthScreen}
            routines={routines}
            key={folder.id}
            folder={folder}
            classNameFolder={"folder-container"}
            darkMode={darkMode}
          >
            <ListApi
              data={JSON.parse(folder.content)}
              className={"folder-list-routines"}
              loading={loadingData}
              onLoading={() => (
                <Container className={"container-center"}>
                  <Text text={"Cargando..."} />
                </Container>
              )}
              onError={() => (
                <Container className={"container-center"}>
                  <Text text={"Oops hay un error..."} />
                </Container>
              )}
              onEmpty={() => (
                <Container className={"container-center"}>
                  <Text text={"No has agregado ninguna rutina..."} />
                </Container>
              )}
              render={(routine) => (
                <Routine
                  key={routine.id}
                  routine={routine}
                  classNameContainer={`container-routine-on-folder ${
                    folder.id === back.folder &&
                    routine.id === back.id &&
                    back.active &&
                    "top"
                  }`}
                  classNameHeader={"container-routine-on-folder-header"}
                  sandwichFunction={setBack}
                  sandwichMode={true}
                  backinfo={{
                    folder: folder.id,
                    active: back.active,
                    id: routine.id,
                  }}
                >
                  {back.active &&
                    back.id === routine.id &&
                    back.folder === folder.id && (
                      <>
                        <Container className={"routine-container-stats"}>
                          <Text
                            text={`Tiempo record 🎉: ${routine.timeRecord}`}
                          />
                          <Text text={`Veces realizadas: ${routine.dones}`} />
                          <Text
                            text={`Ejercicios: ${
                              JSON.parse(routine.exercises).length
                            }`}
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
                      </>
                    )}
                </Routine>
              )}
            />
          </Folder>
        )}
      />
    </Section>
  );
};

export { FoldersBoard };
