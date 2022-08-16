import { gql } from "@apollo/client";


export const GET_EXERCISES_BY_TOKEN = gql`
    query getExercisesByToken($token:String!) {
        getExercisesByToken(token:$token){
                nameEx
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
        }
    }
`

export const GET_ROUTINES_BY_TOKEN = gql`
        query getRoutinesByToken {
            getRoutinesByToken(token:String){
            id
            user
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
        getUser(token:String){
        user
        }
    }
`