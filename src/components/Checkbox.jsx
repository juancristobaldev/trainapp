import {React} from "react";
import '../styles/checkbox.scss';
import {FaCheck} from 'react-icons/fa'
import { useDarkMode } from "../hooks/useDarkMode";

export default function CheckBox(props){
    
    const { darkMode } = useDarkMode()

    if(props.select == true){
        return  <div className={`checkBoxItem ${darkMode && 'darkMode'}`}>
                    <div
                     style={props.style}
                    onClick={props.onClick ? () => props.onClick() : undefined}
                    className={`checkBoxOn ${darkMode && 'darkMode'}`}
                    >
                        <FaCheck fill="white"/>
                    </div>
                </div>
    } 
    else return <div className={`checkBoxItem ${darkMode && 'darkMode'}`}>
                    <div 
                    onClick={props.onClick ? () => props.onClick(): undefined}
                    className={`checkBoxOff ${darkMode && 'darkMode'}`}
                    >
                </div></div>
}