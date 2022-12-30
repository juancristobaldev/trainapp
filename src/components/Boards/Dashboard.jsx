import React, { useContext, useState } from "react";
import Cookies from "universal-cookie/es6";
import { useNavigate, Navigate } from "react-router-dom";
import { Container } from "../generals/Container";
import { Main } from "../generals/Main";
import { Section } from "../generals/Section";
import { Routine } from "../Routines/Routine";

import { ImHome } from "react-icons/im";
import { IoDocumentTextSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiFoldersFill } from "react-icons/ri";
import { MdDarkMode, MdLightMode, MdClose } from "react-icons/md";
import { BsFillDoorOpenFill } from "react-icons/bs";

import "../../styles/Dashboard.scss";
import "../../styles/responsive/Dashboard.scss";

import { Button } from "../generals/Button";
import { Text } from "../generals/Text";
import { ListApi } from "../Lists/ListApi";
import { Checkbox, Switch } from "@mui/material";
import { DataContext } from "../../context/DataProvider";
import { Loading } from "../Loading";

import { Modal } from "../Modal/Modal";

import { useMutation } from "@apollo/client";
import { DELETE_ROUTINE } from "../../data/mutations";
import { GET_ROUTINES_FOLDERS_USER_BY_TOKEN } from "../../data/query";
import { ButtonIcon } from "../ButtonIcon";
import { ContainerSearch } from "../ContainerSearch";
import { Folder } from "../Folders/Folder";
import { ModalAreUSure } from "../Modal/ModalAreUSure";
import { CreateFolder } from "../Folders/CreateFolder";
import { useWidthScreen } from "../../hooks/useWidthScreen";
import { useDarkMode } from "../../hooks/useDarkMode";
import { RoutineCrud } from "../Routines/RoutineCrud";
import { HomeBoard } from "./HomeBoard";
import { RoutinesBoard } from "./RoutinesBoard";
import { FoldersBoard } from "./FoldersBoard";

const Dashboard = ({ updateRoutineOnPlay }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token"),
    [error, setError] = useState(null),
    [stateNav, updateStateNav] = useState("none"),
    [modalDelete, updateModalDelete] = useState({
      boolean: false,
      item: { id: null, name: null },
    }),
    [view, updateView] = useState("home"),
    [searchValues, updateSearchValues] = useState({
      routines: "",
      folders: "",
    }),
    [modalCreateFolder, updateModalCreateFolder] = useState(false),
    [back, updateBack] = useState({ active: false, id: null, folder: null }),
    [deleteRoutine, { loading: loadingDeleteRoutine }] =
      useMutation(DELETE_ROUTINE);

  const { widthScreen } = useWidthScreen(),
    { darkMode, updateDarkMode } = useDarkMode();

  const { routines, me, folders, loadingData } = useContext(DataContext);

  console.log(routines, me, folders);

  const searchSomething = (e) => {
    updateSearchValues({ ...searchValues, [e.target.name]: e.target.value });
  };

  const closeSesion = async () => {
    await localStorage.removeItem("token");
    window.location.reload();
  };

  const deleteRoutineDB = async (id) =>
    await deleteRoutine({
      variables: {
        input: {
          id: id,
        },
      },
      refetchQueries: [{ query: GET_ROUTINES_FOLDERS_USER_BY_TOKEN }],
    }).then(({ data }) => {
      const { errors, success } = data.deleteRoutine;
      if (errors) console.log(errors);
      if (success)
        updateModalDelete({ boolean: false, item: { name: null, id: null } });
    });

  if (token) {
    return (
      <Main
        style={
          darkMode
            ? { backgroundColor: "#082032", color: "white" }
            : { background: "white" }
        }
        className={`main-dashboard ${darkMode && "darkMode"} ${
          widthScreen > 650 && "grid-web"
        }`}
      >
        {(loadingData || loadingDeleteRoutine) && <Loading />}
        {!loadingData && (
          <>
            <nav
              className={`section-nav-dashboard ${
                widthScreen > 650 && "nav-big-screen"
              }`}
            >
              <h3 className="app">WorkOut App</h3>
              <h3 className={`view ${widthScreen > 650 && "web"}`}>
                {view === "home"
                  ? "Inicio"
                  : view === "routines"
                  ? "Rutinas"
                  : view === "folders"
                  ? "Carpetas"
                  : "Mi perfil"}
              </h3>
              {widthScreen < 650 && (
                <GiHamburgerMenu
                  cursor={"pointer"}
                  onClick={() => updateStateNav("actived")}
                />
              )}
            </nav>
            {(stateNav === "actived" || widthScreen > 650) && (
              <Container
                className={` menu ${
                  widthScreen > 650
                    ? "active web"
                    : stateNav === "none"
                    ? ""
                    : stateNav === "actived"
                    ? "active"
                    : "unactived"
                }
                    `}
              >
                {widthScreen < 650 && (
                  <Container className={"header-menu"}>
                    <h3>Menu</h3>
                    <MdClose
                      fill={darkMode ? "white" : "black"}
                      cursor={"pointer"}
                      onClick={() => updateStateNav("unactived")}
                    />
                  </Container>
                )}
                <ButtonIcon
                  icon={<ImHome />}
                  onClick={() => {
                    updateStateNav("unactived");
                    updateView("home");
                  }}
                  classNameContainer={`button-menu home ${
                    view === "home" && true
                  }`}
                  textButton={"Inicio"}
                />
                <ButtonIcon
                  icon={<IoDocumentTextSharp />}
                  onClick={() => {
                    updateStateNav("unactived");
                    updateView("routines");
                  }}
                  classNameContainer={`button-menu ${
                    view === "routines" && true
                  }`}
                  textButton={"Rutinas"}
                />
                <ButtonIcon
                  icon={<RiFoldersFill />}
                  onClick={() => {
                    updateStateNav("unactived");
                    updateView("folders");
                  }}
                  classNameContainer={`button-menu ${
                    view === "folders" && true
                  }`}
                  textButton={"Carpetas"}
                />
                <ButtonIcon
                  icon={<BsFillDoorOpenFill />}
                  classNameContainer={`button-menu`}
                  textButton={"Cerrar sesion"}
                  onClick={() => closeSesion()}
                />
                <Container className={"viewMode"}>
                  <MdLightMode fill={!darkMode ? "#e94560" : "white"} />
                  <Switch
                    checked={darkMode}
                    onChange={() => updateDarkMode(!darkMode)}
                  />
                  <MdDarkMode fill={darkMode ? "#e94560" : undefined} />
                </Container>
              </Container>
            )}
            {view === "home" && (
              <HomeBoard updateRoutineOnPlay={updateRoutineOnPlay} />
            )}
            {view === "routines" && (
              <RoutinesBoard
                updateRoutineOnPlay={updateRoutineOnPlay}
                updateModalDelete={updateModalDelete}
              />
            )}
            {view === "folders" && (
              <FoldersBoard
                updateModalCreateFolder={updateModalCreateFolder}
                updateRoutineOnPlay={updateRoutineOnPlay}
              />
            )}
            {modalDelete.boolean && (
              <ModalAreUSure
                text={"Si eliminas la rutina no podras recuperarla despues..."}
                acceptFunction={() => deleteRoutineDB(modalDelete.item.id)}
                cancelFunction={() => updateModalDelete({ boolean: false })}
              />
            )}
            {modalCreateFolder && (
              <>
                <Container className={`back ${darkMode && "darkMode"}`} />
                <CreateFolder
                  updateRoutineOnPlay={updateRoutineOnPlay}
                  token={token}
                  routines={routines}
                  closeFunction={() => updateModalCreateFolder(false)}
                />
              </>
            )}
          </>
        )}
      </Main>
    );
  } else {
    <Navigate to="/signin" />;
  }
};

export { Dashboard };
