import React, { useEffect, useState } from "react";

const useGet = (url) => {

    const [data,updateData] = useState({})
    const [loading,updateLoading] = useState(true)
    const [error,updateError] = useState(false)

    const execute = async () => {
        const response = await fetch(url)
        updateLoading(false)
        response.json()
        .then(res => res ? updateData(res) : updateError(true))
    }

    useEffect(() => {
        execute()
    },[])

    return{
        data,
        loading,
        error
    }


}

export {useGet}