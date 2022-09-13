import { useEffect } from "react";

const useSearch = (data,state,item) => {

    const searchExercise = () => {
        if(data){
            let newData 
            if(item) newData = [...JSON.parse(JSON.stringify(data[item]))];
            else newData = [...JSON.parse(JSON.stringify(data))];

            if(!searchValue.length >= 1){
                setListExercisesSelect(newData)
            }
            else{
                let newList = []
                newData.forEach(exercise => {
                    const nameEx = exercise.nameEx.toLowerCase(),
                    searchExercise = searchValue.toLowerCase()
                    if(nameEx.includes(searchExercise)){
                        newList.push(exercise)
                    }
                })
                setListExercisesSelect(newList)
            }
        }
    }

    useEffect(() => {
        searchExercise()
    },[state])
}