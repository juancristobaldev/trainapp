import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataProvider";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useWidthScreen } from "../../hooks/useWidthScreen";
import { Button } from "../generals/Button";
import { Container } from "../generals/Container";
import { Section } from "../generals/Section";
import { Text } from "../generals/Text";
import { ListApi } from "../Lists/ListApi";
import { Routine } from "../Routines/Routine";

const HomeBoard = ({ updateRoutineOnPlay }) => {
  const { me, error, loadingData } = useContext(DataContext);

  const { widthScreen } = useWidthScreen();

  const { darkMode } = useDarkMode();

  const navigate = useNavigate();

  return (
    <Section className={"home"}>
      <Container className="container-user-dashboard">
        <h2>¡Hola {me.first_name}!</h2>
        <Text text={"¿Que entrenaras hoy?"} />
      </Container>
      <Container className={"header-last-workouts"}>
        <Text text={"Tus ultimos entrenamientos:"} />
      </Container>
      <ListApi
        className={`list-last-routines ${widthScreen > 650 && "web"}`}
        error={error}
        loading={loadingData}
        data={
          me.last_workouts === undefined ? [] : JSON.parse(me.last_workouts)
        }
        onError={() => <Text text={"Ooops hay un error..."} />}
        onLoading={() => <Text text={"Cargando..."} />}
        onEmpty={() => (
          <Container
            style={{
              height: "100%",
              display: "flex",
            }}
          >
            <Text
              style={{
                width: "100%",
                placeSelf: "center",
                textAlign: "center",
                opacity: "40%",
              }}
              text={"No has utilizado ninguna rutina 🏋️"}
            />
          </Container>
        )}
        render={(routine) => (
          <Routine
            key={routine.id}
            routine={routine}
            popOver={false}
            classNameContainer={`routine-container home-routine ${
              darkMode && "darkMode"
            }`}
            classNameHeader={"routine-container-header"}
          >
            <Container className={"routine-container-stats"}>
              <Text text={`Record 🎉: ${routine.timeRecord}`} />
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
      />
      <Container className={"footer"}></Container>
    </Section>
  );
};

export { HomeBoard };
