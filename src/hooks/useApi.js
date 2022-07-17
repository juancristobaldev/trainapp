import React, { useEffect, useState } from "react";

const useApi = (url) => {
    const [data,setData] = useState({})
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(false)

    const execute = async () => {
        const response = await fetch(url)
        response.json()
        .then(data => data ? 
        setData(data) : setError(true) )
        setLoading(false)
    }

    const postApi = (url,body) => {
        const object = {    
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify(body)
        }

        console.log(object)
    }

    useEffect(() => {
        execute()
    },[])
    

    return {
        data,
        loading,
        error,
        postApi
    }
    

}

export {useApi}