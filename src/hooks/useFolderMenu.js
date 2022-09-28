import { React, useEffect, useState } from "react"

const useFolderMenu = (routines,folder) => {
    
    

    const [listRoutines, updateListRoutines] = useState(routines),
    [actualList,updateActualList] = useState([])
    console.log(actualList)

    const selectRoutine = async (id) => {
        let newList = [...listRoutines]
        await newList.forEach(item => {
            if(id === item.id){
                if(item.checked === true) item.checked = false;
                else item.checked = true
            }
        })
        await updateListRoutines(newList)
    }

    

    useEffect(() => {
        let newList = [...listRoutines]
        const routinesFolder = JSON.parse(folder.content)
        if(listRoutines !== undefined){
            if(routinesFolder.length !== 0) routinesFolder.forEach(item => {
                const index = listRoutines.findIndex(routines => routines.id !== item.id)
                console.log(index)
                if (index >= 0) {
                    console.log(index)
                    let routineSelect = listRoutines[index]
                    routineSelect.checked = false
                    routineSelect.added = false
                    console.log(routineSelect)
                }
            })

            updateActualList(newList)
        }
    },[folder,routines])

    return {
        actualList,selectRoutine
    }
}

export { useFolderMenu }