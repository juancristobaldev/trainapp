import { gql } from "@apollo/client";

export const GET_EXERCISES_BY_TOKEN = gql`
query getExercisesByToken($token:String!) {
    getExercisesByToken(token:$token){
            id
            name
            typeEx
            muscleEx
            seriesEx
    }
}`

export const GET_ROUTINES_AND_USER_BY_TOKEN = gql`
    query($token:String!){
        getRoutinesByToken(token:$token){
            id
            name
            token
            dones
            timeRecord
            exercises
    }
        getUser(token:$token){
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
    query($token:String!){
        getRoutinesByToken(token:$token){
            id
            name
            token
            dones
            timeRecord
            exercises
    }
        getUser(token:$token){
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
        getFoldersByToken(token:$token){
            id
            token
            name
            content
          }
    }
`

export const GET_ROUTINES_BY_TOKEN = gql`
        query getRoutinesByToken($token:String!){
            getRoutinesByToken(token:$token){
            id
            token
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
                  token
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
        getUser(id:Int){
        user
        }
    }
`
