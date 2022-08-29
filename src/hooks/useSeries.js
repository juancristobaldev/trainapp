import React from "react";

const useSeries = (objectList) => {

    const {state,updateState} = objectList

    const addSerie = (e,nameExercise) => {
        e.preventDefault(e)
        const exercises = [...state.listOnCreate]
        const indexEx = exercises.findIndex( item => item.nameEx === nameExercise )
        const series = exercises[indexEx].seriesEx;

        const seriesID = []
        series.forEach( serie => {
            seriesID.push(serie.idSerie)
        })
        seriesID.sort((a,b) => {return b-a})

        const nLarge =  seriesID[0]

        const serie = {
            idSerie: nLarge + 1 || series.length + 1,
            reps:0
        }
        if(series.length === 0){
            series.push(serie)
        }else{
            serie.reps = series[series.length - 1].reps
            series.push(serie)
        }
        updateState({...state, listOnCreate:exercises})

    }

      const deleteSeries =  async (serie,item) => {
    
        const newList = [...state.listOnCreate]
        console.log(newList)
        const itemExercise = newList.find(exercise => exercise.nameEx === item.nameEx)
        console.log(itemExercise)
        const indexSerie = itemExercise.seriesEx.findIndex(item => item.idSerie === serie.idSerie)
        itemExercise.seriesEx.splice(indexSerie,1)

        updateState({...state, listOnCreate:newList})
      }

      const classControl = (type) => {
          if(type === 'Peso adicional') return 'typeAditional'
          else if(type === 'Peso asistido') return 'typeSupport'
          else if(type === 'Solo rep') return 'typeOnlyRep' 
          else if(type === 'Duracion') return 'typeTime'
        }

        return{
            addSerie,
            deleteSeries,
            classControl
        }
}

export {useSeries}