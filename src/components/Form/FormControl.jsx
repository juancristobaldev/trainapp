import React, { useState } from "react";
import { useEffect } from "react";
import { Text } from "../generals/Text";

const  FormControl = (
    {autoComplete,value,type,name,children,placeholder,typeControl,label,onChange,className,error}
    ) => {
        let errorsItem;
        if(error !== undefined){
         errorsItem = Object.values(error).filter(item => item !== undefined)
        }
        
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
                            onChange={(event) => onChange(event,name)}>
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
                        onChange={(event) => onChange(event,name)}/>
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