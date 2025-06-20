import React from 'react';
import './button.css'
import { Button } from '@mui/material';
const Buttons = ({ value, onClick, className, color }) => {
    return (
        <>
            <Button
                variant='contained'
                color={color}
                className='py-3 fs-3'

                // className={`button ${className || ''}`}
                onClick={() => onClick(value)}
            >
                {value}
            </Button>
            {/* <button
                className={`button ${className || ''}`}
                onClick={() => onClick(value)}
            >

            </button> */}
        </>
    );
};

export default Buttons;
