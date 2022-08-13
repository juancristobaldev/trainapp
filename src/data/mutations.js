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