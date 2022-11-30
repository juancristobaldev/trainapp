import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_ROUTINES_BY_TOKEN } from "../data/query";



const useList = (nameContent,stateComponent,repeat,apollo) => {
    const {nameGql,gql} = apollo,
    {state,updateState} = stateComponent

    const [ listForSelect,updateListForSelect] = useState([])
    const [dataDone, updateDataDone] = useState([])
    const { data,loading, error } = useQuery(gql)

    console.log(data)

    const getItems = async () => {
        if(data){
            let dataBack = [...JSON.parse(JSON.stringify(data[nameGql]))];

            await dataBack.forEach(item => {
                const itemsSelected = listForSelect.filter(item => item.select === true)
                const index = itemsSelected.findIndex(itemSelected => itemSelected.id === item.id)
                if(listForSelect.length && itemsSelected.length && index >= 0) item['select'] = true;
                else item['select'] = false;
                item['added'] = false;
            })
            
            if(!repeat){
                const idsData = [];
                if(state.dataFormCreate[nameContent].length > 0){
                    await state.dataFormCreate[nameContent].forEach(item => {
                        idsData.push(item.id)
                    })
                    for(var i = 0; i < idsData.length; i++){
                        const index = dataBack.findIndex(item => item.id === idsData[i])
                        dataBack.splice(index,1)
                    }
                }
            }

            updateListForSelect(dataBack)
            updateDataDone([...JSON.parse(JSON.stringify(data[nameGql]))])
        }
    }

    const selectOfTheList = (id) => {
        let newList = [...listForSelect];
        newList.forEach(item => {
            if(item.id === id){
                if(item.select) item.select = false
                else item.select = true
            } 
        })
        updateListForSelect(newList)
    }

    const addItem = async (type) => {
        const newList = [...state.listOnCreate]
        const listSelect = [...listForSelect]
        const listSelectFilt = listForSelect.filter(item => item.select === true);
        const newFormCreate  = {...state.dataFormCreate}

        if(listSelectFilt.length > 0){
            await listSelect.forEach(item => {
                if(item.select === true){
                    if(type === "exercise") {
                        item.seriesEx = JSON.parse(item.seriesEx)
                    }
                    item.select = false
                    newList.push(item)
                    newFormCreate[nameContent].push(item)
                }
            })

            for(var i = 0; i < newList.length; i++) newList[i].idList = i
            updateState({...state,modal:false, listOnCreate:newList, dataFormCreate:{...state.dataFormCreate, [nameContent]:newList} })
        }
    }

    const deleteItem = (item,type) => {
        if(type === "exercise"){
            const newList = [...state.listOnCreate]
            const newFormCreate = {...state.dataFormCreate}

            const index = newList.findIndex(itemFind => itemFind.idList === item.idList)
            
            newList.splice(index,1)

            updateState({...state,listOnCreate:newList, dataFormCreate:newFormCreate})
        }else{
            const newFormCreate = {...state.dataFormCreate},
            index = newFormCreate[nameContent].findIndex(itemFind => itemFind.id === item.id)
            newFormCreate[nameContent].splice(index,1)
            updateState({...state,dataFormCreate:newFormCreate})
        }
    }

    useEffect(() => {
    getItems()
    },[data,state.dataFormCreate[nameContent],state.searchValue,state.listOnCreate])
    return {
        dataDone,
        loading,
        error,
        listForSelect,
        updateListForSelect,
        selectOfTheList,
        addItem,
        deleteItem
    }
}

export {useList}