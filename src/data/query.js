import { gql } from "@apollo/client";

export const GET_EXERCISES_BY_TOKEN = gql`
query getExercises{
    getExercises{
            id
            name
            typeEx
            muscleEx
            seriesEx
    }
}`

export const GET_ROUTINES_AND_USER_BY_TOKEN = gql`
    query{
        getRoutines{
            id
            name
            dones
            timeRecord
            exercises
    }
        getUser{
            id
            user
            first_name
            last_name
            email
            date
            pass
            token
            last_workouts
        }
    }
`
export const GET_ROUTINES_FOLDERS_USER_BY_TOKEN = gql`
    query{
        getRoutines{
            id
            name
            dones
            timeRecord
            exercises
    }
        getUser{
            id
            user
            first_name
            last_name
            email
            date
            pass
            token
            last_workouts
        }
        getFolders{
            id
            name
            content
          }
    }
`

export const GET_ROUTINES_BY_TOKEN = gql`
        query getRoutines{
            getRoutines{
            id
            name
            dones
            timeRecord
            exercises
            }
        }
          
    `
    export const GET_ROUTINE_BY_ID = gql`
    query getRoutineById($id:Int!) {
        getRoutineById(id:$id){
                  id
                  name
                  dones
                  timeRecord
                  exercises
              }
      }
      
`

export const GET_USERS = gql`
    query getUsers{
        getUsers{
        id
        user
        token
        }
    }
    `

export const GET_USER = gql`
    query getUser {
        getUser{
        user
        }
    }
`
export const GET_FOLDER = gql`
    query getFolderById {
        getFolderById(id:Int){
        id
        name
        content
        }
    }
`