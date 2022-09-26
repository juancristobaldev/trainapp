import React, { useEffect } from "react";
import { useState } from "react";
import { Container } from "./generals/Container";
import { InputSearch } from "./InputSearch";
import { ListApi } from "./Lists/ListApi";


const ContainerSearch = (
    {
        onEmptySearch,
        searchValues,
        name,
        classSpan,
        classDiv,
        classList,
        textSearch,
        onChange,
        error,
        loading,
        data,
        onError,
        onLoading,
        onEmpty,
        render,
        children,
        button
    }
    ) => {

    const [dataSearch,updateDataSearch] = useState([])
  
    const searchExercise = () => {
        if(data){
            const newData = [...data];
            if(!searchValues[name].length >= 1) updateDataSearch(newData);
            else{
                let newList = [];
                newData.forEach( item => {
                    const nameItem = item.name.toLowerCase(),
                    searchItem = searchValues[name].toLowerCase();
                    if(nameItem.includes(searchItem)) newList.push(item)
                })
                updateDataSearch(newList)
            }
        }
    }

    useEffect(() => {
        searchExercise()
    },[searchValues[name],data])

    return (
        <>
                <InputSearch
                textSearch={textSearch}
                classNameSpan={classSpan}
                classNameDiv={classDiv}
                onChange={onChange}
                name={name}
                button={button}
                /> 
                <ListApi
                children={children}
                searchContents={dataSearch}
                data={data}
                className={classList}
                error={error}
                loading={loading}
                onError={onError}
                onLoading={onLoading}
                onEmpty={onEmpty}
                onEmptySearch={onEmptySearch}
                render={render}
                />
        </>
    )
}

export {ContainerSearch}