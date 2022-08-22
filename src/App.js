import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { SingIn } from "./components/Login/SignIn";
import { SingUp } from "./components/Login/SignUp";
import Cookies from "universal-cookie/es6";
import { Dashboard } from "./components/Dashboard";
import { CreateRoutine } from "./components/Create/CreateRoutine";
import { GoRoutine } from "./components/GoRoutine";


function App() {
  const cookies = new Cookies();
  const [darkMode,updateDarkMode] = useState(false),
  [routineOnPlay,updateRoutineOnPlay] = useState({active:false,id:null})
  const token = cookies.get('session-token')
  
  return (
    <Router>
      <Routes>{
        token ?
        (
          <>
            <Route path="/" element={<Dashboard updateRoutineOnPlay={updateRoutineOnPlay} viewMode={{darkMode:darkMode,updateDarkMode:updateDarkMode}}/>}/>
            <Route path="/create-routine" element={ <CreateRoutine/> }/>
            <Route path="/go-routine" element={ <GoRoutine routine={routineOnPlay}/> }/>
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
