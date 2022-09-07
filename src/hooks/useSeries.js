import React from "react";

const useSeries = (objectList) => {

    const {state,updateState} = objectList

    const addSerie = (e,idList) => {
        e.preventDefault(e)
        const exercises = [...state.listOnCreate]
        const indexEx = exercises.findIndex( item => item.idList === idList)
        const series = exercises[indexEx].seriesEx;

        const seriesID = []
        series.forEach( serie => {
            seriesID.push(serie.idSerie)
        })
        seriesID.sort((a,b) => {return b-a})

        const nLarge =  seriesID[0]

        const serie = {
            idSerie: nLarge + 1 || series.length + 1,
            reps:0,
            checked:false,
        }
        if(series.length === 0){
            series.push(serie)
        }else{
            serie.reps = series[series.length - 1].reps
            series.push(serie)
        }
        updateState({...state, listOnCreate:exercises})

    }

    const checkSerie = async (serie,item) => {
        const newList = [...state.listOnCreate]
        const itemExercise = newList.find(exercise => exercise.idList === item.idList)
        const indexSerie = itemExercise.seriesEx.findIndex(item => item.idSerie === serie.idSerie)
        
        if(itemExercise.seriesEx[indexSerie].checked === false) itemExercise.seriesEx[indexSerie].checked = true
        else itemExercise.seriesEx[indexSerie].checked = false

        updateState({...state, listOnCreate:newList})
    }

      const deleteSeries =  async (serie,item) => {
        const newList = [...state.listOnCreate]
        const itemExercise = newList.find(exercise => exercise.idList === item.idList)
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
            checkSerie,
            addSerie,
            deleteSeries,
            classControl
        }
}

export {useSeries}