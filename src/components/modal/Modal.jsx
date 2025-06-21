import React, { useState, useEffect } from "react";

const Modal = ({ isOpen, children }) => {
    return (
        <>
            {/* {isOpen && (
                
            )} */}

            <div className={isOpen ? "modal-overlay open" : 'modal-overlay close'}>
                <div>
                    {children}
                </div>
            </div>
        </>
    );
};

export default Modal;
