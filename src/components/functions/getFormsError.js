const getErrorsForm = (arrayRequired) => {
    const errorsForm = []
    arrayRequired.forEach(item => {
        console.log(Array.isArray(item.property))
        if(Array.isArray(item.property)){
            if(item.property.length === 0){
                errorsForm.push(item.error)
            }
        }else{
            if(!item.property){
                errorsForm.push(item.error)
            }
        }
    })
    return { errorsForm }
}

export {getErrorsForm}