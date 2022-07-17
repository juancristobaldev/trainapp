import React from "react";

const  FormControl = (
    {type,name,children,placeholder,serie,nameInput,typeEx,typeControl,label,onChange,style,className}
    ) => {

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
                placeholder={placeholder}
                style={style}
                name={name}
                type={type}
                onChange={(event) => onChange(event,name,nameInput,serie,typeEx)}/>
            </div>
            }
        </React.Fragment>
    )
}

export {FormControl}