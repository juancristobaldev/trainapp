import React, { useState } from "react";
import { useEffect } from "react";
import { Text } from "../generals/Text";

const  FormControl = (
    {objState,autoComplete,value,type,name,children,placeholder,typeControl,label,onChange,className,error}
    ) => {
        const [valueInput, setValue] = useState('')
        console.log(error)
        let errorsItem;
        if(error !== undefined){
         errorsItem = error.filter(item => item !== undefined)
        }

        useEffect(() => {
            if(error && objState) objState.setState({...objState.state, modalErrors:{error:false,errors:{}},errors:{}})
        },[valueInput])

        console.log(errorsItem)
        
            return(
                <React.Fragment>
                    {
                    typeControl == "select" &&
                        <div className={className}>
                    {label && 
                            <label>{label}</label>
                    }
                            <select 
                            name={name}
                            onChange={(event) => {
                                onChange(event,name)
                                setValue(event.target.value)
                                }}>
                                {children}
                            </select>
                        </div>
                    }
                    {typeControl == "input" && 
                    <div className={className}>
                    {label && 
                        <label>{label}</label>
                    }
                        <input
                        autoComplete={autoComplete}
                        placeholder={placeholder}
                        value={value}
                        className={`${errorsItem.length > 0 && 'error'}`}
                        name={name}
                        type={type}
                        onChange={(event) => {
                            onChange(event,name)
                            setValue(event.target.value)
                            }}/>
                        {errorsItem.length > 0 &&
                            errorsItem.map(item => 
                                item !== undefined &&
                                    <Text 
                                    style={{color:'red'}}
                                    text={item}/>    
                            )
                        }
                    </div>
                    }
                    
                </React.Fragment>
            )
}

export {FormControl}