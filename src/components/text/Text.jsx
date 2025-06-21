import React from 'react'
import './text.css'
const Text = ({ title, value, fontSize, classTitle, classValue, click }) => {
    return (
        <>
            <div className='text-container' onClick={click}>
                <p className={`${classTitle} t-title`} style={{ fontSize: `${fontSize - 2}px` }}>{title}</p>
                <p className={`${classValue} t-value `} style={{ fontSize: `${fontSize + 2}px` }}>{value}</p>
            </div>
        </>
    )
}

export default Text
