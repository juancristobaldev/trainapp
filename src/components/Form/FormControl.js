import React from "react";

const  FormControl = (
    {type,name,children,typeControl,label,onChange,className}
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
                name={name}
                type={type}
                onChange={(event) => onChange(event,name)}/>
            </div>
            }
        </React.Fragment>
    )
}

export {FormControl}