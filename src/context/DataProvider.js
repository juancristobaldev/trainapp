import React, { createContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ROUTINES_FOLDERS_USER_BY_TOKEN } from "../data/query";
import Cookies from "universal-cookie/es6";
const cookies = new Cookies();
const session_token = cookies.get('session-token')

export const DataContext = createContext()

export const DataProvider = ({children}) => {

    const [errorData,updateErrorData] = useState(false),
    [loadingData,updateLoadingData] = useState(false),
    [me,updateMe] = useState({}),
    [routines,updateRoutines] = useState([]),
    [folders,updateFolders] = useState([])

    const {data,error} = useQuery(GET_ROUTINES_FOLDERS_USER_BY_TOKEN, {
        variables:{
            token:session_token
        }
    })

    useEffect(() => {
        if(!data) updateLoadingData(true)
        if(error) updateErrorData(error)
        if(data){
            const {getRoutinesByToken,getUser, getFoldersByToken} = data;
            updateFolders(getFoldersByToken)
            updateLoadingData(false)
            updateMe(getUser)
            updateRoutines(getRoutinesByToken)
        }
    })

    return (
        <DataContext.Provider
        value={{
            routines,
            me,
            folders,
            errorData,
            loadingData
        }}
        >
        {children}
        </DataContext.Provider>
    )
}