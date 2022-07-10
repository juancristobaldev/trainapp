import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { SingIn } from "./components/Login/SignIn";
import { SingUp } from "./components/Login/SignUp";
import Cookies from "universal-cookie/es6";
import { Dashboard } from "./components/Dashboard";

function App() {
  const cookies = new Cookies();
  const [id,setID] = useState({key:0})
  const [data,setData] = useState([])
  console.log(id,data)

  const saveCookies = (object) => {
    cookies.set( 'user', JSON.stringify(object) , {
      path: '/',
      maxAge:86400
    })
  }
  
  const getUser = async (key) => {
    fetch(`http://localhost:3001/api/users/${key}`)
    .then(response => response.json())
    .then(data => setData(data));
  }

  if(data.length > 0) saveCookies(data[0]);
  
  useEffect(() => {
      const { key } = id
      if(key > 0){
        getUser(key)
      }
  },[id])

  const user = cookies.get('user')
  console.log(user)

  return (
    <Router>
      <Routes>
        <Route path="/" element={ user  ? <Dashboard/> : <Navigate to={'/signin'}/>}/>
        <Route path="/signup" element={ user  ? <Navigate to={'/'}/> : <SingUp/>}/>
        <Route path="/signin" element={ user  ? <Navigate to={'/'}/> : <SingIn setID={setID}/>}/>
      </Routes>
    </Router>
  );
}

export default App;
