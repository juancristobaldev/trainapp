import React, { useState } from "react";

const useWidthScreen = () => {

    const [widthScreen,updateWidthScreen ] = useState(window.innerWidth);

    const windowWidthChange = () => {
        updateWidthScreen(window.innerWidth);
    };
    
    window.addEventListener('resize', () => {
        windowWidthChange();
    });

    return {
        widthScreen
    }
}

export {useWidthScreen}