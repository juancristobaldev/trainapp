import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { SingIn } from "./components/Login/SignIn";
import { SingUp } from "./components/Login/SignUp";
import Cookies from "universal-cookie/es6";
import { Dashboard } from "./components/Dashboard";
import { CreateRoutine } from "./components/Create/CreateRoutine";

function App() {
  const cookies = new Cookies();
  const [id,setID] = useState({key:0})
  const [data,setData] = useState([])
  const [darkMode,updateDarkMode] = useState(false)

  const token = cookies.get('session-token')

  return (
    <Router>
      <Routes>
        <Route path="/" element={ token  ? <Dashboard viewMode={{darkMode:darkMode,updateDarkMode:updateDarkMode}}/> : <Navigate to={'/signin'}/>}/>
        <Route path="/signup" element={ token  ? <Navigate to={'/'}/> : <SingUp/>}/>
        <Route path="/signin" element={ token  ? <Navigate to={'/'}/> : <SingIn setID={setID}/>}/>
        <Route path="/create-routine" element={ token ? <CreateRoutine/> : <Navigate to={'/signin'}/>} />
      </Routes>
    </Router>
  );
}

export default App;
