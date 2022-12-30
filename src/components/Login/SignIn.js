import React, { useEffect, useState } from "react";
import { FormControl } from "../Form/FormControl";
import { Form } from "../Form/Form";
import { ChangeSign } from "./ChangeSign";
import { Main } from "../generals/Main";

import { USER_SIGN_IN } from "../../data/mutations";
import { useMutation } from "@apollo/client";
import Cookies from "universal-cookie/es6";

import "../../styles/SignIn.scss";
import "../../styles/responsive/SignIn.scss";
import { Container } from "../generals/Container";
import { Loading } from "../Loading";

const SingIn = () => {
  const cookies = new Cookies();
  const [userSignIn, { loading }] = useMutation(USER_SIGN_IN);

  const [dataFormLogin, setDataFormLogin] = useState({
    user: "",
    pass: "",
  });
  const [error, setError] = useState({});

  const handleChange = (e, name) => {
    const newData = { ...dataFormLogin };
    newData[name] = e.target.value;
    setDataFormLogin(newData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { user, pass } = dataFormLogin,
      newErrors = {};

    if (!user) newErrors.user = "Ingresa un nombre de usuario.";
    if (!pass) newErrors.pass = "Ingresa una contraseña.";

    const errorsArray = Object.values(newErrors);

    if (errorsArray.length === 0) {
      await userSignIn({
        variables: {
          input: {
            ...dataFormLogin,
          },
        },
      }).then(async ({ data }) => {
        console.log(data);
        const { success, errors, token } = data.userSignIn;
        if (success) {
          await localStorage.setItem("token", token);
          window.location.reload();
        } else {
          setError(JSON.parse(errors));
        }
      });
    } else {
      setError({ ...newErrors });
    }
  };
  console.log(error);

  useEffect(() => {
    setError([]);
  }, [dataFormLogin]);

  return (
    <>
      {loading && <Loading />}
      <Main className={"main-signin"}>
        <Form
          autoComplete={"off"}
          className={"form-signin"}
          textSubmit="Iniciar sesion"
          onSubmit={handleSubmit}
          alter={true}
          onAlter={() => (
            <ChangeSign
              className={"alter-form"}
              text={"¿No tienes cuenta?"}
              textButton={"Crea una cuenta aqui"}
              route={"/signup"}
            />
          )}
        >
          <Container className={"header-signin"}>
            <h1>Iniciar sesion</h1>
            <h3>Ingresa tus credenciales...</h3>
          </Container>
          <FormControl
            autoComplete={"new-user"}
            error={[error.user_auth, error.user]}
            className={"div-input user"}
            typeControl="input"
            type="text"
            label="Usuario:"
            name="user"
            onChange={handleChange}
          />
          <FormControl
            error={[error.user_pass, error.pass]}
            className={"div-input pass"}
            typeControl="input"
            type="password"
            label="Contraseña:"
            name="pass"
            onChange={handleChange}
          />
        </Form>
        <Container className="container-doit">
          <h4>WorkOut App</h4>
        </Container>
      </Main>
    </>
  );
};

export { SingIn };
