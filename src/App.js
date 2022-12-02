import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { SingIn } from "./components/Login/SignIn";
import { SingUp } from "./components/Login/SignUp";
import Cookies from "universal-cookie/es6";
import { Dashboard } from "./components/Dashboard";

import { RoutineCrud } from "./components/Routines/RoutineCrud";

import { DataProvider } from './context/DataProvider';

const App = () => {
  
  const cookies = new Cookies();

  const [routineOnPlay,updateRoutineOnPlay] = useState({active:false,id:null});
  const token = localStorage.getItem('token');

  useEffect(() => {
    
  })

  return (
    <Router>
      <Routes>{
        token ?
        (
          <>
            <Route path="/" element={
              <DataProvider>
                <Dashboard updateRoutineOnPlay={updateRoutineOnPlay}/>
              </DataProvider>
            }/>
            <Route path="/routine" element={ <RoutineCrud routineObj={routineOnPlay}/>}/>
            <Route path="/signup" element={ <Navigate to={"/"}/> }/>
            <Route path="/signin" element={ <Navigate to={"/"}/> }/>
          </>
        )
        :
        (
          <>
            <Route path="/signup" element={ <SingUp/> } />
            <Route path="/signin" element={ <SingIn/>}/>
            <Route path="/" element={ <Navigate to={'/signin'}/> }/>
          </>
        )
      }
      </Routes>
    </Router>
  );
}

export default App;
