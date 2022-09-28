import {React} from "react";
import '../styles/checkbox.scss';
import {FaCheck} from 'react-icons/fa'

export default function CheckBox(props){

    if(props.select == true){
        return  <div className="checkBoxItem">
                    <div
                    onClick={props.onClick ? () => props.onClick() : undefined}
                    className="checkBoxOn"
                    >
                        <FaCheck fill="white"/>
                    </div>
                </div>
    } 
    else return <div className="checkBoxItem">
                    <div 
                    onClick={props.onClick ? () => props.onClick(): undefined}
                    className="checkBoxOff"
                    >
                </div></div>
}