import React, { createContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ROUTINES_FOLDERS_USER_BY_TOKEN } from "../data/query";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [errorData, updateErrorData] = useState(false),
    [loadingData, updateLoadingData] = useState(false),
    [me, updateMe] = useState({}),
    [routines, updateRoutines] = useState([]),
    [folders, updateFolders] = useState([]);

  const { data, error } = useQuery(GET_ROUTINES_FOLDERS_USER_BY_TOKEN);

  useEffect(() => {
    if (!data) updateLoadingData(true);
    if (error) updateErrorData(error);
    if (data) {
      const { getRoutines, getUser, getFolders } = data;
      updateFolders(getFolders);
      updateLoadingData(false);
      updateMe(getUser);
      updateRoutines(getRoutines);
    }
  });

  return (
    <DataContext.Provider
      value={{
        routines,
        me,
        folders,
        errorData,
        loadingData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
