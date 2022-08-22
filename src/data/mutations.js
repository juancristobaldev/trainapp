import { gql } from "@apollo/client";

export const CREATE_USER = gql`
        mutation createUser($input:UserInput!){
            createUser(input:$input){
            errors
            success
            }
        }
    `

export const USER_SIGN_IN = gql`
    mutation userSignIn($input:UserSignInInput!){
        userSignIn(input:$input){
            errors
            success
            token
            user
        }
    }
`

export const CREATE_EXERCISE = gql`
    mutation createExercise($input:CreateExerciseInput!){
        createExercise(input:$input){
        errors
        success
        }
    }
`
export const DELETE_EXERCISE = gql`
    mutation deleteExercise($input:DeleteExerciseInput!){
        deleteExercise(input:$input){
        errors
        success
        }
    }  
`

export const CREATE_ROUTINE = gql`
    mutation createRoutine($input:CreateRoutineInput!){
        createRoutine(input:$input){
        errors
        success
        }
    }
`
export const DELETE_ROUTINE = gql`
    mutation deleteRoutine($input:DeleteRoutineInput!){
        deleteRoutine(input:$input){
        errors
        success
        }
    }
`