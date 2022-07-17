import React from "react";
import { FormControl } from "../Form/FormControl";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import {RiDeleteBin6Fill} from "react-icons/ri"
import {MdDone} from "react-icons/md"
import {IoMdClose} from "react-icons/io"

import '../../styles/ListSeries.scss'
import { Serie } from "../Serie";
  




const ListSeries = ({object,setList,list,getDataRoutine}) => {

      const addSerie = (e,nameExercise) => {
        e.preventDefault(e)
        const exercises = [...list]
        const indexEx = exercises.findIndex( item => item.nameEx === nameExercise )
        const series = exercises[indexEx].seriesEx;
        const serie = {
            idSerie: series.length + 1,
            reps:0
        }
        if(series.length === 0){
            series.push(serie)
        }else{
            serie.reps = series[series.length - 1].reps
            series.push(serie)
        }
        console.log(series)
        setList(exercises)

    }

      const deleteSeries =  (serie) => {
        const newList = [...list]
        const itemExercise = newList.find(item => item.nameEx === object.nameEx)
        const indexSerie = itemExercise.seriesEx.findIndex(item => item.idSerie === serie.idSerie)
        itemExercise.seriesEx.splice(indexSerie,1)
        
        for(var i = 1; i <= itemExercise['seriesEx'].length; i++){
            itemExercise['seriesEx'][i - 1].idSerie = i
        }

        setList(newList)
      }
      
      const classControl = (type) => {
          if(type === 'Peso adicional'){
            return 'typeAditional'
          }else if(type === 'Peso asistido'){
            return 'typeSupport'
          }else if(type === 'Solo rep'){
            return 'typeOnlyRep'
          }else if(type === 'Duracion'){
            return 'typeTime'
          }
        }

    return (
        <Container 
        className="listSerie"
        style={
            {
                display:"flex",
                justifyContent:'space-around',
                flexDirection:"column",
            }
        }>
                {
                    object.seriesEx.map(serie => 
                        <Container
                        key={serie.idSerie}
                        className={classControl(object.typeEx) + ' serie'}
                        >
                        <IoMdClose
                        onClick={() => deleteSeries(serie)}
                         />
                        <Text text={serie.idSerie} />
                        <Text text={object.nameEx} />
                        {object.typeEx === 'Peso adicional' || object.typeEx === 'Peso asistido' ?
                          <Serie>
                            <FormControl
                            style={{width:"35%"}}
                            name={object.nameEx}
                            serie={serie.idSerie}
                            typeEx={object.typeEx}
                            nameInput={'adicional'}
                            onChange={getDataRoutine}
                            typeControl="input"
                            type="number"

                            />
                            <FormControl
                            style={{width:"35%"}}
                            name={object.nameEx}
                            serie={serie.idSerie}
                            typeEx={object.typeEx}
                            onChange={getDataRoutine}
                            typeControl="input"
                            type="number"
                            />
                          </Serie>
                          :
                          object.typeEx === 'Duracion' ?
                              <FormControl
                              className={'inputSerie'}
                              name={object.nameEx}
                              serie={serie.idSerie}
                              typeEx={object.typeEx}
                              onChange={getDataRoutine}
                              style={{width:"35%"}}
                              typeControl="input"
                              type="time"
                              />
                          :
                          <FormControl
                          className={'inputSerie'}
                          name={object.nameEx}
                          serie={serie.idSerie}
                          typeEx={object.typeEx}
                          onChange={getDataRoutine}
                          style={{width:"35%"}}
                          typeControl="input"
                          type="number"
                          />
                        }

                        {
                          
                        }
                        </Container>
                    ) 
                }
                <button 
                        onClick={(e) => addSerie(e,object.nameEx)}>
                            + {object.nameEx}
                </button>
        </Container>
    )
}

export { ListSeries }