import { gql } from "@apollo/client";

export const CREATE_USER = gql`
        mutation createUser($input:UserInput!){
            createUser(input:$input){
            errors
            success
            }
        }
    `

export const UPDATE_USER = gql`
    mutation updateUser($input:UserUpdateInput!){
        updateUser(input:$input){
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

export const UPDATE_ROUTINE = gql`
    mutation updateRoutine($input:UpdateRoutineInput!){
        updateRoutine(input:$input){
        errors
        success
        }
    }
`
export const CREATE_FOLDER = gql`
    mutation createFolder($input:CreateFolderInput!){
        createFolder(input:$input){
        errors
        success
        }
    }
`

export const UPDATE_FOLDER = gql`
    mutation updateFolder($input:UpdateFolderInput!){
        updateFolder(input:$input){
        errors
        success
        }
    }  
`

export const DELETE_FOLDER = gql`
    mutation deleteFolder($input:DeleteFolderInput!){
        deleteFolder(input:$input){
        errors
        success
        }
    }  
`