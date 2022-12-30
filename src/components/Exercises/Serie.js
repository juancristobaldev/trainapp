import React from "react";
import { HiLockClosed } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { useSeries } from "../../hooks/useSeries";
import CheckBox from "../Checkbox";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import { InputSerie } from "../InputSerie";

const Serie = ({ serie, exercise, state, active, id, getDataRoutine }) => {
  const { deleteSeries, checkSerie, classControl } = useSeries(state);

  return (
    <Container
      key={serie.idSerie}
      className={
        classControl(exercise.typeEx) +
        ` serie ${serie.checked === true ? "checked" : false}`
      }
    >
      <Container className={"delete-serie"}>
        <IoMdClose onClick={() => deleteSeries(serie, exercise)} />
      </Container>
      <Text text={serie.lastMoment ? serie.lastMoment : "-"} />
      <>
        {exercise.typeEx === "Peso adicional" ||
        exercise.typeEx === "Peso asistido" ? (
          <>
            <InputSerie
              className={"input-type"}
              style={{ width: "35%" }}
              name={exercise.name}
              idList={exercise.idList}
              type="number"
              objEx={{
                nameInput: "other",
                idList: exercise.idList,
                serie: serie.idSerie,
              }}
              onChange={getDataRoutine}
            />
            <InputSerie
              className={"input-reps"}
              style={{ width: "35%" }}
              name={exercise.name}
              objEx={{
                nameInput: "reps",
                idList: exercise.idList,
                serie: serie.idSerie,
              }}
              onChange={getDataRoutine}
              type="number"
            />
          </>
        ) : exercise.typeEx === "Duracion" ? (
          <InputSerie
            className={"input-duracion"}
            className="inputSerie"
            name={exercise.name}
            idList={exercise.idList}
            objEx={{
              nameInput: "time",
              idList: exercise.idList,
              serie: serie.idSerie,
            }}
            onChange={getDataRoutine}
            style={{ width: "50%" }}
            type="time"
          />
        ) : (
          <InputSerie
            className={"input-reps"}
            className="inputSerie"
            name={exercise.name}
            idList={exercise.idList}
            objEx={{
              nameInput: "reps",
              idList: exercise.idList,
              serie: serie.idSerie,
            }}
            onChange={getDataRoutine}
            style={{ width: "35%" }}
            type="number"
          />
        )}
        {active && id ? (
          <CheckBox
            style={
              !serie.checked && serie.need
                ? { border: "1px solid red" }
                : { border: 0 }
            }
            onClick={() => checkSerie(serie, exercise)}
            className={serie.checked ? "checkBoxOn" : "checkBoxOff"}
            select={serie.checked}
          />
        ) : (
          <Container className={"lock"}>
            <HiLockClosed />
          </Container>
        )}
      </>
    </Container>
  );
};

export { Serie };
