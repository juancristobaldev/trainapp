import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie/es6";
import { CreateExercise } from "../Create/CreateExercise";
import { Form } from "../Form/Form";
import { FormControl } from "../Form/FormControl";
import { Container } from "../generals/Container";
import { Text } from "../generals/Text";
import { Modal } from "../Modal/Modal";

const ListExercisesSelect = ({close, list, setList}) => {

    const [listExercisesSelect,setListExercisesSelect] = useState([]);
    const [modalCreate,setModalCreate] = useState(false);
    const [modalDelete,setModalDelete] = useState({
        boolean:false,
        items:[]
    })
    const [modalError, setModalError] = useState({
        error:false,
        message:false,
    })
    const [nSelect,setNSelect] = useState(0)

    const getExercises = async () => {
        const cookies = new Cookies();
        const user = cookies.get('user')
    
        let dataBack;
    
        await fetch(`http://localhost:3001/api/select/exercises/user/${user.id}`)
        .then(response => response.json())
        .then(data => dataBack = data);
        
        dataBack.forEach(item => {
            item['isAdded'] = false;
            item['select'] = false;
        })

        if(list.length > 0){
            list.forEach(item => {
                const index = dataBack.findIndex(itemData => itemData.nameEx === item.nameEx);
                if(index >= 0){
                    dataBack.splice(index,1)
                }
            })
            setListExercisesSelect(dataBack)
        }else{
            setListExercisesSelect(dataBack)
        }
    }

    const selectOfTheList = (name) => {
        const newList = [...listExercisesSelect];
        newList.forEach(item => {
            if(item.nameEx === name){
                if(item.select) item.select = false
                else item.select = true
            } 
        })
        const n = newList.filter(item => item.select === true)
        setListExercisesSelect(newList)
        setNSelect(n.length)
    }

    const addExerciseToList = async () => {
        const newList = [...list]
        const listSelect = [...listExercisesSelect]
        const listSelectFilt = listExercisesSelect.filter(item => item.select === true);

        if(listSelectFilt.length > 0){
            listSelect.forEach(item => {
                const index = newList.findIndex(itemList => itemList.nameEx === item.nameEx);
                if(index < 0){
                    if(item.select === true){
                        item.select = false
                        item.isAdded = true
                        item.seriesEx = JSON.parse(item.seriesEx)
                        newList.push(item);
                    }
                }else{
                   console.log('No puedes agregar dos veces el mismo ejercicio') 
                }
            })
            const filtList = listSelect.filter(item => item.isAdded !== true)
            setList(newList)
            setListExercisesSelect(filtList)
            setNSelect(0)
        }else{
            setModalError({
                error:true,
                message:'Debes seleccionar al menos un ejercicio...'
            })
        }
    }

    const deleteExerciseToList = async (confirmation,items) => {
        const filter = listExercisesSelect.filter(item => item.select === true)
        if(filter.length > 0){
            if(confirmation){
                const cookies = new Cookies();
                const user = cookies.get('user')
                console.log(filter)
                const requestOption = {
                    method:'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(filter)
                };

                const deleteOfState = () => {
                    const unSelect = listExercisesSelect.filter(item => item.select !== true)
                    setListExercisesSelect(unSelect)
                }
                
                const response = await fetch(`http://localhost:3001/api/exercises/delete-exercise/${user.id}`, requestOption);
                response.json()
                .then(data => data === true &&
                    setModalDelete({
                        boolean:false,
                        items:[]
                    })
                )

                deleteOfState()   
                
            }else{
                const objDelete = {
                    boolean:true,
                    items:[]
                }
                filter.forEach(items => {
                    objDelete.items.push(items.nameEx)
                })
                setModalDelete(objDelete)
            }
        }else{
            const error = {
                error:true,
                message:'Debes seleccionar al menos un ejercicio',
            }

            setModalError(error)
        }
    }

    useEffect(() => {
        getExercises()
    },[])

    const totalSelectItem = listExercisesSelect.filter(item => item.select === true).length

    return(
        <Container>
            <Container>
                <Text text={'Lista de ejercicios'}/>
                <button
                onClick={() => close(false)}
                >
                Cerrar</button>
                {totalSelectItem > 0 && 
                    <button
                    onClick={ () => addExerciseToList() }
                    >Agregar {nSelect > 0 && `(${nSelect})`}
                    </button>            
                }
            </Container>
            {listExercisesSelect.length === 0 && <Text text='Buscando ejercicios...' />}
            {listExercisesSelect.map( item => 
                <Text
                    onClick={selectOfTheList}xw
                    className={item.select ? 'onSelect' : 'offSelect'}
                    text={item.nameEx}
                    key={item.nameEx}
                />
            )}
            <Container>
                <Container>
                    {totalSelectItem > 0 &&
                        <button
                        onClick={ () => deleteExerciseToList() }
                        >Eliminar ejercicios {nSelect > 0 && `(${nSelect})`}
                        </button>                    
                    }
                </Container>
                <Container>
                    <button
                    onClick={ () => setModalCreate(!modalCreate) }
                    >Crear ejercicio</button>
                </Container>
            </Container>
            {modalCreate &&
                <Modal>
                    <CreateExercise
                    getExercises={getExercises}
                    modal={setModalCreate}
                    />
                </Modal>  
            }
            {
                modalDelete.boolean === true && 
                <Modal>
                    <p>¿Estas seguro que deseas eliminar los siguientes ejercicios?</p>
                    {modalDelete.items.map(item => 
                    <p 
                    key={item}
                    style={{
                        color:"red"
                    }}>{item}</p>
                    )}
                    <button
                    onClick={() => deleteExerciseToList(true)}
                    >Aceptar</button>
                    <button
                    onClick={() => setModalDelete({
                        boolean:false,
                        items:true
                    })}
                    >Cancelar</button>
                </Modal>
            }
            {
                modalError.error === true &&
                <Modal>
                    <p
                    style={{
                        color:"red"
                    }}
                    >{modalError.message}</p>
                    <button
                    onClick={() => setModalError({
                        error:false,
                        message:'',
                    })}
                    >Aceptar</button>
                </Modal>
            }
        </Container>
    )
}

export { ListExercisesSelect }