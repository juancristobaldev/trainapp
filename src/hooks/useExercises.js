import React, { useEffect, useState } from "react";
import { getErrorsForm } from "../components/functions/getFormsError";
import { CREATE_EXERCISE, DELETE_EXERCISE } from "../data/mutations";
import { useMutation } from "@apollo/client";
import { GET_EXERCISES_BY_TOKEN } from "../data/query";

const useExercises = (token, objectList, state) => {
  const { stateValue, setState } = state;

  const [dataFormCreateExercise, setDataFormCreateExercise] = useState({
    name: "",
    typeEx: "Peso adicional",
    muscleEx: "Espalda",
    seriesEx: JSON.stringify([]),
  });
  const [errors, setErrors] = useState({});
  const [loadingStatus, updateLoading] = useState(false);

  const [createExercise, { loading: loadingCreate }] =
    useMutation(CREATE_EXERCISE);
  const [deleteExercise, { loading: loadingDelete }] =
    useMutation(DELETE_EXERCISE);

  const deleteSomeExercise = async (confirmation) => {
    const { list, updateList } = objectList;
    let filter = list.filter((item) => item.select === true);

    if (filter.length > 0 || confirmation) {
      if (filter.length === 0) filter = [...stateValue.modalDelete.items];

      if (confirmation) {
        filter.forEach(async (item) => {
          await deleteExercise({
            variables: {
              input: {
                id: item.id,
              },
            },
            refetchQueries: [
              {
                query: GET_EXERCISES_BY_TOKEN,
              },
            ],
          }).then(async ({ data }) => {
            const { errors, success } = data.deleteExercise;

            if (errors) console.log(errors);
            if (success) console.log("Ejercicio/s eliminados correctamente");

            setState({
              ...stateValue,
              modal: true,
              modalDelete: { boolean: false, items: [] },
            });
          });
        });
      } else {
        const objDelete = {
          boolean: true,
          items: [],
        };
        filter.forEach((item) => {
          objDelete.items.push(item);
        });
        setState({ ...stateValue, modal: false, modalDelete: objDelete });
      }
    }
  };

  const handleChange = (e, name) => {
    const newData = { ...dataFormCreateExercise };
    newData[name] = e.target.value;
    setDataFormCreateExercise(newData);
  };

  const createNewExercise = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const { list, updateList } = objectList;
    const { stateValue, setState } = state;

    const arrayFusion = [...list, ...stateValue.listOnCreate];

    if (dataFormCreateExercise.name.length === 0)
      newErrors.name = "Debes ingresar un nombre para tu ejercicio.";
    const index = arrayFusion.findIndex(
      (item) => item.name === dataFormCreateExercise.name
    );
    if (index >= 0)
      newErrors.alreadyExist = "Ya creaste un ejercicio con este nombre.";

    const arrErrors = Object.values(newErrors);

    if (arrErrors.length > 0) {
      setErrors(newErrors);
    } else {
      await createExercise({
        variables: {
          input: { ...dataFormCreateExercise },
        },
        refetchQueries: [{ query: GET_EXERCISES_BY_TOKEN }],
      }).then(async ({ data }) => {
        const { errors, success } = data.createExercise;
        const filt = [...list];

        if (success) console.log("Ejercicio creado con exito");
        if (errors) console.log(errors);

        if (stateValue.listOnCreate.length > 0) {
          stateValue.listOnCreate.forEach((item) => {
            const index = filt.findIndex((filt) => filt.name === item.name);
            filt.splice(index, 1);
          });
        }

        setState({
          ...stateValue,
          searchValue: "",
          modalCreate: false,
          modal: true,
        });
        setTimeout(() => {
          updateList(filt);
        }, 50);
      });
    }
  };

  if (loadingStatus) console.log(true);

  useEffect(() => {
    setErrors({});
    if (loadingCreate == true || loadingDelete == true) updateLoading(true);
    else if (
      loadingCreate == false &&
      loadingDelete == false &&
      loadingStatus == true
    )
      updateLoading(false);
  }, [
    dataFormCreateExercise,
    stateValue.modal,
    stateValue.modalCreate,
    loadingDelete,
    loadingCreate,
  ]);

  return {
    createNewExercise,
    deleteSomeExercise,
    handleChange,
    errors,
    setErrors,
    loadingStatus,
  };
};

export { useExercises };
