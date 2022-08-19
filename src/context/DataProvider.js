import React, { createContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ROUTINES_AND_USER_BY_TOKEN } from "../data/query";
import Cookies from "universal-cookie/es6";
const cookies = new Cookies();
const session_token = cookies.get('session-token')

export const DataContext = createContext()

export const DataProvider = ({children}) => {

    const [errorData,updateErrorData] = useState(false),
    [loadingData,updateLoadingData] = useState(false),
    [me,updateMe] = useState({}),
    [routines,updateRoutines] = useState([])

    const {data,loading,error ,refetch} = useQuery(GET_ROUTINES_AND_USER_BY_TOKEN, {
        variables:{
            token:session_token
        }
    })

    useEffect(() => {
        if(!data) updateLoadingData(true)
        if(error) updateErrorData(error)
        if(data){
            const {getRoutinesByToken,getUser} = data
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
            errorData,
            loadingData
        }}
        >
        {children}
        </DataContext.Provider>
    )
}